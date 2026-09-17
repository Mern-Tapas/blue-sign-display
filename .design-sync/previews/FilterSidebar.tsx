import { useState } from "react";
import { Card, FilterSidebar, sampleData } from "@bluesigns/ui";

const { products, categories, priceBounds } = sampleData;
const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

// Facet values with counts, derived from the catalogue (same shape the listing page builds).
const count = (values: string[]) => {
  const m = new Map<string, number>();
  for (const v of values) m.set(v, (m.get(v) ?? 0) + 1);
  return [...m.entries()].map(([value, n]) => ({ value, count: n }));
};
const pctOff = (p: { price: number; compareAt?: number }) => (p.compareAt ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100) : 0);
const colorMap = new Map<string, string>();
for (const p of products) for (const c of p.colors ?? []) colorMap.set(c.name, c.value);
const facets = {
  discounts: [10, 30, 50, 70].map((d) => ({ value: d, count: products.filter((p) => pctOff(p) >= d).length })),
  delivery: [
    { days: 1, label: "Get it by tomorrow" },
    { days: 2, label: "Within 2 days" },
    { days: 4, label: "Within 4 days" },
  ].map((o) => ({ ...o, count: products.filter((p) => (p.deliveryDays ?? 99) <= o.days).length })),
  categories: count(products.map((p) => p.category)),
  brands: count(products.map((p) => p.brand)).sort((a, b) => a.value.localeCompare(b.value)),
  colors: [...colorMap.entries()].map(([name, value]) => ({ name, value })),
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "38", "39", "40", "41", "42", "43", "44"],
};

const empty = {
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
type Filters = typeof empty;

function Sidebar({ initial, defaultOpen }: { initial?: Partial<Filters>; defaultOpen?: string[] }) {
  const [value, setValue] = useState<Filters>({ ...empty, ...initial });
  return (
    <Card variant="outline" padding="none" className="p-5" style={{ maxWidth: 300 }}>
      <FilterSidebar
        facets={facets}
        categoryNames={categoryNames}
        priceBounds={priceBounds}
        value={value}
        onChange={(next) => setValue(next as Filters)}
        defaultOpen={defaultOpen}
      />
    </Card>
  );
}

export const WithActiveFilters = () => <Sidebar initial={{ categories: ["apparel"], brands: ["Common Thread"], discount: 30 }} defaultOpen={["category", "brand", "discount"]} />;

export const Default = () => <Sidebar />;

export const PriceAndSizeOpen = () => <Sidebar initial={{ price: [999, 4999], sizes: ["M", "L"] }} defaultOpen={["price", "size"]} />;
