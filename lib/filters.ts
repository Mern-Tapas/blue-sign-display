import type { Product } from "./data/types";
import { discountPercent } from "./format";

/** "10% and above" … discount thresholds offered as filters. */
export const discountOptions = [10, 30, 50, 70];

export const deliveryOptions = [
  { days: 1, label: "Get it by tomorrow" },
  { days: 2, label: "Within 2 days" },
  { days: 4, label: "Within 4 days" },
];

export type SortKey = "featured" | "newest" | "rating" | "price-asc" | "price-desc";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export type FilterState = {
  q: string;
  categories: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  price: [number, number] | null;
  rating: number | null;
  inStock: boolean;
  sale: boolean;
  /** Minimum % off MRP. */
  discount: number | null;
  /** Deliver within N days. */
  delivery: number | null;
  sort: SortKey;
  view: "grid" | "list";
  page: number;
};

export const emptyFilters: FilterState = {
  q: "",
  categories: [],
  brands: [],
  colors: [],
  sizes: [],
  price: null,
  rating: null,
  inStock: false,
  sale: false,
  discount: null,
  delivery: null,
  sort: "featured",
  view: "grid",
  page: 1,
};

type Params = Record<string, string | string[] | undefined>;

const list = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v.join(",") : (v ?? "")).split(",").map((s) => s.trim()).filter(Boolean);
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export function parseFilters(params: Params): FilterState {
  const priceRaw = list(params.price).map(Number);
  const sort = one(params.sort) as SortKey | undefined;
  const rating = Number(one(params.rating));
  const page = Number(one(params.page));
  const discount = Number(one(params.discount));
  const delivery = Number(one(params.delivery));
  return {
    q: one(params.q) ?? "",
    categories: list(params.category),
    brands: list(params.brand),
    colors: list(params.color),
    sizes: list(params.size),
    price: priceRaw.length === 2 && priceRaw.every(Number.isFinite) ? [priceRaw[0]!, priceRaw[1]!] : null,
    rating: rating >= 1 && rating <= 5 ? rating : null,
    inStock: one(params.stock) === "1",
    sale: one(params.sale) === "1",
    discount: discountOptions.includes(discount) ? discount : null,
    delivery: deliveryOptions.some((o) => o.days === delivery) ? delivery : null,
    sort: sortOptions.some((o) => o.value === sort) ? sort! : "featured",
    view: one(params.view) === "list" ? "list" : "grid",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

export function serializeFilters(f: FilterState): string {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.categories.length) p.set("category", f.categories.join(","));
  if (f.brands.length) p.set("brand", f.brands.join(","));
  if (f.colors.length) p.set("color", f.colors.join(","));
  if (f.sizes.length) p.set("size", f.sizes.join(","));
  if (f.price) p.set("price", f.price.join(","));
  if (f.rating) p.set("rating", String(f.rating));
  if (f.inStock) p.set("stock", "1");
  if (f.sale) p.set("sale", "1");
  if (f.discount) p.set("discount", String(f.discount));
  if (f.delivery) p.set("delivery", String(f.delivery));
  if (f.sort !== "featured") p.set("sort", f.sort);
  if (f.view !== "grid") p.set("view", f.view);
  if (f.page > 1) p.set("page", String(f.page));
  return p.toString();
}

export function applyFilters(products: Product[], f: FilterState): Product[] {
  const q = f.q.toLowerCase();
  const result = products.filter((p) => {
    if (q && !`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q)) return false;
    if (f.categories.length && !f.categories.includes(p.category)) return false;
    if (f.brands.length && !f.brands.includes(p.brand)) return false;
    if (f.colors.length && !p.colors?.some((c) => f.colors.includes(c.name))) return false;
    if (f.sizes.length && !p.sizes?.some((s) => f.sizes.includes(s))) return false;
    if (f.price && (p.price < f.price[0] || p.price > f.price[1])) return false;
    if (f.rating && p.rating < f.rating) return false;
    if (f.inStock && p.stock <= 0) return false;
    if (f.sale && !(p.compareAt && p.compareAt > p.price)) return false;
    if (f.discount && discountPercent(p.price, p.compareAt) < f.discount) return false;
    if (f.delivery && (p.deliveryDays ?? 99) > f.delivery) return false;
    return true;
  });
  const sorted = [...result];
  switch (f.sort) {
    case "newest":
      sorted.sort((a, b) => Number(b.badges?.includes("new") ?? false) - Number(a.badges?.includes("new") ?? false));
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
  }
  return sorted;
}

/** Number of active refinement filters (excludes sort / view / page). */
export function countActiveFilters(f: FilterState) {
  return (
    f.categories.length +
    f.brands.length +
    f.colors.length +
    f.sizes.length +
    (f.price ? 1 : 0) +
    (f.rating ? 1 : 0) +
    (f.inStock ? 1 : 0) +
    (f.sale ? 1 : 0) +
    (f.discount ? 1 : 0) +
    (f.delivery ? 1 : 0) +
    (f.q ? 1 : 0)
  );
}

/** Facet values with counts, derived from the catalog. */
export function buildFacets(products: Product[]) {
  const count = <T extends string>(values: T[]) => {
    const m = new Map<T, number>();
    for (const v of values) m.set(v, (m.get(v) ?? 0) + 1);
    return [...m.entries()].map(([value, n]) => ({ value, count: n }));
  };
  const colorMap = new Map<string, string>();
  for (const p of products) for (const c of p.colors ?? []) colorMap.set(c.name, c.value);
  const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];
  return {
    discounts: discountOptions.map((d) => ({ value: d, count: products.filter((p) => discountPercent(p.price, p.compareAt) >= d).length })),
    delivery: deliveryOptions.map((o) => ({ ...o, count: products.filter((p) => (p.deliveryDays ?? 99) <= o.days).length })),
    categories: count(products.map((p) => p.category)),
    brands: count(products.map((p) => p.brand)).sort((a, b) => a.value.localeCompare(b.value)),
    colors: [...colorMap.entries()].map(([name, value]) => ({ name, value })),
    sizes: [...new Set(products.flatMap((p) => p.sizes ?? []))]
      .filter((s) => !s.endsWith("ml"))
      .sort((a, b) => {
        const ia = sizeOrder.indexOf(a);
        const ib = sizeOrder.indexOf(b);
        if (ia >= 0 || ib >= 0) return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
        return Number(a) - Number(b);
      }),
  };
}

export type Facets = ReturnType<typeof buildFacets>;
