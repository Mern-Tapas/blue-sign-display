# UI task plan — BlueSigns storefront

Owner: `ui-specialist`. One agent owns the UI; do not run a second in parallel on these files.

Status: `☐` pending · `▣` in progress · `☑` complete · `⊘` blocked

Verification standard for `☑`: implemented, design-system compliant, checked in a real browser at
360 / 390 / 768 / 1024 / 1280 px with no horizontal overflow, light and dark theme, keyboard path
intact, console clean, `npx tsc --noEmit` and `npm run lint` clean, row updated here.

---

## Audit baseline (session 1, 2026-09-23)

Measured on `next dev` (Turbopack, Next 16.3.5) at localhost, with a same-origin iframe harness so
each route was laid out at a real 360 / 390 / 768 / 1024 / 1280 px viewport.

What is already good and should not be "fixed":

- **No page-level horizontal overflow** on `/`, `/products`, `/products/[slug]`, `/catalogue`,
  `/catalogue?category=`, `/catalogue?q=` (empty), `/catalogue/[slug]`, `/contact` at any of the five
  widths — *except* the `/contact?model=` case in UI-01 below.
- **Focus visibility is complete.** 57 of 57 focusable elements on `/` take a visible ring under
  `:focus-visible` (measured with keyboard modality active). No focus trap or invisible stop found.
- **Token contrast passes.** `node plan/scripts/contrast.mjs` reports 0 failing pairs in both themes.
- **Console is clean** apart from UI-07 (one Next.js `metadataBase` warning). No hydration warnings,
  no `next/image` warnings, no React errors.
- Empty state on `/catalogue?q=<no match>` exists, is announced (`aria-live="polite"` count line) and
  offers a recovery action.

---

## Tasks

