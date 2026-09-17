"use client";

import { useMemo, useState } from "react";
import { DsPreview } from "@/components/docs/ds-section";
import { ProductCard } from "@/components/commerce/product-card";
import { CompareTable, CompareToggle, CompareTray } from "@/components/listing/compare";
import { FacetSearchList } from "@/components/listing/facet-search-list";
import { MobileListingToolbar } from "@/components/listing/mobile-listing-toolbar";
import { QuickViewDialog } from "@/components/listing/quick-view-dialog";
import { Badge } from "@/components/ui/badge";
import { categories, getProduct, priceBounds, products } from "@/lib/data/products";
import { applyFilters, buildFacets, countActiveFilters, emptyFilters, type FilterState } from "@/lib/filters";

const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

export function CardVariantsDemo() {
  const picks = ["studio-over-ear-headphones", "pulse-smart-watch", "field-jacket", "no-5-eau-de-parfum"].map((s) => getProduct(s)!);
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {picks.map((p, i) => (
          <ProductCard
            key={p.id}
            product={p}
            preload={i < 2}
            imageActions={<QuickViewDialog product={p} />}
            footer={<CompareToggle product={p} categoryName={categoryNames[p.category]} />}
          />
        ))}
      </div>
      <ProductCard product={picks[1]!} layout="list" imageActions={<QuickViewDialog product={picks[1]!} />} footer={<CompareToggle product={picks[1]!} />} />
      <p className="flex flex-wrap items-center gap-2 text-caption text-fg-muted">
        <Badge tone="accent" size="sm">
          Demo
        </Badge>
        Studio Over-Ear is a sponsored placement; ratings and delivery speeds are illustrative. Tick Compare on two audio products to open the tray.
      </p>
      <CompareTray products={products} />
    </div>
  );
}

export function FacetSearchDemo() {
  const [selected, setSelected] = useState<string[]>(["Stride"]);
  const brands = ["Sonora", "Hale & Co", "Stride", "Common Thread", "Carry Supply", "Maison Lune", "Clear Days", "Form Studio", "Aurel", "Northwind", "Meridian", "Kinetic"].map((b, i) => ({
    value: b,
    count: [2, 2, 4, 3, 1, 1, 1, 2, 0, 5, 3, 2][i],
  }));
  return (
    <DsPreview label="FacetSearchList" className="flex-col items-stretch">
      <div className="max-w-xs">
        <FacetSearchList name="Brands" options={brands} selected={selected} onToggle={(v) => setSelected((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]))} />
      </div>
      <p className="text-caption text-fg-muted">Selected values stay pinned on top; zero-count brands are disabled, not hidden.</p>
    </DsPreview>
  );
}

export function MobileFiltersDemo() {
  const [filters, setFilters] = useState<FilterState>({ ...emptyFilters, discount: 10 });
  const facets = useMemo(() => buildFacets(products), []);
  const results = applyFilters(products, filters);
  return (
    <DsPreview label="MobileListingToolbar · MobileFilterSheet · SortSheet" surface="sunken" className="block">
      <div className="mx-auto flex max-w-sm flex-col gap-3 rounded-2xl border border-border bg-canvas p-3">
        <MobileListingToolbar
          value={filters}
          onChange={setFilters}
          facets={facets}
          categoryNames={categoryNames}
          priceBounds={priceBounds}
          countResults={(d) => applyFilters(products, d).length}
          className="static lg:flex"
        />
        <p className="px-1 text-caption text-fg-muted figures" aria-live="polite">
          {results.length} products · {countActiveFilters(filters)} filters applied
        </p>
      </div>
    </DsPreview>
  );
}

export function CompareTableDemo() {
  const audio = products.filter((p) => p.category === "audio" || p.category === "watches").slice(0, 3);
  return (
    <DsPreview label="CompareTable" className="block">
      <CompareTable products={audio} />
    </DsPreview>
  );
}
