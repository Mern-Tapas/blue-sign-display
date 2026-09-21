/**
 * Product catalogue imported from the old site (https://dcat.shop).
 * Regenerate with `node scripts/import-dcat.mjs`, then `node scripts/download-dcat-media.mjs`
 * (downloads every image, video and brochure into public/catalogue/ and writes media.json).
 * Never edit the JSON files by hand.
 * Server-only: the JSON is ~400 KB, so pass individual products to client components as props.
 */
import { series, sizeRange } from "@/lib/data/can-products";
import data from "./catalogue.json";
import mediaMap from "./media.json";

const localMedia = mediaMap as Record<string, string>;

/** Local copy of an imported file when it has been downloaded, else the original URL. */
function local(url: string): string;
function local(url: string | null): string | null;
function local(url: string | null) {
  if (!url) return null;
  return localMedia[url] ?? url.replace(/^(?:https?:)?:?\/\//, "https://");
}

export type CatalogueSpec = { label: string; value: string };

export type CatalogueCategory = {
  slug: string;
  name: string;
  description: string;
  image: string | null;
  sortOrder: number;
  productCount: number;
};

export type CatalogueProduct = {
  slug: string;
  /** Full name as listed on the old site. */
  name: string;
  /** First segment of the name, before any "|". */
  title: string;
  /** Remaining "|" segments, e.g. "8 GB RAM". */
  highlights: string[];
  category: string | null;
  description: string;
  specs: CatalogueSpec[];
  /** Warranty, GST and delivery terms. */
  terms: CatalogueSpec[];
  images: string[];
  videos: string[];
  brochure: string | null;
  sortOrder: number;
  updatedAt: string;
  /** Set for CAN series listed in the catalogue: their detail page lives under /products. */
  href?: string;
  brand?: "CAN";
};

export const catalogueSource = data.source;
export const catalogueImportedAt = data.importedAt;

/** Products imported from dcat.shop (each has its own /catalogue/<slug> page). */
export const catalogueProducts = (data.products as CatalogueProduct[]).map((p) => ({
  ...p,
  images: p.images.map((u) => local(u)),
  videos: p.videos.map((u) => local(u)),
  brochure: local(p.brochure),
}));

/** Which catalogue category each CAN series is listed under. */
const CAN_CATEGORY: Record<string, string> = {
  canlit: "kiosk-standee",
  can: "kiosk-standee",
  canvue: "kiosk-standee",
  canwalk: "kiosk-standee",
  canmount: "digital-signage-solution",
  cannx: "digital-signage-solution",
  candesk: "digital-signage-solution",
  "candesk-touch": "digital-signage-solution",
  "candesk-tab": "digital-signage-solution",
  "candesk-wid": "digital-signage-solution",
};

/** CAN series shown as catalogue cards; they link to their existing /products/<slug> page. */
const canEntries: CatalogueProduct[] = series.map((s, i) => ({
  slug: `can-${s.slug}`,
  name: `${s.name} · ${s.headline}`,
  title: `${s.name} · ${s.headline.replace(/\.$/, "")}`,
  highlights: s.highlights,
  category: CAN_CATEGORY[s.slug] ?? null,
  description: `${s.summary} Models: ${s.models.map((m) => m.name).join(", ")}. ${sizeRange(s)}.`,
  specs: [],
  terms: [],
  images: s.images.slice(0, 1).map((img) => img.src),
  videos: [],
  brochure: null,
  sortOrder: -1000 + i,
  updatedAt: "",
  href: `/products/${s.slug}`,
  brand: "CAN",
}));

/** Everything listed on /catalogue: CAN series first, then the imported products. */
export const catalogueEntries: CatalogueProduct[] = [...canEntries, ...catalogueProducts];

export const catalogueCategories = (data.categories as CatalogueCategory[])
  .map((c) => ({
    ...c,
    image: local(c.image),
    productCount: catalogueEntries.filter((p) => p.category === c.slug).length,
  }))
  .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));

/** Categories that have at least one product. */
export const activeCategories = catalogueCategories.filter((c) => c.productCount > 0);

export function getCatalogueProduct(slug: string) {
  return catalogueProducts.find((p) => p.slug === slug);
}

export function getCatalogueCategory(slug: string | null | undefined) {
  return slug ? catalogueCategories.find((c) => c.slug === slug) : undefined;
}

export function searchCatalogue({ query, category }: { query?: string; category?: string }) {
  const terms = (query ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  return catalogueEntries.filter((p) => {
    if (category && p.category !== category) return false;
    if (!terms.length) return true;
    const haystack = `${p.name} ${p.brand ? p.description : ""} ${p.specs.map((s) => `${s.label} ${s.value}`).join(" ")} ${
      getCatalogueCategory(p.category)?.name ?? ""
    }`.toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}

/** Overview text worth showing: not a copy of the title or a bare "PDF download" line. */
export function productOverview(p: CatalogueProduct) {
  const text = p.description.replace(/^PDF DOWNLOAD LINK\s*:\s*/i, "").trim();
  if (!text || text.toLowerCase() === p.title.toLowerCase()) return "";
  return text;
}

/** A few spec values that summarise the product on a card. */
export function keySpecs(p: CatalogueProduct, max = 3) {
  if (p.highlights.length) return p.highlights.slice(0, max);
  const wanted = /^(resolution|memory|ram|storage|processor|cpu|os|brightness|diagonal size|screen|panel size|touch)$/i;
  return p.specs
    .filter((s) => wanted.test(s.label) && s.value.length <= 32)
    .slice(0, max)
    .map((s) => s.value);
}

/** Up to six short spec rows for the product summary (skips long feature/benefit sentences). */
export function summarySpecs(p: CatalogueProduct, max = 6) {
  return p.specs.filter((s) => s.label.length <= 28 && s.value.length <= 48).slice(0, max);
}
