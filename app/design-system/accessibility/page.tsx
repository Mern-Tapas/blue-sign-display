import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { DsPageHeader, DsSection, DsStates, DsSubsection } from "@/components/docs/ds-section";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = { title: "Interaction & accessibility" };

const contrast = [
  ["Text on canvas / surface / sunken", "fg-muted", "≥ 4.53 light · ≥ 6.4 dark", "4.5"],
  ["Primary button, hover and pressed", "fg-on-accent on accent*", "≥ 5.6 hover (dark)", "4.5"],
  ["Sale badge / danger button", "fg-on-danger on danger", "5.27", "4.5"],
  ["Soft status pairs", "*-fg on *-soft", "5.3 – 8.9", "4.5"],
  ["Focus ring", "focus-ring on surfaces", "≥ 3", "3"],
  ["Rating star", "rating on surface", "3.17 light", "3"],
  ["Disabled text", "disabled-fg on disabled", "≈ 3 (exempt, D-013)", "—"],
];

export default function AccessibilityPage() {
  return (
    <>
      <DsPageHeader
        title="Interaction"
        muted="& accessibility"
        description="WCAG 2.2 AA in both themes. One focus language, one hover and press language, one disabled language and one selected language are shared by every control, so behaviour is predictable across the store."
      />

      <DsSection title="Focus" description="Keyboard focus is always a solid 2px ring with ≥3:1 contrast. Pick the placement, never the style.">
        <DsStates
          states={[
            { label: "Default ring", node: <Button variant="secondary" data-force-state="focus">Apply</Button>, note: "global :focus-visible · 2px gap" },
            { label: "focus-ring-inset", node: <Input aria-label="PIN code" placeholder="560001" wrapperClassName="w-40 outline-2 -outline-offset-1 outline-focus-ring" />, note: "fields: ring on the border" },
            {
              label: "focus-ring-row",
              node: (
                <div className="w-44 rounded-xl bg-surface-raised p-1.5 shadow-popover">
                  <div data-force-state="focus" className="focus-ring-row flex h-row-sm items-center rounded-md px-3 text-body">Edit address</div>
                </div>
              ),
              note: "rows in clipped lists",
            },
            {
              label: "focus-ring-card",
              node: <div className="h-20 w-32 rounded-2xl bg-surface shadow-card outline-2 outline-offset-2 outline-focus-ring" />,
              note: "stretched-link cards",
            },
          ]}
        />
      </DsSection>

      <DsSection title="Hover, press & disabled">
        <DsStates
          states={[
            { label: "State layer · hover", node: <IconButton label="Save" data-force-state="hover"><Heart aria-hidden /></IconButton>, note: "currentColor 6% (8% dark)" },
            { label: "State layer · pressed", node: <IconButton label="Save" data-force-state="active"><Heart aria-hidden /></IconButton>, note: "12% + scale 0.97" },
            { label: "Primary · pressed", node: <Button data-force-state="active">Place order</Button>, note: "accent-pressed" },
            { label: "Disabled", node: <Button disabled>Place order</Button>, note: "neutral fill, never opacity" },
          ]}
        />
      </DsSection>

      <DsSection title="Selection" description="Cards, rows and filter chips share the selected utility: soft accent fill plus a 2px accent ring drawn inside the edge. Size pills and segmented controls use a solid inverse fill.">
        <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-canvas p-6 shadow-flat">
          <div className="selected flex h-16 w-52 flex-col justify-center rounded-xl px-4">
            <p className="text-body-strong">Home · Default</p>
            <p className="text-caption text-fg-muted">Whitefield, Bengaluru</p>
          </div>
          <Chip selected>Under ₹999</Chip>
          <span className="flex size-control-md items-center justify-center rounded-pill bg-surface-inverse text-label text-fg-inverse">M</span>
        </div>
      </DsSection>

      <DsSection title="Touch & targets">
        <DsSubsection title="hit-area" description="Controls smaller than 40px grow to 44×44 on coarse pointers through an invisible ::after, without changing layout (D-031).">
          <div className="flex items-center gap-6 rounded-2xl bg-surface p-6 shadow-flat">
            <span className="relative flex size-11 items-center justify-center rounded-pill border border-dashed border-accent">
              <span className="size-7 rounded-pill bg-surface-inverse" />
            </span>
            <p className="max-w-md text-body text-fg-muted">28px icon button, 44px target. Rows use h-row-md (44px) and need no expansion.</p>
          </div>
        </DsSubsection>
      </DsSection>

      <DsSection title="Contrast" description="Measured with plan/scripts/contrast.mjs against the tokens in both themes; a failing pair fails the phase gate.">
        <div className="overflow-hidden rounded-2xl bg-surface shadow-flat">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-body">
              <thead className="bg-surface-sunken text-overline text-fg-muted">
                <tr>
                  <th scope="col" className="px-5 py-2.5">Pair</th>
                  <th scope="col" className="px-5 py-2.5">Tokens</th>
                  <th scope="col" className="px-5 py-2.5">Ratio</th>
                  <th scope="col" className="px-5 py-2.5">Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {contrast.map(([pair, tokens, ratio, min]) => (
                  <tr key={pair}>
                    <td className="px-5 py-3">{pair}</td>
                    <td className="px-5 py-3 font-mono text-caption text-fg-muted">{tokens}</td>
                    <td className="px-5 py-3 figures">{ratio}</td>
                    <td className="px-5 py-3 figures text-fg-muted">{min}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DsSection>
    </>
  );
}
