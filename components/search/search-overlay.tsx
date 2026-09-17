"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ArrowLeft, ArrowUpLeft, Search, X } from "lucide-react";
import { ProductImage } from "@/components/commerce/product-image";
import { recentSearches } from "@/components/providers/search-store";
import { DialogOverlay } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";
import { CategoryStrip, type CategoryStripItem } from "./category-strip";
import { RecentSearches } from "./recent-searches";
import { TrendingSearches } from "./trending-searches";

export type SearchOverlaySuggestion = {
  id: string;
  label: string;
  /** Brand or category line. */
  meta?: string;
  image?: string;
};

export type SearchOverlayCategory = { slug: string; name: string; image: string };

export type SearchOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestions: SearchOverlaySuggestion[];
  categories?: SearchOverlayCategory[];
  trending?: string[];
  /** Full search (Enter or "See all results"). Saved to recent searches first. */
  onSubmit: (query: string) => void;
  onSelectSuggestion: (s: SearchOverlaySuggestion) => void;
  onSelectCategory?: (slug: string, query: string) => void;
  categoryHref?: (slug: string) => string;
  placeholder?: string;
  maxSuggestions?: number;
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

type Option =
  | { kind: "all"; key: string; query: string }
  | { kind: "category"; key: string; category: SearchOverlayCategory }
  | { kind: "product"; key: string; suggestion: SearchOverlaySuggestion };

/**
 * Search as its own screen: full-screen on phones, a top panel from sm. Empty state offers
 * recent searches, trending queries and categories; typing shows "See all results", matching
 * categories and product suggestions in one keyboard-navigable listbox.
 */
