# BlueSigns: how to build with this library

BlueSigns is a calm commerce UI (Indian storefront + seller admin): a soft grey canvas, white cards with hairline edges, and ONE blue signal (`#0079bc`) marking the primary action per view. The logo's yellow (`secondary` tokens) is for rare brand moments only, never for text on white.

## Setup
Wrap everything in `Providers`: it mounts the tooltip provider, the toast host and the cart drawer, so `Tooltip`, `toast()` and add-to-cart feedback don't work without it. Light theme is the default. For dark mode, set `data-theme="dark"` on `<html>` or on any wrapper element. Call `setThemePreference("dark")` to do it app-wide.

```jsx
const { Providers, Card, CardHeader, CardContent, Button, icons, sampleData, toast, formatPrice } = window.BlueSignsUI;
const { ShoppingBag } = icons;                     // full lucide icon set
const product = sampleData.products[0];            // realistic demo data

<Providers>
  <main className="min-h-dvh bg-canvas p-6 text-fg">
    <Card className="max-w-md">
      <CardHeader title={product.name} description="Free delivery by tomorrow" />
      <CardContent className="flex-row items-center justify-between gap-4">
        <span className="text-figure-lg figures">{formatPrice(product.price)}</span>
        <Button leadingIcon={<ShoppingBag aria-hidden />}
          onClick={() => toast({ title: "Added to bag", tone: "success" })}>Add to bag</Button>
      </CardContent>
    </Card>
  </main>
</Providers>
```

## Styling idiom: Tailwind utilities on semantic tokens
There are no raw palette classes: `bg-white`, `text-gray-500` and `blue-600` do not exist. Use:
- **Surfaces:** `bg-canvas` (page), `bg-surface` (cards), `bg-surface-sunken` (insets), `bg-surface-contrast`, `bg-surface-inverse`
- **Text:** `text-fg`, `text-fg-muted` (secondary text), `text-fg-subtle` (decorative only), `text-accent-fg` (blue links), `text-fg-on-accent`
- **Accent:** `bg-accent`, `bg-accent-soft` + `text-accent-soft-fg`
- **Status:** `bg-success-soft` + `text-success-fg`, and the same pattern for `warning`, `danger` and `info`
- **Brand yellow:** `bg-secondary` + `text-fg-on-secondary`
- **Lines:** `border-border`, `border-border-subtle`
- **Type scale:** `text-display-lg`, `text-heading-lg`, `text-heading-md`, `text-heading-sm`, `text-title`, `text-body-lg`, `text-body`, `text-body-strong`, `text-label`, `text-caption`, `text-overline`, `text-figure-xl`, `text-figure-lg`, `text-code`. Add `figures` for tabular prices.
- **Radius:** `rounded-xs`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-pill`
- **Elevation:** `shadow-flat`, `shadow-xs`, `shadow-card`, `shadow-popover`, `shadow-modal`
- **Layout glue:** standard `flex`/`grid`/`gap-*`/`p-*`/`m-*`/`w-*`/`max-w-*` and `sm:`/`md:`/`lg:` variants. Only the compiled classes exist, so use inline `style` for one-off pixel sizes. In your own CSS, use the tokens as variables: `var(--accent)`, `var(--surface)`, `var(--fg-muted)`, `var(--radius-lg)`, `var(--elev-card)`.

## Rules the design follows
- Exactly one `Button` (`variant="primary"`, the default) per view. Everything else uses `secondary`, `neutral`, `soft`, `ghost` or `link`.
- Selection (cards, rows, chips) is a soft blue fill with a 2px ring. `RadioCard`, `Chip` and `SavedAddressCard` already do this.
- Prices go through `formatPrice` / `PriceDisplay`. Ratings use `RatingPill` / `RatingStars`.
- Put nested panels inside a `Card` with `Inset` (grey inset) rather than stacking cards inside cards.
- Next.js links render as plain anchors that don't navigate. Handle clicks yourself for prototype flows.

## Where the truth lives
- `styles.css`: the full compiled stylesheet (tokens plus every utility), via `_ds_bundle.css`
- `guidelines/DESIGN.md`: the complete design spec (colour roles, type, elevation, component rules)
- `components/<group>/<Name>/<Name>.prompt.md`: props and verified examples for each component. Read these before composing screens.
