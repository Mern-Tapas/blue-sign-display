"use client";

import { LayoutGrid, List } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { cn } from "@/lib/cn";
import type { FilterState } from "@/lib/filters";
import { formatNumber } from "@/lib/format";
import { SortSelect } from "./sort-select";

export type FilterBarProps = {
  value: FilterState;
  onChange: (next: FilterState) => void;
  resultCount: number;
  /** Left slot — typically the mobile "Filters" sheet trigger. */
  leading?: React.ReactNode;
  className?: string;
};

/** Toolbar above product results: count, sort, grid/list toggle. */
export function FilterBar({ value, onChange, resultCount, leading, className }: FilterBarProps) {
  return (
    <Card
      data-slot="filter-bar"
      variant="outline"
      padding="none"
      className={cn("flex-row flex-wrap items-center gap-2 p-1.5 pl-2 sm:rounded-pill sm:pl-5", className)}
    >
      {leading}
      <p className="text-label text-fg-muted" aria-live="polite">
        <span className="text-fg figures">{formatNumber(resultCount)}</span> {resultCount === 1 ? "product" : "products"}
      </p>
      <div className="ml-auto flex items-center gap-2">
        <SortSelect
          variant="sunken"
          value={value.sort}
          onValueChange={(sort) => onChange({ ...value, sort, page: 1 })}
          className="w-auto border-transparent sm:min-w-56"
        />
        <SegmentedControl
          aria-label="Layout"
          size="sm"
          className="hidden sm:inline-flex"
          value={value.view}
          onValueChange={(v) => onChange({ ...value, view: v as FilterState["view"] })}
          options={[
            { value: "grid", label: null, icon: <LayoutGrid aria-hidden />, ariaLabel: "Grid view" },
            { value: "list", label: null, icon: <List aria-hidden />, ariaLabel: "List view" },
          ]}
        />
      </div>
    </Card>
  );
}
