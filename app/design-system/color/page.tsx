import type { Metadata } from "next";
import { DsDoDont, DsTokenTable, type TokenRow } from "@/components/docs/ds-foundations";
import { DsPageHeader, DsSection, DsSubsection } from "@/components/docs/ds-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Color" };

const surfaces: TokenRow[] = [
  { token: "canvas", utility: "bg-canvas", usage: "Page background behind every surface", swatch: true },
  { token: "surface", utility: "bg-surface", usage: "Cards, navigation, fields, menus", swatch: true },
  { token: "surface-sunken", utility: "bg-surface-sunken", usage: "Insets, tracks, table headers (a step lighter in dark)", swatch: true },
  { token: "surface-raised", utility: "bg-surface-raised", usage: "Popovers, menus, toasts", swatch: true },
  { token: "surface-hover", utility: "bg-surface-hover", usage: "Hover fill where a state layer can’t be used", swatch: true },
  { token: "surface-contrast", utility: "bg-surface-contrast", usage: "Dark feature panels, footer", swatch: true },
  { token: "surface-inverse", utility: "bg-surface-inverse", usage: "Neutral CTA, tooltips, current page chip", swatch: true },
  { token: "skeleton", utility: "shimmer", usage: "Loading placeholders", swatch: true },
];

const text: TokenRow[] = [
  { token: "fg", utility: "text-fg", usage: "Primary text and icons", swatch: true },
  { token: "fg-muted", utility: "text-fg-muted", usage: "Secondary text, captions, labels (≥4.5:1)", swatch: true },
  { token: "fg-placeholder", utility: "placeholder:text-fg-placeholder", usage: "Field placeholders (≥4.5:1)", swatch: true },
  { token: "fg-subtle", utility: "text-fg-subtle", usage: "Decorative icons and separators only — never text", swatch: true },
  { token: "fg-inverse", utility: "text-fg-inverse", usage: "Text on surface-inverse", swatch: true },
  { token: "fg-on-accent", utility: "text-fg-on-accent", usage: "Text on blue fills", swatch: true },
  { token: "fg-on-danger", utility: "text-fg-on-danger", usage: "Text on danger fills (sale badge, delete)", swatch: true },
  { token: "fg-on-success", utility: "text-fg-on-success", usage: "Text on success fills", swatch: true },
  { token: "fg-on-contrast", utility: "text-fg-on-contrast", usage: "Text on contrast panels", swatch: true },
  { token: "fg-on-contrast-muted", utility: "text-fg-on-contrast-muted", usage: "Secondary text on contrast panels", swatch: true },
];

const lines: TokenRow[] = [
  { token: "border-subtle", utility: "border-border-subtle", usage: "Dividers inside a surface", swatch: true },
  { token: "border", utility: "border-border", usage: "Control outlines (secondary button, input)", swatch: true },
  { token: "border-strong", utility: "border-border-strong", usage: "Hovered or informative outlines", swatch: true },
  { token: "edge", utility: "shadow-flat", usage: "Hairline inside every elevation tier", swatch: true },
  { token: "edge-strong", usage: "Hairline for popover, modal and card-hover", swatch: true },
];

const accent: TokenRow[] = [
  { token: "accent", utility: "bg-accent", usage: "The one primary action per view; checked controls", swatch: true },
  { token: "accent-hover", utility: "hover:bg-accent-hover", usage: "Primary hover (darker than accent in both themes)", swatch: true },
  { token: "accent-pressed", utility: "active:bg-accent-pressed", usage: "Primary pressed", swatch: true },
  { token: "accent-fg", utility: "text-accent-fg", usage: "Blue text and links on surfaces", swatch: true },
  { token: "accent-soft", utility: "bg-accent-soft", usage: "Soft buttons, current nav item, positive nudges", swatch: true },
  { token: "accent-soft-fg", utility: "text-accent-soft-fg", usage: "Text on accent-soft", swatch: true },
  { token: "selected-bg", utility: "selected", usage: "Selected card / row / chip fill (with a 2px ring)", swatch: true },
  { token: "selected-ring", utility: "selected", usage: "Selected ring", swatch: true },
  { token: "focus-ring", utility: ":focus-visible", usage: "Keyboard focus indicator (≥3:1)", swatch: true },
  { token: "secondary", utility: "bg-secondary", usage: "Secondary brand yellow (logo) — brand moments only, never text on light surfaces", swatch: true },
  { token: "secondary-soft", utility: "bg-secondary-soft", usage: "Soft yellow fill", swatch: true },
  { token: "secondary-fg", utility: "text-secondary-fg", usage: "Yellow-family text on surfaces (≥4.5:1)", swatch: true },
  { token: "fg-on-secondary", utility: "text-fg-on-secondary", usage: "Text on secondary fills", swatch: true },
];

const status: TokenRow[] = [
  { token: "success", utility: "bg-success", usage: "Solid success: trend up, status dot", swatch: true },
  { token: "success-soft", utility: "bg-success-soft", usage: "In stock, delivered, savings", swatch: true },
  { token: "success-fg", utility: "text-success-fg", usage: "Success text", swatch: true },
  { token: "warning", utility: "bg-warning", usage: "Solid warning", swatch: true },
  { token: "warning-soft", utility: "bg-warning-soft", usage: "Low stock, pending", swatch: true },
  { token: "warning-fg", utility: "text-warning-fg", usage: "Warning text", swatch: true },
  { token: "danger", utility: "bg-danger", usage: "Sale badge, destructive action", swatch: true },
  { token: "danger-soft", utility: "bg-danger-soft", usage: "Errors, failed payments", swatch: true },
  { token: "danger-fg", utility: "text-danger-fg", usage: "Error text", swatch: true },
  { token: "info-soft", utility: "bg-info-soft", usage: "Neutral information", swatch: true },
  { token: "rating", utility: "fill-rating", usage: "Star fill (≥3:1 on surface)", swatch: true },
];

