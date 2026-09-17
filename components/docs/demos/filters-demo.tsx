"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { ActiveFilterChips } from "@/components/filters/active-filter-chips";
import { FilterBar } from "@/components/filters/filter-bar";
import { FilterSidebar } from "@/components/filters/filter-sidebar";
import { ProductCard } from "@/components/commerce/product-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Sheet, SheetBody, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { applyFilters, buildFacets, countActiveFilters, emptyFilters, type FilterState } from "@/lib/filters";
import type { Category, Product } from "@/lib/data/types";

export type FilterableGridProps = {
  products: Product[];
  categories: Category[];
  priceBounds: { min: number; max: number };
  initial?: Partial<FilterState>;
};

/** Local-state filtering demo. The /shop page uses the same components but syncs state to the URL. */
export function FilterableGrid({ products, categories, priceBounds, initial }: FilterableGridProps) {
  const [filters, setFilters] = useState<FilterState>({ ...emptyFilters, ...initial });
  const facets = buildFacets(products);
  const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
  const results = applyFilters(products, filters);
  const active = countActiveFilters(filters);

  const sidebar = (hideHeader?: boolean) => (
    <FilterSidebar
      facets={facets}
      categoryNames={categoryNames}
      priceBounds={priceBounds}
      value={filters}
      onChange={setFilters}
      hideHeader={hideHeader}
    />
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_1fr]">
      <Card asChild variant="outline" padding="none" className="hidden self-start p-5 lg:block">
        <aside>{sidebar()}</aside>
      </Card>
      <div className="flex min-w-0 flex-col gap-4">
        <FilterBar
          value={filters}
          onChange={setFilters}
          resultCount={results.length}
          leading={
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" size="sm" leadingIcon={<SlidersHorizontal aria-hidden />} className="lg:hidden">
                  Filters{active > 0 && ` (${active})`}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader title="Filters" />
                <SheetBody>{sidebar(true)}</SheetBody>
                <SheetFooter className="flex-row">
                  <Button variant="ghost" onClick={() => setFilters({ ...emptyFilters, sort: filters.sort, view: filters.view })}>
                    Clear
                  </Button>
                  <SheetClose asChild>
                    <Button className="flex-1">Show {results.length} results</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          }
        />
        <ActiveFilterChips value={filters} onChange={setFilters} categoryNames={categoryNames} />
        {results.length === 0 ? (
          <Card variant="outline" padding="none">
            <EmptyState
              title="No products match"
              description="Try removing a filter or widening the price range."
              action={
                <Button variant="secondary" onClick={() => setFilters(emptyFilters)}>
                  Clear all filters
                </Button>
              }
            />
          </Card>
        ) : filters.view === "list" ? (
          <div className="flex flex-col gap-3">
            {results.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} layout="list" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
            {results.slice(0, 6).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
