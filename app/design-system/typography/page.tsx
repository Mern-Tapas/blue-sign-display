import type { Metadata } from "next";
import { PriceDisplay } from "@/components/commerce/price-display";
import { DsDoDont } from "@/components/docs/ds-foundations";
import { DsPageHeader, DsPreview, DsSection, DsSubsection } from "@/components/docs/ds-section";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Typography" };

const scale = [
  { cls: "text-display-2xl", name: "display-2xl", spec: "56 / 60 · 400 · −3.5%", use: "Campaign hero" },
  { cls: "text-display-xl", name: "display-xl", spec: "44 / 48 · 400 · −3%", use: "Home hero, landing titles" },
  { cls: "text-display-lg", name: "display-lg", spec: "36 / 40 · 400 · −2.5%", use: "Page titles (h1)" },
  { cls: "text-heading-lg", name: "heading-lg", spec: "28 / 34 · 500 · −2%", use: "Store section headings" },
  { cls: "text-heading-md", name: "heading-md", spec: "22 / 28 · 500 · −1.5%", use: "Dialog & sheet titles, docs sections" },
  { cls: "text-heading-sm", name: "heading-sm", spec: "18 / 24 · 500 · −1%", use: "Page sections inside flows (checkout steps)" },
  { cls: "text-title", name: "title", spec: "16 / 22 · 500 · −1.1%", use: "Card & panel section titles" },
  { cls: "text-body-lg", name: "body-lg", spec: "16 / 24 · 400", use: "Lead paragraphs, product card names" },
  { cls: "text-body", name: "body", spec: "14 / 20 · 400", use: "Default running text" },
  { cls: "text-body-strong", name: "body-strong", spec: "14 / 20 · 500", use: "List-item titles, names, key values" },
  { cls: "text-label", name: "label", spec: "13 / 18 · 500", use: "Buttons, field labels, tabs" },
  { cls: "text-caption", name: "caption", spec: "12 / 16 · 400", use: "Meta, hints, timestamps" },
  { cls: "text-caption-strong", name: "caption-strong", spec: "12 / 16 · 500", use: "Badges, counts" },
  { cls: "text-overline", name: "overline", spec: "12 / 16 · 500 · +2%", use: "Table headers, nav group labels only" },
  { cls: "text-code", name: "code", spec: "13 / 18 · Geist Mono 500 · +2%", use: "Coupon codes, AWB numbers, tokens" },
];

const hierarchy = [
  ["Page", "h1", "display-lg with a muted second phrase"],
  ["Section on a page", "h2", "heading-lg (store) · heading-md (docs)"],
  ["Step or panel inside a flow", "h2 / h3", "heading-sm"],
  ["Card section", "h3", "title"],
  ["Dialog / sheet", "title", "heading-md (DialogHeader, SheetHeader)"],
  ["Item in a list", "—", "body-strong, meta in caption"],
];

export default function TypographyPage() {
  return (
    <>
      <DsPageHeader
        title="Typography"
        muted="in Geist"
        description="Geist Sans for everything, Geist Mono for codes. Display sizes are set in regular weight with tight tracking; headings, titles and labels share weight 500 so hierarchy comes from size, not boldness. Prices and counts use tabular figures."
      />

      <DsSection title="Type scale">
        <div className="divide-y divide-border-subtle rounded-2xl bg-surface shadow-flat">
          {scale.map((t) => (
            <div key={t.name} className="flex flex-col gap-2 px-6 py-4 md:flex-row md:items-baseline md:gap-6">
              <div className="w-48 shrink-0">
                <p className="font-mono text-caption text-fg">text-{t.name}</p>
                <p className="text-caption text-fg-muted">{t.spec}</p>
              </div>
              <p className={cn(t.cls, "min-w-0 flex-1 truncate")}>{t.name === "code" ? "BLUESIGNS20" : "Soft surfaces, sharp details"}</p>
              <p className="text-caption text-fg-muted md:w-56 md:text-right">{t.use}</p>
            </div>
          ))}
        </div>
      </DsSection>

      <DsSection title="Hierarchy" description="One role per level. If two siblings on the same page disagree, the page reads as assembled rather than designed.">
        <div className="overflow-hidden rounded-2xl bg-surface shadow-flat">
          <table className="w-full text-left text-body">
            <thead className="bg-surface-sunken text-overline text-fg-muted">
              <tr>
                <th scope="col" className="px-5 py-2.5">Level</th>
                <th scope="col" className="px-5 py-2.5">Element</th>
                <th scope="col" className="px-5 py-2.5">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {hierarchy.map(([level, el, role]) => (
                <tr key={level}>
                  <td className="px-5 py-3">{level}</td>
                  <td className="px-5 py-3 font-mono text-caption text-fg-muted">{el}</td>
                  <td className="px-5 py-3 text-fg-muted">{role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DsSection>

      <DsSection title="Figures & prices">
        <DsSubsection title="Tabular figures" description="The figures utility keeps digits the same width so totals and countdowns don't jitter. Currency and paise step back in colour.">
          <DsPreview label="PriceDisplay · figure roles" className="flex-col items-start gap-5">
            <PriceDisplay amount={12999} compareAt={16999} size="xl" showDiscount mrpLabel taxNote />
            <p className="text-figure-xl figures">
              <span className="text-fg-muted">₹</span>1,86,540
            </p>
          </DsPreview>
        </DsSubsection>
      </DsSection>

      <DsSection title="Guidance">
        <DsDoDont
          items={[
            {
              do: {
                example: (
                  <div>
                    <p className="text-display-lg">
                      Your <span className="text-fg-muted">orders</span>
                    </p>
                    <p className="text-body text-fg-muted">3 active · 12 delivered</p>
                  </div>
                ),
                text: "let the heading carry the page; a muted phrase adds tone without another line of chrome.",
              },
              dont: {
                example: (
                  <div>
                    <p className="text-overline text-accent-fg">ACCOUNT</p>
                    <p className="text-display-lg">Your orders</p>
                  </div>
                ),
                text: "put eyebrow labels or overlines above headings (D-004).",
              },
            },
            {
              do: {
                example: (
                  <div className="flex w-56 flex-col gap-0.5">
                    <p className="text-body-strong">Aura Wireless Headphones</p>
                    <p className="text-caption text-fg-muted">Qty 1 · Delivery by Thu</p>
                  </div>
                ),
                text: "use body-strong for item titles and caption for their meta.",
              },
              dont: {
                example: (
                  <div className="flex w-56 flex-col gap-0.5">
                    <p className="text-body font-bold">Aura Wireless Headphones</p>
                    <p className="text-caption font-semibold text-fg-muted">Qty 1 · Delivery by Thu</p>
                  </div>
                ),
                text: "reach for bold or semibold overrides — weight 500 is the only emphasis step.",
              },
            },
          ]}
        />
      </DsSection>
    </>
  );
}
