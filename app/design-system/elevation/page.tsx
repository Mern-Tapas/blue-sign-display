import type { Metadata } from "next";
import { DsDoDont } from "@/components/docs/ds-foundations";
import { DsPageHeader, DsSection } from "@/components/docs/ds-section";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Radius & elevation" };

const radii = [
  { cls: "rounded-xs", name: "xs", px: 6, use: "Checkbox, kbd, focus corners" },
  { cls: "rounded-sm", name: "sm", px: 10, use: "Swatches, thumbnails" },
  { cls: "rounded-md", name: "md", px: 14, use: "Menu items, tooltips, images in lists" },
  { cls: "rounded-lg", name: "lg", px: 20, use: "Insets inside cards, small alerts" },
  { cls: "rounded-xl", name: "xl", px: 24, use: "Popovers, alerts, selectable cards" },
  { cls: "rounded-2xl", name: "2xl", px: 28, use: "Cards, dialogs, sheets" },
  { cls: "rounded-pill", name: "pill", px: 9999, use: "Buttons, fields, chips, nav" },
];

const tiers = [
  { cls: "shadow-flat", name: "flat", use: "Toolbars, chrome, grouped lists, docs frames" },
  { cls: "shadow-xs", name: "xs", use: "Active segment, small raised controls" },
  { cls: "shadow-card", name: "card", use: "Resting content cards" },
  { cls: "shadow-card-hover", name: "card-hover", use: "Interactive card on hover (lift)" },
  { cls: "shadow-popover", name: "popover", use: "Menus, selects, popovers, toasts" },
  { cls: "shadow-modal", name: "modal", use: "Dialogs, sheets" },
];

export default function ElevationPage() {
  return (
    <>
      <DsPageHeader
        title="Radius"
        muted="& elevation"
        description="Generous rounding is the signature; nested corners step down so shapes stay concentric. Every surface is defined by a hairline edge first and a soft ink-tinted shadow second, which keeps layers crisp in dark mode."
      />

      <DsSection title="Radius scale">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-7">
          {radii.map((r) => (
            <div key={r.name} className="rounded-2xl bg-surface p-4 shadow-flat">
              <div className={cn("h-16 border-2 border-accent bg-accent-soft", r.cls)} />
              <p className="mt-3 font-mono text-caption">rounded-{r.name}</p>
              <p className="text-caption text-fg-muted">{r.px === 9999 ? "9999px" : `${r.px}px`}</p>
              <p className="text-caption text-fg-muted">{r.use}</p>
            </div>
          ))}
        </div>
      </DsSection>

      <DsSection title="Nesting" description="Cards (2xl) hold insets (lg) that hold items (md). Pills nest pills.">
        <DsDoDont
          items={[
            {
              do: {
                example: (
                  <div className="w-60 rounded-2xl bg-surface p-4 shadow-card">
                    <p className="mb-3 text-title">Price details</p>
                    <div className="rounded-lg bg-surface-sunken p-3 text-body shadow-flat">Total ₹12,999</div>
                  </div>
                ),
                text: "step the radius down inside a card so corners stay concentric.",
              },
              dont: {
                example: (
                  <div className="w-60 rounded-2xl bg-surface p-4 shadow-card">
                    <p className="mb-3 text-title">Price details</p>
                    <div className="rounded-2xl border border-border bg-surface p-3 text-body">Total ₹12,999</div>
                  </div>
                ),
                text: "repeat the outer radius or outline a panel with a bare border inside a card.",
              },
            },
          ]}
        />
      </DsSection>

      <DsSection title="Elevation tiers" description="Hairline first, shadow second. flat, xs and card use edge; card-hover, popover and modal use edge-strong. Dark mode adds a 1px top highlight on every tier.">
        <div className="grid grid-cols-2 gap-6 rounded-2xl bg-canvas p-6 shadow-flat md:grid-cols-3 xl:grid-cols-6">
          {tiers.map((s) => (
            <div key={s.name} className={cn("flex h-32 flex-col justify-end rounded-2xl bg-surface p-4", s.cls)}>
              <p className="font-mono text-caption">shadow-{s.name}</p>
              <p className="text-caption text-fg-muted">{s.use}</p>
            </div>
          ))}
        </div>
      </DsSection>

      <DsSection title="Which tier" description="Only content floats. Chrome sits flat so the eye lands on cards, not toolbars.">
        <DsDoDont
          items={[
            {
              do: {
                example: (
                  <div className="flex w-64 flex-col gap-3">
                    <div className="flex h-10 items-center rounded-pill bg-surface px-4 text-label text-fg-muted shadow-flat">16 products · Sort: Popular</div>
                    <div className="rounded-2xl bg-surface p-4 text-body shadow-card">Product card</div>
                  </div>
                ),
                text: "toolbars and filter bars flat; content cards on card.",
              },
              dont: {
                example: (
                  <div className="flex w-64 flex-col gap-3">
                    <div className="flex h-10 items-center rounded-pill bg-surface px-4 text-label text-fg-muted shadow-popover">16 products · Sort: Popular</div>
                    <div className="rounded-2xl border border-border bg-surface p-4 text-body">Product card</div>
                  </div>
                ),
                text: "float chrome at popover depth or edge cards with bare borders.",
              },
            },
          ]}
        />
      </DsSection>
    </>
  );
}
