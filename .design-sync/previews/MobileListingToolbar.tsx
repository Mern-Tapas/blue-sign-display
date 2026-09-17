import { useState } from "react";
import { MobileListingToolbar, ProductCard, discountPercent, sampleData } from "@bluesigns/ui";

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
  sort: "featured" as "featured" | "newest" | "rating" | "price-asc" | "price-desc",
  view: "grid" as const,
  page: 1,
};
type Filters = typeof noFilters;
const matches = (f: Filters) =>
  products.filter(
    (p) =>
      (!f.categories.length || f.categories.includes(p.category)) &&
      (!f.brands.length || f.brands.includes(p.brand)) &&
      (!f.discount || discountPercent(p.price, p.compareAt) >= f.discount),
  );

function Demo({ initial, withGrid }: { initial: Filters; withGrid?: boolean }) {
  const [value, setValue] = useState<Filters>(initial);
  const results = matches(value);
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-canvas p-3" style={{ maxWidth: 390 }}>
      {/* `static` keeps the sticky toolbar in flow; `lg:flex` shows it on the wide preview canvas. */}
      <MobileListingToolbar
        value={value}
        onChange={(next) => setValue(next as Filters)}
        facets={facets}
        categoryNames={categoryNames}
        priceBounds={priceBounds}
        countResults={(d) => matches(d as Filters).length}
        className="static lg:flex"
      />
      <p className="px-1 text-caption text-fg-muted figures">{results.length} {results.length === 1 ? "product" : "products"}</p>
      {withGrid && (
        <div className="grid grid-cols-2 gap-3">
          {results.slice(0, 2).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export const OnListingPage = () => <Demo initial={noFilters} withGrid />;

export const FiltersApplied = () => <Demo initial={{ ...noFilters, categories: ["audio"], discount: 10, sort: "price-asc" }} />;

export const Default = () => <Demo initial={noFilters} />;
