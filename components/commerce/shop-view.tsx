"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ActiveFilterChips } from "@/components/filters/active-filter-chips";
import { FilterBar } from "@/components/filters/filter-bar";
import { FilterSidebar } from "@/components/filters/filter-sidebar";
import { CompareToggle, CompareTray } from "@/components/listing/compare";
import { ListingHeader, type ListingHeaderProps } from "@/components/listing/listing-header";
import { MobileListingToolbar } from "@/components/listing/mobile-listing-toolbar";
import { QuickViewDialog } from "@/components/listing/quick-view-dialog";
import { SearchResultsHeader } from "@/components/listing/search-results-header";
import { ZeroResults } from "@/components/listing/zero-results";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/cn";
import { trendingSearches } from "@/lib/data/india";
import type { Category, Product } from "@/lib/data/types";
import { applyFilters, buildFacets, countActiveFilters, emptyFilters, serializeFilters, type FilterState } from "@/lib/filters";
import { buildVocabulary, suggestCorrection } from "@/lib/search";
import { ProductCard } from "./product-card";

const PAGE_SIZE = 9;

export type ShopViewProps = {
  products: Product[];
  categories: Category[];
  priceBounds: { min: number; max: number };
  /** Filters parsed on the server from the URL. */
  initialFilters: FilterState;
  /** Category / collection heading; replaced by the search heading when there is a query. */
  listing?: Omit<ListingHeaderProps, "count">;
};

/**
 * Client shop: filters apply instantly on the client and are mirrored to the URL
 * with router.replace, so links like /shop?category=audio are shareable.
 * Desktop gets the facet sidebar and toolbar; phones get the sticky Sort | Filter bar.
 */
export function ShopView({ products, categories, priceBounds, initialFilters, listing }: ShopViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Local state that re-syncs when the server-provided filters change (e.g. mega-menu link).
  // `base` = the server key when the local change was made. Local wins while the URL
  // update is in flight or once the server has caught up; an unrelated navigation wins otherwise.
  const serverKey = serializeFilters(initialFilters);
  const [local, setLocal] = useState({ base: serverKey, filters: initialFilters });
  const filters = local.base === serverKey || serializeFilters(local.filters) === serverKey ? local.filters : initialFilters;

  const update = (next: FilterState) => {
    const key = serializeFilters(next);
    setLocal({ base: serverKey, filters: next });
    startTransition(() => {
      router.replace(key ? `${pathname}?${key}` : pathname, { scroll: false });
    });
  };

  const facets = useMemo(() => buildFacets(products), [products]);
  const vocabulary = useMemo(() => buildVocabulary(products.flatMap((p) => [p.name, p.brand, p.category])), [products]);
  const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

  let results = applyFilters(products, filters);
  const correction = filters.q ? suggestCorrection(filters.q, vocabulary) : null;
  // Zero results for a misspelling: show the corrected results and say so
  const autoCorrected = results.length === 0 && Boolean(correction) && applyFilters(products, { ...filters, q: correction! }).length > 0;
  if (autoCorrected) results = applyFilters(products, { ...filters, q: correction! });

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(filters.page, pageCount);
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const active = countActiveFilters(filters);
  const refinements = active - (filters.q ? 1 : 0);
  const clearAll = () => update({ ...emptyFilters, q: filters.q, sort: filters.sort, view: filters.view });

  return (
    <div className="flex flex-col gap-8">
      {filters.q ? (
        <SearchResultsHeader
          query={filters.q}
          count={results.length}
          correction={correction}
          autoCorrected={autoCorrected}
          related={results.length ? trendingSearches.filter((t) => !t.toLowerCase().includes(filters.q.toLowerCase())).slice(0, 3) : []}
        />
      ) : (
        listing && <ListingHeader {...listing} count={results.length} />
      )}

      <div className="grid gap-6 lg:grid-cols-[17rem_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          <Card variant="outline" className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto">
            <FilterSidebar facets={facets} categoryNames={categoryNames} priceBounds={priceBounds} value={filters} onChange={update} />
          </Card>
        </aside>

        <div className="flex min-w-0 flex-col gap-4">
          <MobileListingToolbar
            value={filters}
            onChange={update}
            facets={facets}
            categoryNames={categoryNames}
            priceBounds={priceBounds}
            countResults={(draft) => applyFilters(products, draft).length}
          />
          <FilterBar value={filters} onChange={update} resultCount={results.length} className="max-lg:hidden" />
          <ActiveFilterChips value={filters} onChange={update} categoryNames={categoryNames} />

          <div aria-busy={isPending} className={cn("transition-opacity duration-(--dur-fast)", isPending && "opacity-70")}>
            {visible.length === 0 ? (
              <ZeroResults
                query={filters.q || undefined}
                correction={autoCorrected ? null : correction}
                hasFilters={refinements > 0}
                clearAction={
                  <Button variant="secondary" onClick={clearAll}>
                    Clear filters
                  </Button>
                }
                popularSearches={trendingSearches}
                categories={categories.map((c) => ({ href: `/shop?category=${c.slug}`, label: c.name, image: c.image }))}
              />
            ) : filters.view === "list" ? (
              <div className="flex flex-col gap-3">
                {visible.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    layout="list"
                    preload={i < 2}
                    imageActions={<QuickViewDialog product={p} />}
                    footer={<CompareToggle product={p} categoryName={categoryNames[p.category]} />}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
                {visible.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    preload={i < 3}
                    imageActions={<QuickViewDialog product={p} />}
                    footer={<CompareToggle product={p} categoryName={categoryNames[p.category]} />}
                  />
                ))}
              </div>
            )}
          </div>

          {results.length > 0 && (
            <Pagination
              className="mt-4"
              page={page}
              pageCount={pageCount}
              onPageChange={(p) => {
                update({ ...filters, page: p });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              summary={
                <>
                  Showing{" "}
                  <span className="text-fg figures">
                    {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, results.length)}
                  </span>{" "}
                  of <span className="text-fg figures">{results.length}</span>
                </>
              }
            />
          )}
        </div>
      </div>

      <CompareTray products={products} />
    </div>
  );
}
