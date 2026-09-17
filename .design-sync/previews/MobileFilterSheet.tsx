import { useEffect, useRef, useState } from "react";
import { Button, MobileFilterSheet, discountPercent, icons, sampleData } from "@bluesigns/ui";

const { SlidersHorizontal } = icons;
const { products, categories, brands, priceBounds } = sampleData;

// Facet values with counts, derived from the demo catalogue.
const facets = {
  discounts: [10, 30, 50, 70].map((d) => ({ value: d, count: products.filter((p) => discountPercent(p.price, p.compareAt) >= d).length })),
  delivery: [
    { days: 1, label: "Get it by tomorrow" },
    { days: 2, label: "Within 2 days" },
    { days: 4, label: "Within 4 days" },
  ].map((o) => ({ ...o, count: products.filter((p) => (p.deliveryDays ?? 99) <= o.days).length })),
  categories: categories.map((c) => ({ value: c.slug, count: products.filter((p) => p.category === c.slug).length })),
  brands: brands.map((b) => ({ value: b, count: products.filter((p) => p.brand === b).length })),
  colors: [...new Map(products.flatMap((p) => p.colors ?? []).map((c) => [c.name, c])).values()],
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "6", "7", "8", "9", "10"],
};
const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
const noFilters = {
  q: "",
  categories: [] as string[],
  brands: [] as string[],
  colors: [] as string[],
  sizes: [] as string[],
  price: null as [number, number] | null,
  rating: null as number | null,
  inStock: false,
  sale: false,
  discount: null as number | null,
  delivery: null as number | null,
  sort: "featured" as const,
  view: "grid" as const,
  page: 1,
};
type Filters = typeof noFilters;
const countResults = (f: Filters) =>
  products.filter(
    (p) =>
      (!f.categories.length || f.categories.includes(p.category)) &&
      (!f.brands.length || f.brands.includes(p.brand)) &&
      (!f.discount || discountPercent(p.price, p.compareAt) >= f.discount) &&
      (!f.inStock || p.stock > 0),
  ).length;

// Preview only: the sheet keeps its open state internally, so click the trigger once.
function OpenOnMount({ initial }: { initial: Filters }) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<Filters>(initial);
  useEffect(() => {
    ref.current?.querySelector("button")?.click();
    // Drop the focus ring the sheet puts on its first control when it opens.
    const t = window.setTimeout(() => (document.activeElement as HTMLElement | null)?.blur(), 300);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <div ref={ref}>
      <MobileFilterSheet
        value={value}
        onApply={(next) => setValue(next as Filters)}
        facets={facets}
        categoryNames={categoryNames}
        priceBounds={priceBounds}
        countResults={(d) => countResults(d as Filters)}
        trigger={
          <Button variant="secondary" leadingIcon={<SlidersHorizontal aria-hidden />}>
            Filter
          </Button>
        }
      />
    </div>
  );
}

export const WithFiltersApplied = () => <OpenOnMount initial={{ ...noFilters, categories: ["audio", "watches"], discount: 10 }} />;

export const NothingApplied = () => <OpenOnMount initial={noFilters} />;
