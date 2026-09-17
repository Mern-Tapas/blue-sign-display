import { CategoryStrip, sampleData } from "@bluesigns/ui";

const { navCategories } = sampleData;
const items = navCategories.map((c, i) => ({ href: `/shop?category=${c.slug}`, label: c.name, image: c.image, tag: i === 2 ? "New" : undefined }));

export const ScrollRow = () => (
  <div style={{ maxWidth: 820 }}>
    <CategoryStrip items={items} activeHref={items[0]!.href} />
  </div>
);

export const GridLarge = () => (
  <div style={{ maxWidth: 820 }}>
    <CategoryStrip items={items} layout="grid" size="lg" />
  </div>
);

export const Small = () => (
  <div style={{ maxWidth: 480 }}>
    <CategoryStrip items={items} size="sm" />
  </div>
);

export const SaleTags = () => (
  <div style={{ maxWidth: 820 }}>
    <CategoryStrip items={items.map((i) => ({ ...i, tag: "Sale" }))} layout="grid" size="md" aria-label="Sale categories" />
  </div>
);
