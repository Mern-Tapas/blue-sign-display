import Link from "next/link";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

export type SearchResultsHeaderProps = {
  /** What the shopper typed. */
  query: string;
  count: number;
  /**
   * Spelling correction. With `autoCorrected`, results are already for the correction and the
   * original is offered as "Search instead for"; otherwise it is a "Did you mean" link.
   */
  correction?: string | null;
  autoCorrected?: boolean;
  hrefFor?: (query: string) => string;
  /** Related queries shown as links. */
  related?: string[];
  className?: string;
};

const defaultHref = (q: string) => `/shop?q=${encodeURIComponent(q)}`;

/** Search page heading: query, result count, spelling correction and related searches. Server-safe. */
export function SearchResultsHeader({ query, count, correction, autoCorrected = false, hrefFor = defaultHref, related = [], className }: SearchResultsHeaderProps) {
  const shown = autoCorrected && correction ? correction : query;
  return (
    <header data-slot="search-results-header" className={cn("flex flex-col gap-2", className)}>
      <h1 className="text-heading-lg sm:text-display-lg">
        <span className="text-fg-muted">Results for </span>“{shown}”
      </h1>
      <p className="text-body-lg text-fg-muted figures" aria-live="polite">
        {formatNumber(count)} {count === 1 ? "product" : "products"}
      </p>
      {correction && (
        <p className="text-body text-fg-muted">
          {autoCorrected ? (
            <>
              Showing results for <span className="font-medium text-fg">{correction}</span>. Search instead for{" "}
              <TextLink href={hrefFor(query)}>{query}</TextLink>
            </>
          ) : (
            <>
              Did you mean{" "}
              <TextLink href={hrefFor(correction)}>{correction}</TextLink>
              ?
            </>
          )}
        </p>
      )}
      {related.length > 0 && (
        <nav aria-label="Related searches" className="mt-1">
          <ul className="flex flex-wrap items-center gap-2 text-label">
            <li className="text-fg-muted">Related:</li>
            {related.map((r) => (
              <li key={r}>
                <Link
                  href={hrefFor(r)}
                  className="press state-layer hit-area relative inline-flex h-control-xs items-center rounded-pill bg-surface-sunken px-2.5 text-caption-strong whitespace-nowrap text-fg transition-transform duration-(--dur-fast) ease-out"
                >
                  {r}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
