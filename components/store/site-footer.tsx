import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/layout/brand-mark";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DISPLAYNODE_NAME, DISPLAYNODE_URL, placements, series, SITE_URL, WARRANTY } from "@/lib/data/can-products";

type FooterLink = { label: string; href: string; external?: boolean };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Displays",
    links: placements.map((p) => ({ label: p.label, href: `/products?placement=${p.value}` })),
  },
  {
    title: "Popular series",
    links: series.filter((s) => !s.specsOnRequest).slice(0, 5).map((s) => ({ label: s.name, href: `/products/${s.slug}` })),
  },
  {
    title: "Company",
    links: [
      { label: "Full product catalogue", href: "/catalogue" },
      { label: DISPLAYNODE_NAME, href: DISPLAYNODE_URL, external: true },
      { label: "Why digital signage", href: "/#why-digital" },
      { label: "Request a quote", href: "/contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="px-(--gutter) pb-4">
      <div className="mx-auto max-w-(--container-max) rounded-2xl bg-surface-contrast p-6 text-fg-on-contrast sm:p-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-4">
            <BrandMark inverted />
            <p className="max-w-xs text-body text-fg-on-contrast-muted">
              CAN digital signage for every space: floor, wall, desk and on the move. Manage every screen with{" "}
              {DISPLAYNODE_NAME}. Every display is backed by a {WARRANTY}.
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="mb-4 text-label text-fg-on-contrast">{col.title}</p>
              <ul className="flex flex-col">
                {col.links.map((l) => {
                  // A bare inline link here measured 18px tall, under the 24px WCAG 2.5.8 floor and
                  // well under the system's 44px hit-min. The row token carries the target instead.
                  const cls =
                    "inline-flex min-h-row-sm items-center gap-1.5 text-body text-fg-on-contrast-muted transition-colors duration-(--dur-fast) hover:text-fg-on-contrast";
                  return (
                    <li key={l.label} className="flex">
                      {l.external ? (
                        <a href={l.href} target="_blank" rel="noopener noreferrer" className={cls}>
                          {l.label}
                          <ArrowUpRight aria-hidden className="size-icon-sm" />
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : (
                        <Link href={l.href} className={cls}>
                          {l.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-edge-on-color pt-6 text-caption text-fg-on-contrast-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 BlueSigns. CAN displays by CAN Signage Display Pvt Ltd ·{" "}
            {/* Inline in a sentence, so the target grows via hit-area (coarse pointers only,
                no layout shift) rather than by becoming a block. */}
            <a
              href={`https://${SITE_URL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hit-area relative rounded-xs underline-offset-2 transition-colors duration-(--dur-fast) hover:text-fg-on-contrast hover:underline"
            >
              {SITE_URL}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
          <ThemeToggle variant="segmented" tone="contrast" className="bg-tile-on-color" />
        </div>
      </div>
    </footer>
  );
}
