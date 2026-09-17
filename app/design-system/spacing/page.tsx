import type { Metadata } from "next";
import { DsTokenTable } from "@/components/docs/ds-foundations";
import { DsPageHeader, DsSection, DsSubsection } from "@/components/docs/ds-section";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Layout & spacing" };

const spacing = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];

const controlSizes = [
  { cls: "h-control-xs", name: "control-xs", px: 28, use: "Dense chips, inline icon buttons" },
  { cls: "h-control-sm", name: "control-sm", px: 32, use: "Toolbars, filters, small buttons" },
  { cls: "h-control-md", name: "control-md", px: 40, use: "Default buttons and fields" },
  { cls: "h-control-lg", name: "control-lg", px: 48, use: "Primary CTAs, checkout" },
  { cls: "h-control-xl", name: "control-xl", px: 56, use: "Hero CTAs" },
];

const rowSizes = [
  { cls: "h-row-sm", name: "row-sm", px: 36, use: "Menu and select options" },
  { cls: "h-row-md", name: "row-md", px: 44, use: "Sheet rows, account nav, table headers" },
  { cls: "h-row-lg", name: "row-lg", px: 48, use: "Suggestions with thumbnails" },
];

const zIndex = [
  ["--z-sticky", "20", "Sticky header"],
  ["--z-dropdown", "40", "Mega menu"],
  ["--z-overlay", "50", "Backdrops"],
  ["--z-modal", "60", "Dialog, sheet"],
  ["--z-popover", "70", "Select, popover, menus (above modals)"],
  ["--z-toast", "80", "Toasts, consent, offline notice"],
  ["--z-tooltip", "90", "Tooltips"],
];

function SizeBars({ items }: { items: { cls: string; name: string; px: number; use: string }[] }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-surface p-6 shadow-flat">
      {items.map((c) => (
        <div key={c.name} className="flex items-center gap-4">
          <div className="w-44 shrink-0">
            <p className="font-mono text-caption">{c.name}</p>
            <p className="text-caption text-fg-muted">
              {c.px}px · {c.use}
            </p>
          </div>
          <div className={cn("flex w-full max-w-sm items-center rounded-pill bg-accent-soft px-4 text-caption-strong text-accent-soft-fg figures", c.cls)}>{c.px}</div>
        </div>
      ))}
    </div>
  );
}

export default function SpacingPage() {
  return (
    <>
      <DsPageHeader
        title="Layout"
        muted="& spacing"
        description="A 4px base unit, two container widths, one card padding that grows from 20 to 24px, and shared height scales so controls and rows line up wherever they sit side by side."
      />

      <DsSection title="Layout tokens">
        <DsTokenTable
          caption="Layout tokens"
          rows={[
            { token: "container-max", utility: "container-ds", usage: "Storefront content width" },
            { token: "container-wide", utility: "max-w-(--container-wide)", usage: "Docs: sidebar + content + table of contents" },
            { token: "gutter", utility: "px-(--gutter)", usage: "Page side padding" },
            { token: "card-pad", utility: "<Card padding=\"md\">", usage: "Card padding: 20px, 24px from sm" },
            { token: "section-gap", utility: "gap-(--section-gap)", usage: "Space between home page sections" },
            { token: "nav-h", utility: "h-(--nav-h)", usage: "Header bar height" },
            { token: "hit-min", utility: "hit-area", usage: "Minimum touch target on coarse pointers" },
          ]}
        />
      </DsSection>

      <DsSection title="Spacing scale" description="Tailwind's 4px scale. Inside cards use 12–16px between related items and 20–24px between groups; between cards on a page use 16–20px.">
        <div className="flex flex-col gap-2 rounded-2xl bg-surface p-6 shadow-flat">
          {spacing.map((s) => (
            <div key={s} className="flex items-center gap-4">
              <p className="w-16 font-mono text-caption text-fg-muted">{s * 4}px</p>
              <div className="h-3 rounded-pill bg-accent" style={{ width: `calc(var(--spacing) * ${s})` }} />
            </div>
          ))}
        </div>
      </DsSection>

      <DsSection title="Heights">
        <DsSubsection title="Controls" description="Buttons, fields, selects, segmented controls and tabs share one scale.">
          <SizeBars items={controlSizes} />
        </DsSubsection>
        <DsSubsection title="Rows" description="Menus, lists and sheet rows. Rows at 44px meet the touch target without a hit-area.">
          <SizeBars items={rowSizes} />
        </DsSubsection>
      </DsSection>

      <DsSection title="Layering" description="Popover layers sit above modals so selects and menus work inside dialogs.">
        <div className="overflow-hidden rounded-2xl bg-surface shadow-flat">
          <table className="w-full text-left text-body">
            <thead className="bg-surface-sunken text-overline text-fg-muted">
              <tr>
                <th scope="col" className="px-5 py-2.5">Token</th>
                <th scope="col" className="px-5 py-2.5">Value</th>
                <th scope="col" className="px-5 py-2.5">Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {zIndex.map(([t, v, u]) => (
                <tr key={t}>
                  <td className="px-5 py-3 font-mono text-caption">{t}</td>
                  <td className="px-5 py-3 figures">{v}</td>
                  <td className="px-5 py-3 text-fg-muted">{u}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DsSection>
    </>
  );
}
