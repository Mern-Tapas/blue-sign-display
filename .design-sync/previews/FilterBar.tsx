import { useState } from "react";
import { Button, FilterBar, icons } from "@bluesigns/ui";

const { SlidersHorizontal } = icons;

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
  sort: "featured" as "featured" | "newest" | "rating" | "price-asc" | "price-desc",
  view: "grid" as "grid" | "list",
  page: 1,
};
type Filters = typeof empty;

function Bar({ initial, count, leading }: { initial?: Partial<Filters>; count: number; leading?: React.ReactNode }) {
  const [value, setValue] = useState<Filters>({ ...empty, ...initial });
  return (
    <div className="rounded-xl bg-canvas p-4" style={{ maxWidth: 820 }}>
      <FilterBar value={value} onChange={(next) => setValue(next as Filters)} resultCount={count} leading={leading} />
    </div>
  );
}

export const Default = () => <Bar count={1284} />;

export const WithFiltersButton = () => (
  <Bar
    count={36}
    initial={{ sort: "price-asc" }}
    leading={
      <Button variant="secondary" size="sm" leadingIcon={<SlidersHorizontal aria-hidden />}>
        Filters (3)
      </Button>
    }
  />
);

export const ListViewSingleResult = () => <Bar count={1} initial={{ sort: "rating", view: "list" }} />;
