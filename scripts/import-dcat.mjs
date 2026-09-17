// Imports the product catalogue from the old site (https://dcat.shop) into this repo.
// It reads the same public tables the old site reads in the browser (its Supabase project,
// publishable key) and writes:
//   lib/data/catalogue/raw/*.json     untouched snapshot of each table
//   lib/data/catalogue/catalogue.json cleaned data the /catalogue pages use
// Run from the repo root: node scripts/import-dcat.mjs
// Only public catalogue tables are read; enquiries and admin data are never touched.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SUPABASE_URL = "https://tnxjdwapcgsaxwfwmigu.supabase.co/rest/v1";
const PUBLISHABLE_KEY = "sb_publishable_keX6vs-mJ4LC1CTVsrSRsg_8cRma9fx";
const OUT = join(process.cwd(), "lib", "data", "catalogue");

async function table(path) {
  const res = await fetch(`${SUPABASE_URL}/${path}`, {
    headers: { apikey: PUBLISHABLE_KEY, Authorization: `Bearer ${PUBLISHABLE_KEY}` },
  });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status} ${await res.text()}`);
  return res.json();
}

const clean = (s) =>
  String(s ?? "")
    .replace(/ /g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Description without the page furniture the old site flattened into it. */
function cleanDescription(s) {
  return clean(s)
    .replace(/\s*Upload Date\s+Title\s+Download[\s\S]*$/i, "")
    .replace(/\b(Technical Specification|Techincal Details|Feature & Benefits)(\s+Download)?\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Rows that are page furniture, not specifications.
const JUNK_LABEL = /^(upload date|title|download|technical specification|features?|feature & benefits)$/i;
const DATE_LABEL = /^\d{2}[-/]\d{2}[-/]\d{4}$/;
// Commercial terms get their own group on the product page.
const TERMS_LABEL = /^(gst|gst tax|gst 18%|courier|courier charges|warranty|note|expandable|delivery|shipping)/i;

function splitSpecs(rows) {
  const specs = [];
  const terms = [];
  for (const row of rows ?? []) {
    const label = clean(row.label);
    const value = clean(row.value);
    if (!label || !value) continue;
    if (/^upload date$/i.test(label)) break; // everything after this is the brochure download table
    if (DATE_LABEL.test(label) || JUNK_LABEL.test(label)) continue;
    if (/^features?$/i.test(label) && /^benefits?$/i.test(value)) continue;
    (TERMS_LABEL.test(label) ? terms : specs).push({ label, value });
  }
  return { specs, terms };
}

// "Dell Latitude 5420 | Intel Core i5 | 8 GB RAM" -> title + highlight chips
function splitName(name) {
  const parts = clean(name)
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean);
  return { title: parts[0] ?? clean(name), highlights: parts.slice(1) };
}

function shopifyImage(url, width = 1200) {
  if (!url) return null;
  const u = new URL(url);
  u.searchParams.set("width", String(width));
  return u.toString();
}

const [settingsRows, categories, products] = await Promise.all([
  table("site_settings?select=*"),
  table("product_categories?select=*&order=sort_order,name"),
  table("products?select=*&is_active=eq.true&order=sort_order,name"),
]);

mkdirSync(join(OUT, "raw"), { recursive: true });
writeFileSync(join(OUT, "raw", "site_settings.json"), JSON.stringify(settingsRows, null, 2) + "\n");
writeFileSync(join(OUT, "raw", "product_categories.json"), JSON.stringify(categories, null, 2) + "\n");
writeFileSync(join(OUT, "raw", "products.json"), JSON.stringify(products, null, 2) + "\n");

const categoryById = new Map(categories.map((c) => [c.id, c]));

const catalogue = {
  source: "https://dcat.shop",
  importedAt: new Date().toISOString(),
  categories: categories.map((c) => ({
    slug: c.slug,
    name: clean(c.name),
    description: clean(c.description),
    image: shopifyImage(c.image_url, 800),
    sortOrder: c.sort_order,
    productCount: products.filter((p) => p.category_id === c.id).length,
  })),
  products: products.map((p) => {
    const { title, highlights } = splitName(p.name);
    const { specs, terms } = splitSpecs(p.specs);
    const images = [...new Set([p.image_url, ...(p.gallery ?? [])].filter(Boolean))].map((u) => shopifyImage(u));
    return {
      slug: p.slug,
      name: clean(p.name),
      title,
      highlights,
      category: categoryById.get(p.category_id)?.slug ?? null,
      // Descriptions on the old site are flattened spec sheets; keep them for products without a spec table.
      description: cleanDescription(p.description),
      specs,
      terms,
      images,
      videos: (p.video_urls ?? []).filter(Boolean),
      // A few brochure links on the old site lack their scheme ("://cdn.shopify.com/...").
      brochure: p.brochure_url ? p.brochure_url.replace(/^(?:https?:)?:?\/\//, "https://") : null,
      sortOrder: p.sort_order,
      updatedAt: p.updated_at,
    };
  }),
};

writeFileSync(join(OUT, "catalogue.json"), JSON.stringify(catalogue, null, 2) + "\n");
console.log(
  `imported ${catalogue.products.length} products, ${catalogue.categories.length} categories, ` +
    `${catalogue.products.reduce((n, p) => n + p.images.length, 0)} images, ` +
    `${catalogue.products.reduce((n, p) => n + p.videos.length, 0)} videos, ` +
    `${catalogue.products.filter((p) => p.brochure).length} brochures`,
);
