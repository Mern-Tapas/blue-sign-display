import { ListingHeader, sampleData } from "@bluesigns/ui";

const { categories } = sampleData;
const audio = categories[0]!;

export const Category = () => (
  <div style={{ maxWidth: 900 }}>
    <ListingHeader
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: audio.name }]}
      title={audio.name}
      count={128}
      description={audio.description}
      subcategories={audio.subcategories.map((s, i) => ({ href: `/shop?category=audio&sub=${s}`, label: s, active: i === 0 }))}
    />
  </div>
);

export const AllProducts = () => (
  <div style={{ maxWidth: 900 }}>
    <ListingHeader breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]} title="All products" muted="Festive edit" count={1842} />
  </div>
);

export const SingleItem = () => (
  <div style={{ maxWidth: 900 }}>
    <ListingHeader breadcrumbs={[{ label: "Home", href: "/" }, { label: "Home & living", href: "/shop?category=home" }, { label: "Lamps" }]} title="Table lamps" count={1} />
  </div>
);