export function SearchOverlay({
  open,
  onOpenChange,
  suggestions,
  categories = [],
  trending = [],
  onSubmit,
  onSelectSuggestion,
  onSelectCategory,
  categoryHref = (slug) => `/shop?category=${slug}`,
  placeholder = "Search for products, brands and more",
  maxSuggestions = 6,
}: SearchOverlayProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);
  const q = query.trim();

  const options = useMemo<Option[]>(() => {
    if (!q) return [];
    const needle = q.toLowerCase();
    const cats = categories.filter((c) => c.name.toLowerCase().includes(needle)).slice(0, 2);
    const products = suggestions
      .filter((s) => s.label.toLowerCase().includes(needle) || s.meta?.toLowerCase().includes(needle))
      .slice(0, maxSuggestions);
    return [
      { kind: "all", key: "all", query: q },
      ...cats.map((c) => ({ kind: "category" as const, key: `c-${c.slug}`, category: c })),
      ...products.map((s) => ({ kind: "product" as const, key: `p-${s.id}`, suggestion: s })),
    ];
  }, [q, categories, suggestions, maxSuggestions]);

  function close() {
    onOpenChange(false);
    setQuery("");
    setActive(-1);
  }

  function submit(value: string) {
    const v = value.trim();
    if (!v) return;
    recentSearches.add(v);
    onSubmit(v);
    close();
  }

  function choose(option: Option) {
    if (option.kind === "all") return submit(option.query);
    if (option.kind === "category") {
      recentSearches.add(q);
      onSelectCategory?.(option.category.slug, q);
    } else {
      recentSearches.add(option.suggestion.label);
      onSelectSuggestion(option.suggestion);
    }
    close();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" && options.length) {
      e.preventDefault();
      setActive((a) => (a + 1) % options.length);
    } else if (e.key === "ArrowUp" && options.length) {
      e.preventDefault();
      setActive((a) => (a <= 0 ? options.length - 1 : a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const option = options[active];
      if (option) choose(option);
      else submit(query);
    }
  }

  function fill(text: string) {
    setQuery(text);
    setActive(-1);
    inputRef.current?.focus();
  }

  const listId = `${id}-results`;
  const strip: CategoryStripItem[] = categories.map((c) => ({ href: categoryHref(c.slug), label: c.name, image: c.image }));

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogPrimitive.Portal>
        <DialogOverlay className="max-sm:hidden" />
        <DialogPrimitive.Content
          data-slot="search-overlay"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
          className={cn(
            "fixed z-(--z-modal) flex flex-col bg-surface text-fg outline-none",
            "inset-0 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in",
            "sm:inset-x-4 sm:top-4 sm:bottom-auto sm:mx-auto sm:max-h-[min(44rem,calc(100dvh-2rem))] sm:max-w-2xl sm:rounded-2xl sm:shadow-modal sm:data-[state=open]:animate-scale-in sm:data-[state=closed]:animate-scale-out",
          )}
        >
          <DialogPrimitive.Title className="sr-only">Search</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">Type to see suggestions. Use the arrow keys to move through them.</DialogPrimitive.Description>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              submit(query);
            }}
            className="flex items-center gap-2 border-b border-border-subtle p-3 pt-[max(0.75rem,env(safe-area-inset-top))]"
          >
            <DialogPrimitive.Close asChild>
              <IconButton label="Close search" variant="ghost" size="md" className="hit-area sm:hidden [&_svg]:size-icon-lg">
                <ArrowLeft aria-hidden />
              </IconButton>
            </DialogPrimitive.Close>
            <div className="group/control relative flex h-control-lg min-w-0 flex-1 items-center gap-2.5 rounded-pill bg-surface-sunken px-4 focus-ring-inset">
              <Search aria-hidden className="size-icon-md shrink-0 text-fg-muted" />
              <input
                ref={inputRef}
                type="search"
                role="combobox"
                enterKeyHint="search"
                autoComplete="off"
                aria-expanded={options.length > 0}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={active >= 0 ? `${id}-opt-${active}` : undefined}
                aria-label={placeholder}
                placeholder={placeholder}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(-1);
                }}
                onKeyDown={onKeyDown}
                className="h-full min-w-0 flex-1 bg-transparent text-body-lg outline-none placeholder:text-fg-placeholder [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <IconButton label="Clear search" variant="ghost" size="xs" onClick={() => fill("")}>
                  <X aria-hidden />
                </IconButton>
              )}
            </div>
            <DialogPrimitive.Close asChild>
              <IconButton label="Close search" variant="sunken" size="sm" className="hidden text-fg-muted hover:text-fg sm:inline-flex">
                <X aria-hidden />
              </IconButton>
            </DialogPrimitive.Close>
          </form>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            {!q ? (
              <div className="flex flex-col gap-6">
                <RecentSearches onSelect={submit} />
                <TrendingSearches items={trending} onSelect={submit} />
                {strip.length > 0 && (
                  <section aria-label="Popular categories" className="flex flex-col gap-3">
                    <h3 className="text-label text-fg">Popular categories</h3>
                    <div onClickCapture={(e) => (e.target as HTMLElement).closest("a") && close()}>
                      <CategoryStrip items={strip} size="sm" aria-label="Popular categories" className="[&_ul]:mx-0 [&_ul]:px-0" />
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <>
                <ul id={listId} role="listbox" aria-label="Search suggestions" className="-mx-2 flex flex-col">
                  {options.map((o, i) => (
                    <li
                      key={o.key}
                      id={`${id}-opt-${i}`}
                      role="option"
                      aria-selected={i === active}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseMove={() => i !== active && setActive(i)}
                      onClick={() => choose(o)}
                      className="group/opt flex min-h-row-lg cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-body text-fg transition-colors duration-(--dur-instant) aria-selected:bg-highlight"
                    >
                      {o.kind === "all" && (
                        <>
                          <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent-soft-fg">
                            <Search className="size-icon-md" />
                          </span>
                          <span className="min-w-0 flex-1 truncate">
                            See all results for <span className="font-medium">“{o.query}”</span>
                          </span>
                        </>
                      )}
                      {o.kind === "category" && (
                        <>
                          <ProductImage src={o.category.image} alt="" sizes="40px" wrapperClassName="size-10 shrink-0 rounded-md" />
                          <span className="min-w-0 flex-1 truncate">
                            <Highlight text={o.category.name} query={q} />
                            <span className="text-fg-muted"> · Category</span>
                          </span>
                        </>
                      )}
                      {o.kind === "product" && (
                        <>
                          {o.suggestion.image ? (
                            <ProductImage src={o.suggestion.image} alt="" sizes="40px" wrapperClassName="size-10 shrink-0 rounded-md" />
                          ) : (
                            <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-md bg-surface-sunken text-fg-muted">
                              <Search className="size-icon-md" />
                            </span>
                          )}
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-fg-muted">
                              <Highlight text={o.suggestion.label} query={q} />
                            </span>
                            {o.suggestion.meta && <span className="truncate text-caption text-fg-muted">{o.suggestion.meta}</span>}
                          </span>
                          <button
                            type="button"
                            tabIndex={-1}
                            aria-label={`Fill search with ${o.suggestion.label}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              fill(o.suggestion.label);
                            }}
                            className="state-layer hit-area relative flex size-control-xs shrink-0 items-center justify-center rounded-pill text-fg-muted hover:text-fg"
                          >
                            <ArrowUpLeft aria-hidden className="size-icon-md" />
                          </button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                {options.length === 1 && (
                  <p role="status" className="px-2 pt-4 text-center text-body text-fg-muted">
                    No suggestions for “<span className="text-fg">{q}</span>”. Press Enter to search anyway.
                  </p>
                )}
              </>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
