/**
 * Hand-edited display names for the imported catalogue. EDIT THIS FILE, not catalogue.json:
 * `scripts/import-dcat.mjs` regenerates the JSON and would wipe anything typed into it.
 *
 * Key is the slug (the last part of the URL). Anything not listed keeps its imported name.
 * Search still matches the original name too, so old wording keeps finding the product.
 *
 * Series names (Lit, Vue, Easel, Desk Touch...) are NOT here: they are hand-written in
 * lib/data/displays.ts and can be edited straight in that file.
 */

/** Category slug -> the name shown on the home tiles, the toolbar and the catalogue heading. */
export const categoryNames: Record<string, string> = {
  // "minipc": "Mini PCs",
  // "used-workstation": "Refurbished Workstations",
};

/** Product slug -> the name shown on catalogue cards and the product page heading. */
export const productNames: Record<string, string> = {
  // "used-j1800-minipc": "Refurbished J1800 Mini PC",
};
