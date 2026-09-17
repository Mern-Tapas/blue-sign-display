import { ProductCard, sampleData } from "@bluesigns/ui";

const { products } = sampleData;

export const Grid = () => (
  <div className="grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-3">
    {products.slice(0, 3).map((p, i) => (
      <ProductCard key={p.id} product={p} preload={i < 2} />
    ))}
  </div>
);

export const StarRating = () => (
  <div className="max-w-60">
    <ProductCard product={products[1]!} ratingStyle="stars" />
  </div>
);

export const ListLayout = () => (
  <div className="max-w-2xl">
    <ProductCard product={products[4]!} layout="list" />
  </div>
);
