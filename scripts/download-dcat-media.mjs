// Downloads every catalogue image, video and PDF brochure (imported from dcat.shop) into
// public/catalogue/, so the store no longer depends on the old Shopify CDN.
//   public/catalogue/images/<product-slug>/<n>.webp   product photos (max 1600px, WebP)
//   public/catalogue/categories/<category-slug>.webp  category tiles
//   public/catalogue/videos/<file>.mp4                product videos, unchanged
//   public/catalogue/brochures/<file>.pdf             PDF brochures, unchanged
// It writes lib/data/catalogue/media.json (remote URL -> local path), which lib/data/catalogue
// uses to serve the local copy. Safe to re-run: files already on disk are skipped.
// Run from the repo root after scripts/import-dcat.mjs:  node scripts/download-dcat-media.mjs
import { createWriteStream, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC = join(ROOT, "public");
const DATA = join(ROOT, "lib", "data", "catalogue");
const catalogue = JSON.parse(readFileSync(join(DATA, "catalogue.json"), "utf8"));
const MANIFEST = join(DATA, "media.json");
const media = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};

/** Some brochure links on the old site are missing their scheme ("://cdn.shopify.com/..."). */
export const normalizeUrl = (u) => u.replace(/^(?:https?:)?:?\/\//, "https://");

const safeName = (s) =>
  s
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "file";

async function fetchOk(url, attempt = 1) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  } catch (err) {
    if (attempt >= 3) throw new Error(`${url}: ${err.message}`);
    await new Promise((r) => setTimeout(r, 1000 * attempt));
    return fetchOk(url, attempt + 1);
  }
}

async function saveImage(remote, relPath, width) {
  const abs = join(PUBLIC, relPath);
  if (!existsSync(abs)) {
    const src = new URL(normalizeUrl(remote));
    src.searchParams.set("width", String(width));
    const buf = Buffer.from(await (await fetchOk(src.toString())).arrayBuffer());
    mkdirSync(dirname(abs), { recursive: true });
    await sharp(buf).rotate().resize({ width, height: width, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toFile(abs);
  }
  media[remote] = `/${relPath.split("\\").join("/")}`;
}

async function saveFile(remote, relPath) {
  const abs = join(PUBLIC, relPath);
  if (!existsSync(abs)) {
    const res = await fetchOk(normalizeUrl(remote));
    mkdirSync(dirname(abs), { recursive: true });
    const tmp = `${abs}.part`;
    try {
      await pipeline(Readable.fromWeb(res.body), createWriteStream(tmp));
      renameSync(tmp, abs);
    } catch (err) {
      rmSync(tmp, { force: true });
      throw err;
    }
  }
  media[remote] = `/${relPath.split("\\").join("/")}`;
}

/** Unique file name per remote URL, derived from the URL's own file name. */
function fileNameFor(remote, ext, used) {
  const base = safeName(basename(new URL(normalizeUrl(remote)).pathname));
  let name = `${base}.${ext}`;
  for (let i = 2; used.has(name) && used.get(name) !== remote; i++) name = `${base}-${i}.${ext}`;
  used.set(name, remote);
  return name;
}

const jobs = [];
for (const c of catalogue.categories) {
  if (c.image) jobs.push(() => saveImage(c.image, join("catalogue", "categories", `${c.slug}.webp`), 800));
}
for (const p of catalogue.products) {
  p.images.forEach((u, i) => jobs.push(() => saveImage(u, join("catalogue", "images", p.slug, `${i + 1}.webp`), 1600)));
}
const videoNames = new Map();
const pdfNames = new Map();
for (const u of new Set(catalogue.products.flatMap((p) => p.videos))) {
  const name = fileNameFor(u, "mp4", videoNames);
  jobs.push(() => saveFile(u, join("catalogue", "videos", name)));
}
for (const u of new Set(catalogue.products.map((p) => p.brochure).filter(Boolean))) {
  const name = fileNameFor(u, "pdf", pdfNames);
  jobs.push(() => saveFile(u, join("catalogue", "brochures", name)));
}

let done = 0;
const failed = [];
async function worker() {
  for (let job = jobs.shift(); job; job = jobs.shift()) {
    try {
      await job();
    } catch (err) {
      failed.push(err.message);
    }
    if (++done % 50 === 0) console.log(`  ${done} files…`);
  }
}
const total = jobs.length;
console.log(`downloading ${total} files into public/catalogue/ …`);
await Promise.all(Array.from({ length: 6 }, worker));

writeFileSync(MANIFEST, JSON.stringify(Object.fromEntries(Object.entries(media).sort()), null, 2) + "\n");
console.log(`done: ${total - failed.length}/${total} files, manifest has ${Object.keys(media).length} entries`);
if (failed.length) {
  console.error(`${failed.length} failed:\n  ${failed.join("\n  ")}`);
  process.exitCode = 1;
}
