import Link from "next/link";
import { SearchX } from "lucide-react";
import { CategoryStrip, type CategoryStripItem } from "@/components/search/category-strip";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/cn";

export type ZeroResultsProps = {
  /** The search query, when the empty result came from search. */
  query?: string;
  /** Spelling correction to try. */
  correction?: string | null;
  /** Filters are narrowing results: offers the clear action instead of search tips. */
  hasFilters?: boolean;
  /** Clear-filters control (a Button with its own handler, or a link). */
  clearAction?: React.ReactNode;
  popularSearches?: string[];
  categories?: CategoryStripItem[];
  hrefFor?: (query: string) => string;
  className?: string;
};

const defaultHref = (q: string) => `/shop?q=${encodeURIComponent(q)}`;

/**
 * Empty listing that still helps: explains why, offers a correction or clearing filters,
 * then popular searches and categories so the shopper is never at a dead end. Server-safe.
 */
export function ZeroResults({ query, correction, hasFilters = false, clearAction, popularSearches = [], categories = [], hrefFor = defaultHref, className }: ZeroResultsProps) {
  const title = query ? `No results for “${query}”` : "No products match these filters";
  return (
    <Card asChild variant="outline" padding="none" className={cn("gap-8 px-6 py-10 sm:px-10", className)}>
    <section data-slot="zero-results" aria-label="No results">
      <div role="status" className="flex flex-col items-center gap-3 text-center">
        <IconTile size="xl" tone="muted">
          <SearchX />
        </IconTile>
        <h2 className="text-heading-sm">{title}</h2>
        {correction && (
          <p className="text-body text-fg-muted">
            Did you mean <TextLink href={hrefFor(correction)}>{correction}</TextLink>?
          </p>
        )}
        {hasFilters ? (
          <>
            <p className="max-w-md text-body text-fg-muted">Some filters are hiding products. Remove a few or widen the price range.</p>
            {clearAction && <div className="mt-1">{clearAction}</div>}
          </>
        ) : (
          <ul className="flex max-w-md flex-col gap-1 text-body text-fg-muted">
            <li>Check the spelling, or try fewer or more general words</li>
            <li>Search by product type (“headphones”) or brand</li>
          </ul>
        )}
      </div>

      {popularSearches.length > 0 && (
        <nav aria-label="Popular searches" className="flex flex-col items-center gap-3">
          <h3 className="text-label text-fg">Popular searches</h3>
          <ul className="flex flex-wrap justify-center gap-2">
            {popularSearches.map((q) => (
              <li key={q}>
                <Link
                  href={hrefFor(q)}
                  className="press state-layer hit-area relative inline-flex h-control-sm items-center rounded-pill bg-surface-sunken px-3 text-label whitespace-nowrap text-fg transition-transform duration-(--dur-fast) ease-out"
                >
                  {q}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {categories.length > 0 && (
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-label text-fg">Shop by category</h3>
          <CategoryStrip items={categories} layout="grid" size="sm" aria-label="Shop by category" />
        </div>
      )}
    </section>
    </Card>
  );
}
