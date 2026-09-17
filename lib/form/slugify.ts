/* URL handles. One implementation, so "Hale & Co" is never "hale-co" in one screen and
   "hale-and-co" in another.

   The docs site has its own slugify for heading anchors (components/docs/ds-section.tsx);
   that one deliberately drops "&" instead of spelling it, because an anchor is not a URL
   a shopper reads. The two stay separate. */

/** Lower-case, "&" spelled out, everything else collapsed to single hyphens. */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** A slug as typed by hand: lower-case words joined by single hyphens. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isSlug(value: string) {
  return SLUG_PATTERN.test(value.trim());
}

/**
 * What to show while someone is still typing a slug: keeps a trailing hyphen so
 * "premium-" doesn't fight the cursor, but never lets doubles or leading hyphens through.
 */
export function formatSlugInput(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/, "");
}
