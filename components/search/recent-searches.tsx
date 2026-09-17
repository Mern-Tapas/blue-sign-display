"use client";

import { Clock, X } from "lucide-react";
import { recentSearches, useRecentSearches } from "@/components/providers/search-store";
import { TextButton } from "@/components/ui/text-button";
import { cn } from "@/lib/cn";

export type RecentSearchesProps = {
  onSelect: (query: string) => void;
  /** Controlled list; defaults to the device's stored recent searches. */
  items?: string[];
  onRemove?: (query: string) => void;
  onClear?: () => void;
  layout?: "list" | "chips";
  max?: number;
  title?: string;
  className?: string;
};

/** Recent queries with per-item remove and Clear all. Renders nothing when empty. */
export function RecentSearches({ onSelect, items, onRemove, onClear, layout = "list", max = 6, title = "Recent searches", className }: RecentSearchesProps) {
  const stored = useRecentSearches();
  const list = (items ?? stored).slice(0, max);
  const remove = onRemove ?? recentSearches.remove;
  const clear = onClear ?? recentSearches.clear;

  if (list.length === 0) return null;

  return (
    <section data-slot="recent-searches" aria-label={title} className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-label text-fg">{title}</h3>
        <TextButton onClick={clear}>Clear all</TextButton>
      </div>
      {layout === "chips" ? (
        <ul className="flex flex-wrap gap-2">
          {list.map((q) => (
            <li key={q} className="flex h-control-sm items-center rounded-pill border border-border bg-surface text-label">
              <button type="button" onClick={() => onSelect(q)} className="hit-area relative flex h-full items-center gap-1.5 rounded-l-pill pr-1 pl-3 transition-colors duration-(--dur-fast) hover:text-accent-fg">
                <Clock aria-hidden className="size-icon-sm text-fg-muted" />
                {q}
              </button>
              <button
                type="button"
                aria-label={`Remove ${q} from recent searches`}
                onClick={() => remove(q)}
                className="state-layer relative mr-1 flex size-6 items-center justify-center rounded-pill text-fg-muted hover:text-fg"
              >
                <X aria-hidden className="size-icon-sm" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="-mx-3 flex flex-col">
          {list.map((q) => (
            <li key={q} className="group/row relative flex items-center rounded-md hover:bg-highlight">
              <button type="button" onClick={() => onSelect(q)} className="flex h-row-md min-w-0 flex-1 items-center gap-3 rounded-md pr-12 pl-3 text-left text-body text-fg focus-ring-row">
                <Clock aria-hidden className="size-icon-md shrink-0 text-fg-muted" />
                <span className="truncate">{q}</span>
              </button>
              <button
                type="button"
                aria-label={`Remove ${q} from recent searches`}
                onClick={() => remove(q)}
                className="state-layer hit-area absolute right-2 flex size-control-xs items-center justify-center rounded-pill text-fg-muted hover:text-fg"
              >
                <X aria-hidden className="size-icon-sm" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