| ID | Page / feature | Current state | Problem | Required change | Priority | Depends on | Status | Verification |
|----|----------------|---------------|---------|-----------------|----------|-----------|--------|--------------|
| UI-01 | `/contact?model=…` (Field, `components/ui/field.tsx`) | `Field` root is `flex flex-col gap-2` with no `min-w-0`. | **Real horizontal overflow.** Every catalogue product's "Get a quote" links to `/contact?model=<full product title>`. The `Select` trigger's value is `white-space: nowrap`, so the Field's min-content contribution is 435px; the form grid's auto track adopts it. Measured at 390px: `scrollWidth` 499 vs `clientWidth` 375. Reachable from 110 catalogue products. | Add `min-w-0` to the `Field` root so a grid/flex track's minimum contribution is 0 and the `Select` trigger's existing `truncate` can do its job. | **Critical** | — | ☑ | 360/390/768/1024/1280 with the longest catalogue title in `?model=`; `documentElement.scrollWidth <= clientWidth` |
| UI-02 | `/catalogue/[slug]` | `<p>Pricing on request · GST and delivery terms below</p>` renders unconditionally, but the Specifications/terms section only renders when `p.specs.length > 0 \|\| p.terms.length > 0`. | The copy promises terms that are not on the page. 16 of 110 catalogue products have no specs and no terms (all of `software-solutions`, e.g. `/catalogue/content-management-software`). The page tells the visitor to look for something that is not there. | Make the trailing clause conditional on `p.terms.length > 0`; fall back to "Pricing on request" alone. | **High** | — | ☑ | Compare `/catalogue/content-management-software` (no terms) with `/catalogue/15-6inch-touchscreen-monitor` (has terms) |
| UI-03 | `components/store/site-footer.tsx` | Footer nav links are bare `<a>`/`<Link>` with `text-body`; measured 45×18 – 98×18 px. | **WCAG 2.5.8 (AA) target-size failure** (24×24 minimum) and a breach of the project's own 44px `--hit-min` rule. Present on every page, 20+ links. | Give footer links an `inline-flex` box on the row scale plus the `hit-area` utility, without changing the footer's visual rhythm. | **High** | — | ☑ | Measure every footer link's rect at 360 and 390; ≥24px box, ≥44px coarse-pointer hit area |
| UI-04 | `components/ui/breadcrumbs.tsx` | The `ChevronRight` separator sits *after* its label inside the same `<li>`, and the `<ol>` is `flex-wrap`. | When the trail wraps (routine at 360/390 on `/catalogue/[slug]`), a line ends with a dangling chevron: `Home › Catalogue › Software Solutions ›` / `Content Management Software`. DESIGN.md explicitly forbids a wrapped row leaving a dangling separator. | Draw the separator *before* every item except the first, so it can never trail a line. | **High** | — | ☑ | `/catalogue/content-management-software` at 360 and 390; 4-level trail must wrap with no trailing chevron |
| UI-05 | `/products/[slug]` `<h1>` | `<h1 className="text-display-lg">{s.name}<span className="text-fg-muted"> · {s.headline}</span></h1>` | At 360/390 the middot orphans onto the start of line 2 ("CANDesk Wid" / "· Widescreen on the desk."). The heading also uses a flat `text-display-lg` (36px) where `/catalogue/[slug]` uses the responsive `text-heading-lg sm:text-display-lg` — two different h1 treatments on two detail pages. | Bind the separator to the preceding word so it can never start a line, and align the h1 on the responsive step used by the other detail page. | **High** | — | ☑ | `/products/candesk-wid`, `/products/canvue` at 360/390/768/1280 |
| UI-06 | `components/ui/segmented-control.tsx` (size `sm`) | `sm: "h-6 px-3"` → 24px tall, no `hit-area`. Used by `ThemeToggle variant="segmented"` in the footer and the mobile menu sheet. | Sits exactly on the WCAG 2.5.8 floor and breaks the project rule that "touch targets under 40px expand to 44px on coarse pointers without changing layout". Every other control in `components/ui` that is under 40px carries `hit-area`. | Add `hit-area relative` to the item variants (the utility is a coarse-pointer-only `::after`, so layout is unchanged). | Medium | — | ☐ | Footer theme toggle at 390 with a coarse-pointer emulation; item rect unchanged, `::after` ≥44px |
| UI-07 | `app/layout.tsx` metadata | `metadata` has no `metadataBase`. | Next 16 logs `⚠ metadataBase property in metadata export is not set…` and resolves OG images against `http://localhost:3001`. `/catalogue/[slug]` sets `openGraph.images`, so every shared catalogue link gets a localhost image URL in production. | Set `metadataBase` from the canonical site origin. | Medium | Business input on the production origin (see BLOCK-03) | ⊘ | Console must be free of the warning; `<meta property="og:image">` must be absolute |
| UI-08 | `/products` inset, `/catalogue/[slug]` summary card | Links rendered as literal glyphs: `Ask about these models →` and `All {n} specifications ↓`. (The footer's `↗` was the third case; it was replaced with a lucide `ArrowUpRight` as part of UI-03.) | Everywhere else the site uses lucide icons (`ArrowRight`, `ArrowUpRight`) with `aria-hidden` and a hover translate. Literal arrows are read aloud by screen readers, don't inherit the icon stroke/size scale, and don't animate with the rest. Both remaining links are also 18px-tall targets. | Replace with `ArrowRight` / `ArrowDown` lucide icons on the standard `size-icon-sm` scale, inside an `inline-flex` with `hit-area`. | Medium | — | ☐ | `/products` and `/catalogue/15-6inch-touchscreen-monitor` at 360 and 1280, plus a screen-reader read of the link text |
| UI-09 | Home category tiles (`app/(store)/page.tsx`) | Tile markup **already handled by the main session** — `object-cover` edge-to-edge (all 16 sources are 800×800 against an `aspect-square` tile, so nothing is cropped), and the title is `line-clamp-2` on a reserved two-line box so the "N products" line shares a baseline across the row. Do not modify or revert that `<Link>` block. | **The image set is two visual families.** 7 tiles are neutral studio renders on a soft grey backdrop with no text. 5 (`computer-desktop`, `laptops-1`, `used-minipc`, `refurbished`, `used-workstation`) are blue marketing banners with headline typography baked into the artwork ("REFURBISHED DESKTOP", "Reliable · Tested · Ready to Use"). The row reads as half product catalogue, half ad creative. This is an asset problem, not a layout one — the main session confirmed the banners cannot be cropped clean because their internal layouts differ. | New grey-backdrop studio renders for those 5 categories, matching the other 7. | Medium | BLOCK-02 (assets) | ⊘ | Side-by-side of all 12 tiles at 390 (2-up), 768 (3-up) and 1280 (6-up) |
| UI-10 | `components/store/home-hero.tsx` | Sub-headline uses `text-white/80`; the section uses raw literals `bg-[#240c13]` and `rgb(26 7 13 / …)` gradients. | DESIGN.md: "Don't fade text with opacity" (The Muted-Not-Faded Rule), and raw hex is a defect unless recorded as a documented exception. The colours are sampled from the hero photograph, so they are defensible — but they are undocumented. | Either promote the hero's photo-derived maroon to a token, or record it in DESIGN.md's "Documented exceptions" and swap `text-white/80` for a solid on-photo ink token. | Low | — | ☐ | Contrast of the sub-headline against the scrim at 360 and 1280; `plan/scripts/contrast.mjs` |
| UI-11 | `app/(store)/catalogue/[slug]/page.tsx` | When `p.images.length === 0` the gallery slot renders `<div className="aspect-square rounded-2xl bg-surface-sunken" />`. | A bare grey box with no label reads as a broken image. Currently unreachable (all 110 products have at least one image) but it is a latent placeholder screen. | Replace with the existing `EmptyState` (or a captioned placeholder) so the slot explains itself. | Low | — | ☐ | Temporarily stub a product with `images: []` and check at 390 and 1280 |
| UI-12 | `/catalogue/[slug]` videos | `<video controls preload="metadata">` with no `poster` and no `<track>`. | The player is a black rectangle until metadata arrives, and there are no captions. 51 of 110 products carry video. | Add a `poster` from the product's first image, and record the captions gap. | Low | Captions are a content gap (BLOCK-04) | ☐ | `/catalogue/15-6inch-touchscreen-monitor` at 390 and 1280, throttled network |
| UI-13 | `components/store/quote-form.tsx` | Client-side validation and a local confirmation card; no submission target. | The confirmation says "Our team will reach you at …" but nothing is sent. | Wire `onSubmit` to a real endpoint, then make the confirmation honest about what happened. | High | BLOCK-01 | ⊘ | Submit end-to-end and confirm receipt |

---

## Design-system gallery (`app/design-system/**`) — lower priority

`app/design-system/**` is a documented component showcase built on fixture data, not a shipping app.
Its account / auth / checkout / orders / admin / wishlist pages are demo surfaces. They are audited
here only for design-system consistency, and they rank below every storefront task above.

| ID | Surface | Problem | Priority | Status |
|----|---------|---------|----------|--------|
| DS-01 | `components/ui/segmented-control.tsx` | Same 24px target defect as UI-06; the gallery is where it is documented, so the fix must be reflected in the `motion`/`forms` gallery pages. | Medium | ☐ |
| DS-02 | `components/ui/field.tsx` | UI-01's `min-w-0` fix changes the intrinsic sizing of every `Field` in the gallery's form pages. Re-check `form-patterns`, `forms`, `checkout` and `payments` for regressions. | Medium | ☐ |
| DS-03 | `components/ui/breadcrumbs.tsx` | UI-04 changes the separator's DOM position; re-check the `navigation` gallery page. | Low | ☐ |

---

## Out of scope

The brief that created this agent was written against a different codebase. The following do **not**
exist in BlueSigns and must not be invented. Verified this session: no `prisma/`, no `app/api/`, no
server actions, no auth, and the only markdown in the repo is `AGENTS.md`, `CLAUDE.md`, `DESIGN.md`,
`README.md`, `ds-bundle/README.md` and `.design-sync/*.md`.

- **Prisma / database / migrations / seeds** — data is two static, server-only sources:
  `lib/data/can-products.ts` (hand-written from the CAN brochure) and `lib/data/catalogue/`
  (`catalogue.json` + `media.json`, generated by `scripts/import-dcat.mjs`).
- **Razorpay / payments / checkout / cart / orders / shipping / returns / coupons / reviews.**
- **Admin, inventory, CSV import, queues, Redis, background jobs.**
- **`app/api` routes, server actions, sessions, accounts.**
- **`docs/BRD.md`, `docs/PRD.md`, `docs/TRD.md`, `architecture.md`, `task.md`, `progress.md`,
  `decision.md`** — none of these exist. This file (`ui-task.md`) is the UI tracker of record.

The checkout / admin / orders / account screens that *do* exist under `app/design-system/**` are
component-gallery demos on fixture data. Polishing them is legitimate design-system work. Wiring them
up is not a product task.

Do not hand-edit `lib/data/catalogue/*.json` or `media.json`; do not touch `scripts/import-dcat.mjs`,
`scripts/download-dcat-media.mjs`, `next.config.ts` redirects/`remotePatterns`, `public/logo.jpg`, or
the `design-system/` and `.design-sync/` build plumbing.

---

## Blocked

| ID | Blocks | What is missing | Who decides |
|----|--------|-----------------|-------------|
| BLOCK-01 | UI-13 | **The quote form has no backend.** `components/store/quote-form.tsx` carries a `TODO`: validation and the confirmation card are local state only, nothing is sent. Needed: a destination (email relay, CRM, or a form service) and the handling/retention policy the "We use these details only to reply to your enquiry" line promises. Until then the confirmation card overstates what happened. | Business |
| BLOCK-02 | UI-09 | **5 category images are off-system and cannot be fixed in code.** `public/catalogue/categories/computer-desktop.webp`, `laptops-1.webp`, `used-minipc.webp`, `refurbished.webp`, `used-workstation.webp` are blue marketing banners with baked-in headline typography; the other 7 visible tiles are neutral grey-backdrop product renders. The main session tested cropping the text out and it fails — the banners have inconsistent internal layouts. Needed: 5 replacement 800×800 grey-backdrop studio renders in the same language as the new 7, or an explicit decision to accept the mixed look. | Brand / business |
| BLOCK-03 | UI-07 | **Canonical production origin is unknown.** `lib/data/can-products.ts` exposes `SITE_URL = cansignage.com`, which is the *manufacturer's* site (linked as an external destination in the header and footer), not necessarily where BlueSigns is deployed. `metadataBase` must point at the BlueSigns deployment. | Business |
| BLOCK-04 | UI-12 | **No captions or transcripts** exist for the 51 catalogue product videos. Needed: caption files, or an explicit decision that these are silent/demonstrative clips. | Content |
| BLOCK-05 | Product naming, site-wide | **Open question: should "CAN" be stripped from product naming?** The CAN prefix is currently load-bearing — it appears in `series[].name` (`CANVue`, `CANWalk`, `CANMount`…), in model names (`CANDesk Wid 1001`), in headings ("Which CAN is right for you?", "Why CAN?"), in nav copy, in `WARRANTY` ("1 year warranty on every CAN display"), and in `lib/data/catalogue/index.ts` where `brand: "CAN"` drives the catalogue card badge and the `/products/<slug>` cross-link. Removing it is a data-layer change, not a UI change, and would leave the series without a distinguishing name. Needed: a decision on whether BlueSigns sells *CAN* displays under the manufacturer's name or rebrands them. | Brand / business |

---

## Changelog

- **2026-09-23 · session 1** — First full storefront audit (all real routes, 5 widths, both themes,
  keyboard, console). Created this file. Implemented and browser-verified UI-01, UI-02, UI-03, UI-04
  and UI-05.

  Files touched: `components/ui/field.tsx`, `components/ui/select.tsx`, `components/ui/breadcrumbs.tsx`,
  `components/store/site-footer.tsx`, `app/(store)/catalogue/[slug]/page.tsx`,
  `app/(store)/products/[slug]/page.tsx`. Gotchas recorded in `.design-sync/NOTES.md`.

  Verification actually run: `npx tsc --noEmit` clean; `npm run lint` 0 errors (20 pre-existing
  warnings, all in `design-system/shims/**`, untouched); every route re-measured at 360/390/768/1024/
  1280 with `scrollWidth <= clientWidth`; breadcrumb wrap and series `<h1>` inspected visually at 360;
  footer link boxes measured at 36px; focus ring confirmed present on all 39 focusable elements on
  `/contact`; console free of everything but the known `metadataBase` warning (UI-07).

  Not verified this session, and not claimed: `prefers-reduced-motion: reduce` could not be emulated
  through the available browser tooling. The reduced-motion paths were read in source only
  (`styles/base.css:63`, `styles/utilities.css:205,225`, `useReducedMotion` + the
  `motion-reduce:filter-none!/transform-none!` SSR guard in `components/store/home-hero.tsx`), and
  none of this session's changes add motion. This still needs a real pass.

  Already handled by the main session, not re-reported: the home category tile `object-cover` switch
  and the two-line title clamp that fixes the ragged "N products" baseline.
