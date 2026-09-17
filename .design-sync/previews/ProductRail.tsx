import { ProductRail, sampleData } from "@bluesigns/ui";

const { products } = sampleData;

export const BestSellers = () => (
  <div style={{ width: 1100 }}>
    <ProductRail title="Best" muted="sellers" description="The pieces shoppers reorder most." products={products.slice(0, 10)} href="/shop?sort=rating" preloadCount={4} />
  </div>
);

export const UnderBudget = () => (
  <div style={{ width: 760 }}>
    <ProductRail
      title="Under ₹2,999"
      products={products.filter((p) => p.price < 2999)}
      href="/shop?max=2999"
      linkLabel="See all"
      slideClassName="basis-1/3"
    />
  </div>
);
