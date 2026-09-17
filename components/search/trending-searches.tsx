"use client";

import { TrendingUp } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/cn";

export type TrendingSearchesProps = {
  items: string[];
  onSelect: (query: string) => void;
  title?: string;
  /** Ranked list (1–N) instead of chips, for wider panels. */
  layout?: "chips" | "ranked";
  className?: string;
};

/**
 * Popular queries as one-tap chips. "Trending" must come from real search data in
 * production; the demo list is illustrative.
 */
export function TrendingSearches({ items, onSelect, title = "Trending searches", layout = "chips", className }: TrendingSearchesProps) {
  if (items.length === 0) return null;
  return (
    <section data-slot="trending-searches" aria-label={title} className={cn("flex flex-col gap-2", className)}>
      <h3 className="text-label text-fg">{title}</h3>
      {layout === "chips" ? (
        <ul className="flex flex-wrap gap-2">
          {items.map((q) => (
            <li key={q}>
              <Chip variant="sunken" size="sm" icon={<TrendingUp aria-hidden className="text-accent-fg" />} onClick={() => onSelect(q)}>
                {q}
              </Chip>
            </li>
          ))}
        </ul>
      ) : (
        <ol className="-mx-3 grid sm:grid-cols-2">
          {items.map((q, i) => (
            <li key={q}>
              <button
                type="button"
                onClick={() => onSelect(q)}
                className="flex h-row-md w-full items-center gap-3 rounded-md px-3 text-left text-body text-fg transition-colors duration-(--dur-fast) hover:bg-highlight focus-ring-row"
              >
                <span aria-hidden className="w-4 text-right text-label text-fg-muted figures">
                  {i + 1}
                </span>
                <span className="truncate">{q}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
