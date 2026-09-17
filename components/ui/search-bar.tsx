"use client";

import { useId, useMemo, useState } from "react";
import { ArrowUpRight, Clock, Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useListbox } from "@/lib/form/use-listbox";
import { controlShellVariants } from "./input";

export type SearchSuggestion = {
  id: string;
  label: string;
  /** Secondary text — category, price, etc. */
  meta?: string;
  thumbnail?: React.ReactNode;
};

export type SearchBarProps = {
  suggestions: SearchSuggestion[];
  recent?: string[];
  placeholder?: string;
  onSelect?: (s: SearchSuggestion) => void;
  onSubmit?: (query: string) => void;
  maxResults?: number;
  variant?: "surface" | "sunken";
  size?: "sm" | "md" | "lg";
  className?: string;
};

function Highlight({ text, query }: { text: string; query: string }) {
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (!query || i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-transparent font-medium text-fg">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

/** Accessible combobox (WAI-ARIA 1.2 list autocomplete) with suggestions and recent searches. */
export function SearchBar({
  suggestions,
  recent = [],
  placeholder = "Search products…",
  onSelect,
  onSubmit,
  maxResults = 6,
  variant = "sunken",
  size = "md",
  className,
}: SearchBarProps) {
  const id = useId();
  const listId = `${id}-list`;
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return suggestions
      .filter((s) => s.label.toLowerCase().includes(q) || s.meta?.toLowerCase().includes(q))
      .slice(0, maxResults);
  }, [query, suggestions, maxResults]);

  const showRecent = !query.trim() && recent.length > 0;
  const options: { key: string; label: string; suggestion?: SearchSuggestion }[] = showRecent
    ? recent.map((r) => ({ key: `recent-${r}`, label: r }))
    : results.map((s) => ({ key: s.id, label: s.label, suggestion: s }));
  const expanded = open && (options.length > 0 || query.trim().length > 0);

  const listbox = useListbox({
    count: options.length,
    // Nothing is highlighted until an arrow key asks for it: until then Enter means
    // "search for what I typed", not "pick the first guess".
    initialIndex: -1,
    // Home and End belong to the caret in a field someone is typing a query into.
    homeEnd: false,
  });
  const { active, setActive } = listbox;

  function choose(index: number) {
    const opt = options[index];
    if (!opt) return;
    if (opt.suggestion) onSelect?.(opt.suggestion);
    else {
      setQuery(opt.label);
      onSubmit?.(opt.label);
    }
    setOpen(false);
    setActive(-1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // ArrowDown also opens the list, which is this component's business, not the hook's.
    if (e.key === "ArrowDown") setOpen(true);
    if (listbox.handleKeyDown(e)) return;
    if (e.key === "Enter") {
      e.preventDefault();
      if (expanded && active >= 0) choose(active);
      else if (query.trim()) {
        onSubmit?.(query.trim());
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      if (open) setOpen(false);
      else setQuery("");
      setActive(-1);
    }
  }

  return (
    <div
      data-slot="search-bar"
      role="search"
      className={cn("relative w-full", className)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <div className={controlShellVariants({ variant, size })}>
        <Search aria-hidden />
        <input
          type="search"
          role="combobox"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={expanded && active >= 0 ? `${id}-opt-${active}` : undefined}
          aria-label={placeholder}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-fg-placeholder [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setActive(-1);
            }}
            className="state-layer hit-area relative flex size-6 items-center justify-center rounded-pill text-fg-muted hover:text-fg"
          >
            <X aria-hidden className="size-3.5!" />
          </button>
        )}
      </div>

      <div
        hidden={!expanded}
        className="absolute inset-x-0 top-full z-(--z-popover) mt-2 animate-slide-up overflow-hidden rounded-xl bg-surface-raised p-1.5 shadow-popover"
      >
        {showRecent && <p className="px-3 pt-2 pb-1 text-caption text-fg-muted">Recent searches</p>}
        <ul id={listId} role="listbox" aria-label="Suggestions">
          {options.map((opt, i) => (
            <li
              key={opt.key}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(i)}
              className="flex h-12 cursor-pointer items-center gap-3 rounded-md px-3 text-body text-fg-muted transition-colors duration-(--dur-instant) aria-selected:bg-highlight aria-selected:text-fg"
            >
              {opt.suggestion ? (
                <>
                  {opt.suggestion.thumbnail && (
                    <span className="size-8 shrink-0 overflow-hidden rounded-sm bg-surface-sunken">{opt.suggestion.thumbnail}</span>
                  )}
                  <span className="min-w-0 flex-1 truncate">
                    <Highlight text={opt.label} query={query.trim()} />
                  </span>
                  {opt.suggestion.meta && <span className="shrink-0 text-caption text-fg-muted">{opt.suggestion.meta}</span>}
                  <ArrowUpRight aria-hidden className="size-4 shrink-0 text-fg-subtle" />
                </>
              ) : (
                <>
                  <Clock aria-hidden className="size-4 shrink-0 text-fg-subtle" />
                  <span className="flex-1 truncate">{opt.label}</span>
                </>
              )}
            </li>
          ))}
        </ul>
        {!showRecent && results.length === 0 && (
          <p className="px-3 py-4 text-center text-body text-fg-muted">
            No matches for “<span className="text-fg">{query}</span>”
          </p>
        )}
      </div>
    </div>
  );
}
