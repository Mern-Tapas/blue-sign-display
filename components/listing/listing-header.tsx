import Link from "next/link";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

export type ListingHeaderProps = {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  muted?: string;
  /** Total items for the current filters. */
  count?: number;
  description?: string;
  /** Subcategory shortcuts under the title ("Over-ear · In-ear · Speakers"). */
  subcategories?: { href: string; label: string; active?: boolean }[];
  className?: string;
};

/** Category / collection page heading: breadcrumbs, h1 with item count, description and subcategory links. Server-safe. */
export function ListingHeader({ breadcrumbs, title, muted, count, description, subcategories, className }: ListingHeaderProps) {
  return (
    <header data-slot="listing-header" className={cn("flex flex-col gap-3", className)}>
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-display-lg sm:text-display-xl">
          {title}
          {muted && <span className="text-fg-muted"> {muted}</span>}
        </h1>
        {count !== undefined && (
          <p className="text-body-lg text-fg-muted figures">
            {formatNumber(count)} {count === 1 ? "item" : "items"}
          </p>
        )}
      </div>
      {description && <p className="max-w-2xl text-body-lg text-fg-muted">{description}</p>}
      {subcategories && subcategories.length > 0 && (
        <nav aria-label={`${title} subcategories`}>
          <ul className="scrollbar-none -mx-(--gutter) flex gap-2 overflow-x-auto px-(--gutter) py-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {subcategories.map((s) => (
              <li key={s.href} className="shrink-0">
                <Link
                  href={s.href}
                  aria-current={s.active ? "page" : undefined}
                  className={cn(
                    "press state-layer hit-area relative inline-flex h-control-sm items-center rounded-pill border px-3 text-label whitespace-nowrap transition-[border-color,background-color,color,transform] duration-(--dur-fast) ease-out",
                    s.active ? "selected border-transparent text-accent-soft-fg" : "border-border bg-surface text-fg hover:border-border-strong",
                  )}
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
