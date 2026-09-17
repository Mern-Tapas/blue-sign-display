// Compiles design-system/styles.css with the app's own Tailwind v4 PostCSS plugin into
// design-system/dist/styles.css. Run from the repo root: node design-system/scripts/build-css.mjs
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";

const ROOT = process.cwd();
const from = join(ROOT, "design-system", "styles.css");
const to = join(ROOT, "design-system", "dist", "styles.css");

const result = await postcss([tailwind({ base: ROOT, optimize: false })]).process(readFileSync(from, "utf8"), { from, to });
mkdirSync(dirname(to), { recursive: true });
writeFileSync(to, result.css);
console.log(`wrote design-system/dist/styles.css (${(result.css.length / 1024).toFixed(0)} KB)`);
