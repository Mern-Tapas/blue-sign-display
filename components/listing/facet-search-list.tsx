"use client";

import { useId, useState } from "react";
import { Search, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { TextButton } from "@/components/ui/text-button";
import { cn } from "@/lib/cn";

export type FacetOption = { value: string; label?: string; count?: number; disabled?: boolean };

export type FacetSearchListProps = {
  /** Facet name, used for the search label ("Search brands"). */
  name: string;
  options: FacetOption[];
  selected: string[];
  onToggle: (value: string) => void;
  /** Rows shown before "+N more". */
  visibleCount?: number;
  /** Show the search field when there are more options than this. */
  searchThreshold?: number;
  className?: string;
};

/**
 * Long checkbox facet (brands, sizes, sellers): search field, selected values pinned on top,
 * "+N more" expander, zero-count values disabled rather than hidden.
 */
export function FacetSearchList({ name, options, selected, onToggle, visibleCount = 6, searchThreshold = 8, className }: FacetSearchListProps) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const q = query.trim().toLowerCase();

  const ordered = [...options.filter((o) => selected.includes(o.value)), ...options.filter((o) => !selected.includes(o.value))];
  const matches = q ? ordered.filter((o) => (o.label ?? o.value).toLowerCase().includes(q)) : ordered;
  const limit = q || expanded ? matches.length : Math.max(visibleCount, selected.length);
  const shown = matches.slice(0, limit);
  const hidden = matches.length - shown.length;

  return (
    <div data-slot="facet-search-list" className={cn("flex flex-col gap-3", className)}>
      {options.length > searchThreshold && (
        <div className="flex h-control-sm items-center gap-2 rounded-pill bg-surface-sunken px-3 focus-ring-inset">
          <Search aria-hidden className="size-icon-sm shrink-0 text-fg-muted" />
          <input
            type="search"
            aria-label={`Search ${name}`}
            aria-controls={`${id}-list`}
            placeholder={`Search ${name.toLowerCase()}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-full min-w-0 flex-1 bg-transparent text-label outline-none placeholder:text-fg-placeholder [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="state-layer hit-area relative flex size-5 items-center justify-center rounded-pill text-fg-muted">
              <X aria-hidden className="size-3" />
            </button>
          )}
        </div>
      )}
      <ul id={`${id}-list`} className="flex flex-col gap-3">
        {shown.map((o) => (
          <li key={o.value}>
            <Checkbox
              label={o.label ?? o.value}
              trailing={o.count}
              checked={selected.includes(o.value)}
              disabled={o.disabled || (o.count === 0 && !selected.includes(o.value))}
              onCheckedChange={() => onToggle(o.value)}
            />
          </li>
        ))}
      </ul>
      {q && matches.length === 0 && (
        <p role="status" className="text-caption text-fg-muted">
          No {name.toLowerCase()} match “{query}”
        </p>
      )}
      {!q && (hidden > 0 || expanded) && matches.length > visibleCount && (
        <TextButton aria-expanded={expanded} aria-controls={`${id}-list`} onClick={() => setExpanded((e) => !e)} className="self-start">
          {expanded ? "Show less" : `+${hidden} more`}
        </TextButton>
      )}
    </div>
  );
}
