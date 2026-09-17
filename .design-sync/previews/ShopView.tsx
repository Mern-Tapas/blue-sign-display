import { sampleData, ShopView } from "@bluesigns/ui";

const { products, categories, priceBounds } = sampleData;

// ShopView parses nothing itself: pass the filters the server read from the URL.
const noFilters = {
  q: "",
  categories: [] as string[],
  brands: [] as string[],
  colors: [] as string[],
  sizes: [] as string[],
  price: null,
  rating: null,
  inStock: false,
  sale: false,
  discount: null,
  delivery: null,
  sort: "featured" as const,
  view: "grid" as const,
  page: 1,
};

export const CategoryListing = () => (
  <ShopView
    products={products}
    categories={categories}
    priceBounds={priceBounds}
    initialFilters={{ ...noFilters, categories: ["footwear"] }}
    listing={{
      breadcrumbs: [{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Footwear" }],
      title: "Footwear",
      muted: "collection",
      description: "Runners, court classics and trail shoes, delivered across India.",
    }}
  />
);

export const SearchResults = () => (
  <ShopView products={products} categories={categories} priceBounds={priceBounds} initialFilters={{ ...noFilters, q: "headphones" }} />
);

export const ListView = () => (
  <ShopView
    products={products}
    categories={categories}
    priceBounds={priceBounds}
    initialFilters={{ ...noFilters, categories: ["audio", "watches"], view: "list" }}
    listing={{ breadcrumbs: [{ label: "Home", href: "/" }, { label: "Electronics" }], title: "Electronics" }}
  />
);

export const ZeroResults = () => (
  <ShopView products={products} categories={categories} priceBounds={priceBounds} initialFilters={{ ...noFilters, q: "saree", inStock: true }} />
);
