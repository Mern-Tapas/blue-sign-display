import { useState } from "react";
import { ActiveFilterChips, sampleData } from "@bluesigns/ui";

const { categories } = sampleData;
const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

// FilterState: the shared listing filter shape (see FilterBar / FilterSidebar).
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

function Chips({ initial }: { initial: Partial<Filters> }) {
  const [value, setValue] = useState<Filters>({ ...empty, ...initial });
  return (
    <div style={{ maxWidth: 720 }}>
      <ActiveFilterChips value={value} onChange={(next) => setValue(next as Filters)} categoryNames={categoryNames} />
    </div>
  );
}

export const ManyFilters = () => (
  <Chips
    initial={{ categories: ["apparel", "footwear"], brands: ["Common Thread"], sizes: ["M"], price: [999, 4999], rating: 4, discount: 30, delivery: 1, inStock: true }}
  />
);

export const SearchAndSale = () => <Chips initial={{ q: "hoodie", sale: true, colors: ["Black"] }} />;

export const SingleFilter = () => <Chips initial={{ brands: ["Sonora"] }} />;
