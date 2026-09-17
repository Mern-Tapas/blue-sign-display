"use client";

import { ArrowUpDown, SlidersHorizontal } from "lucide-react";
import { CountBadge } from "@/components/ui/count-badge";
import { cn } from "@/lib/cn";
import { countActiveFilters, sortOptions, type Facets, type FilterState } from "@/lib/filters";
import { MobileFilterSheet } from "./mobile-filter-sheet";
import { SortSheet } from "./sort-sheet";

export type MobileListingToolbarProps = {
  value: FilterState;
  onChange: (next: FilterState) => void;
  facets: Facets;
  categoryNames: Record<string, string>;
  priceBounds: { min: number; max: number };
  countResults: (draft: FilterState) => number;
  className?: string;
};

const half =
  "state-layer focus-ring-row relative flex h-row-lg flex-1 items-center justify-center gap-2 text-label text-fg [&_svg]:size-icon-md [&_svg]:text-fg-muted";

/**
 * Sticky Sort | Filter bar for phones (hidden from lg). Each half opens its sheet; the filter
 * half shows how many filters are applied and the sort half names the current order.
 */
export function MobileListingToolbar({ value, onChange, facets, categoryNames, priceBounds, countResults, className }: MobileListingToolbarProps) {
  const active = countActiveFilters(value);
  const sortLabel = sortOptions.find((o) => o.value === value.sort)?.label ?? "Featured";

  return (
    <div
      data-slot="mobile-listing-toolbar"
      className={cn("sticky top-22 z-(--z-sticky) flex divide-x divide-border-subtle overflow-hidden rounded-pill bg-surface/95 shadow-card backdrop-blur-md lg:hidden", className)}
    >
      <SortSheet
        value={value.sort}
        onValueChange={(sort) => onChange({ ...value, sort, page: 1 })}
        trigger={
          <button type="button" className={half} aria-label={`Sort, currently ${sortLabel}`}>
            <ArrowUpDown aria-hidden />
            <span className="flex min-w-0 flex-col items-start leading-tight">
              Sort
              <span className="max-w-28 truncate text-caption font-normal text-fg-muted">{sortLabel}</span>
            </span>
          </button>
        }
      />
      <MobileFilterSheet
        value={value}
        onApply={onChange}
        facets={facets}
        categoryNames={categoryNames}
        priceBounds={priceBounds}
        countResults={countResults}
        trigger={
          <button type="button" className={half} aria-label={active ? `Filter, ${active} applied` : "Filter"}>
            <SlidersHorizontal aria-hidden />
            Filter
            {active > 0 && (
              <CountBadge aria-hidden count={active} tone="accent" />
            )}
          </button>
        }
      />
    </div>
  );
}
