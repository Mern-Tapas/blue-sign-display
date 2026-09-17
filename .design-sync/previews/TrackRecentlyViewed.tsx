import { ProductCard, RecentlyViewedRail, sampleData, TrackRecentlyViewed } from "@bluesigns/ui";

const { products } = sampleData;

const current = products.find((p) => p.slug === "pulse-smart-watch") ?? products[0]!;
const earlier = ["thermal-bottle", "court-low-sneaker", "nomad-backpack", "fleece-hoodie"];

/** Renders nothing itself: drop it on a product page and the view lands in the Recently viewed rail. */
export const OnAProductPage = () => (
  <div className="flex flex-col gap-8 bg-canvas p-6" style={{ width: 1100 }}>
    {earlier.map((slug) => (
      <TrackRecentlyViewed key={slug} slug={slug} />
    ))}
    <TrackRecentlyViewed slug={current.slug} />
    <div style={{ width: 280 }}>
      <ProductCard product={current} />
    </div>
    <RecentlyViewedRail products={products} excludeSlug={current.slug} />
  </div>
);
