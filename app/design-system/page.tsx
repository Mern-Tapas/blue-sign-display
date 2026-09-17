import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { dsNavGroups } from "@/components/docs/ds-nav-items";
import { DsCode, } from "@/components/docs/ds-code";
import { DsPageHeader, DsSection } from "@/components/docs/ds-section";
import { CountBadge } from "@/components/ui/count-badge";
import { IconTile } from "@/components/ui/icon-tile";

const principles = [
  {
    title: "Soft surfaces, crisp edges",
    body: "A cool grey canvas with white surfaces and generous radii. Every surface is defined by a hairline edge first and an ink-tinted shadow second, so hierarchy survives in dark mode. Only content floats; chrome sits flat.",
  },
  {
    title: "One loud color",
    body: "Blue marks the single most important action on screen, and selection is one language everywhere: a soft blue fill with a 2px ring. Everything else stays neutral, so the accent reads as intent.",
  },
  {
    title: "Controls on one scale",
    body: "Buttons, fields, selects and tabs share 32 / 40 / 48 px heights; menus and lists share 36 / 44 / 48 px rows. One focus ring in three placements, so anything placed side by side lines up and behaves alike.",
  },
  {
    title: "Figures first",
    body: "Prices and stats are large and tabular; currency and MRP step back. Headings, titles and labels share one weight, so hierarchy comes from size. Motion confirms actions and turns into fades under reduced motion.",
  },
];

const usage = `import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

<Field label="Email" hint="We’ll send your receipt here." required>
  <Input type="email" placeholder="you@example.com" />
</Field>
<Button size="lg" loading={isSubmitting}>Place order</Button>`;

export default function DesignSystemOverview() {
  return (
    <>
      <DsPageHeader
        title="A calm system for"
        muted="modern commerce"
        description="Tokens, components and documented journeys for an Indian storefront — from sign-in to returns. Built on Next.js 16, Tailwind CSS v4 and Radix primitives, verified for WCAG 2.2 AA in light and dark."
      />

      <DsSection title="Principles">
        <dl className="grid gap-x-12 gap-y-8 md:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="border-t border-border-subtle pt-5">
              <dt className="text-heading-sm">{p.title}</dt>
              <dd className="mt-2 max-w-[56ch] text-body text-fg-muted">{p.body}</dd>
            </div>
          ))}
        </dl>
      </DsSection>

      <DsSection title="Using the system" description="Compose semantic components; style only with semantic tokens (bg-surface, text-fg-muted, h-control-md). Theme switching is a data-theme attribute — never dark: classes.">
        <div className="overflow-hidden rounded-2xl shadow-flat">
          <DsCode code={usage} />
        </div>
      </DsSection>

      <DsSection title="Inventory" description="Every page documents variants, states and usage. Component counts are the exported building blocks on that page.">
        <div className="overflow-hidden rounded-2xl bg-surface shadow-flat">
          {dsNavGroups.map((group) => (
            <div key={group.label}>
              <p className="border-b border-border-subtle bg-surface-sunken px-5 py-2.5 text-overline text-fg-muted">{group.label}</p>
              <ul className="divide-y divide-border-subtle">
                {group.items.map(({ href, label, description, icon: Icon, count }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group state-layer relative flex items-center gap-4 px-5 py-4 transition-colors duration-(--dur-fast)"
                    >
                      <IconTile tone="muted" className="transition-colors duration-(--dur-fast) group-hover:text-accent-fg">
                        <Icon />
                      </IconTile>
                      <span className="min-w-0 flex-1">
                        <span className="block text-title">{label}</span>
                        <span className="block truncate text-body text-fg-muted">
                          {description}
                          {count > 0 && <span className="sr-only"> · {count} components</span>}
                        </span>
                      </span>
                      {count > 0 && <CountBadge count={count} className="max-sm:hidden" aria-hidden />}
                      <ArrowUpRight
                        aria-hidden
                        className="size-icon-md shrink-0 text-fg-subtle transition-[color,transform] duration-(--dur-fast) group-hover:text-fg motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DsSection>
    </>
  );
}
