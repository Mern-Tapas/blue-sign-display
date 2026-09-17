import { ProductReviews, sampleData } from "@bluesigns/ui";

const { aspectRatings, getProduct, ratingBreakdown, reviews } = sampleData;
const headphones = getProduct("aura-wireless-headphones")!;

export const FullBlock = () => (
  <ProductReviews
    product={{ name: headphones.name, image: headphones.images[0]! }}
    average={headphones.rating}
    total={headphones.reviewCount}
    breakdown={ratingBreakdown}
    aspects={aspectRatings}
    reviews={reviews}
    pageSize={3}
  />
);

export const WithoutAspects = () => {
  const hoodie = getProduct("fleece-hoodie")!;
  return (
    <ProductReviews
      product={{ name: hoodie.name, image: hoodie.images[0]! }}
      average={4.2}
      total={318}
      breakdown={[
        { stars: 5, count: 164 },
        { stars: 4, count: 92 },
        { stars: 3, count: 38 },
        { stars: 2, count: 14 },
        { stars: 1, count: 10 },
      ]}
      reviews={reviews.slice(1, 3).map((r) => ({ ...r, media: undefined }))}
    />
  );
};