const primitives: Record<string, string[]> = {
  neutral: ["0", "25", "50", "100", "150", "200", "300", "400", "500", "600", "700", "800", "850", "900", "950"],
  azure: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"],
  sun: ["50", "100", "200", "300", "400", "500", "600", "700", "800"],
  night: ["1000", "950", "900", "850", "800", "750"],
};

function ThemeColumn({ theme }: { theme: "light" | "dark" }) {
  return (
    <div data-theme={theme} className="flex flex-col gap-4 rounded-2xl bg-canvas p-5 text-fg">
      <p className="text-label text-fg-muted capitalize">{theme}</p>
      <div className="flex flex-col gap-3 rounded-2xl bg-surface p-5 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <p className="text-title">Order summary</p>
          <span className="rounded-pill bg-success-soft px-2.5 py-0.5 text-caption-strong text-success-fg">Paid</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg bg-surface-sunken p-4 shadow-flat">
          <p className="flex justify-between text-body"><span className="text-fg-muted">Total MRP</span><span className="figures">₹14,999</span></p>
          <p className="flex justify-between text-body"><span className="text-fg-muted">Discount</span><span className="text-success-fg figures">−₹2,000</span></p>
        </div>
        <div className="flex gap-2">
          <Button size="sm">Pay ₹12,999</Button>
          <Button size="sm" variant="secondary">Save for later</Button>
        </div>
      </div>
      <div className="rounded-2xl bg-surface-contrast p-4 text-fg-on-contrast">
        <p className="text-body">Contrast panel</p>
        <p className="text-caption text-fg-on-contrast-muted">Footer, feature tiles</p>
      </div>
    </div>
  );
}

export default function ColorPage() {
  return (
    <>
      <DsPageHeader
        title="Color"
        muted="& surfaces"
        description="A cool grey canvas, white surfaces with hairline edges, and one blue accent (the BlueSigns logo blue, with its yellow as a secondary brand colour). Components only use semantic tokens; switching data-theme re-resolves every value. Every text/fill pair is checked by plan/scripts/contrast.mjs in both themes."
      />

      <DsSection title="In both themes" description="The same markup, scoped to light and dark. Surfaces step in lightness so layers stay distinct without heavier shadows.">
        <div className="grid gap-5 lg:grid-cols-2">
          <ThemeColumn theme="light" />
          <ThemeColumn theme="dark" />
        </div>
      </DsSection>

      <DsSection title="Principles">
        <DsDoDont
          items={[
            {
              do: {
                example: (
                  <div className="flex gap-2">
                    <Button>Place order</Button>
                    <Button variant="secondary">Apply coupon</Button>
                  </div>
                ),
                text: "one blue action per view; everything else neutral, so the accent always reads as intent.",
              },
              dont: {
                example: (
                  <div className="flex gap-2">
                    <Button>Place order</Button>
                    <Button variant="soft">Apply coupon</Button>
                    <Button>Save</Button>
                  </div>
                ),
                text: "stack several blue buttons or tint secondary actions — nothing stands out any more.",
              },
            },
            {
              do: {
                example: <p className="rounded-lg bg-surface px-4 py-3 text-body text-fg-muted shadow-flat">Delivery by Thu, 18 Sept</p>,
                text: "use fg-muted for secondary text; it passes 4.5:1 on canvas, surface and sunken.",
              },
              dont: {
                example: <p className="rounded-lg bg-surface px-4 py-3 text-body text-fg-subtle shadow-flat">Delivery by Thu, 18 Sept</p>,
                text: "use fg-subtle or opacity for readable text — fg-subtle is for decorative separators only.",
              },
            },
          ]}
        />
      </DsSection>

      <DsSection title="Semantic tokens" description="Resolved values are read from styles/tokens.css at build time. Copy puts the utility on your clipboard.">
        <DsSubsection title="Surfaces">
          <DsTokenTable rows={surfaces} caption="Surface tokens" />
        </DsSubsection>
        <DsSubsection title="Text & icons">
          <DsTokenTable rows={text} caption="Foreground tokens" />
        </DsSubsection>
        <DsSubsection title="Lines & edges" description="One ink for every light hairline and shadow; four roles instead of five near-identical alphas.">
          <DsTokenTable rows={lines} caption="Line tokens" />
        </DsSubsection>
        <DsSubsection title="Accent, selection & focus">
          <DsTokenTable rows={accent} caption="Accent tokens" />
        </DsSubsection>
        <DsSubsection title="Status">
          <DsTokenTable rows={status} caption="Status tokens" />
        </DsSubsection>
      </DsSection>

      <DsSection title="Primitive palette" description="Raw values that semantic tokens point at. Never referenced directly by components. Night is the dark-theme surface ladder.">
        <div className="flex flex-col gap-5 rounded-2xl bg-surface p-6 shadow-flat">
          {Object.entries(primitives).map(([name, steps]) => (
            <div key={name}>
              <p className="mb-2 text-label capitalize">{name}</p>
              <div className={cn("grid grid-cols-5 gap-1.5 sm:grid-cols-8", steps.length > 8 && "lg:grid-cols-[repeat(15,minmax(0,1fr))]")}>
                {steps.map((s) => (
                  <div key={s}>
                    <div className="h-12 rounded-sm shadow-flat" style={{ background: `var(--${name}-${s})` }} />
                    <p className="mt-1 font-mono text-caption text-fg-muted">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DsSection>
    </>
  );
}
