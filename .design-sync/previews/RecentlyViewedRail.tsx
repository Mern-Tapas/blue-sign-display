import { RecentlyViewedRail, sampleData, TrackRecentlyViewed } from "@bluesigns/ui";

const { products } = sampleData;

// Product pages record views with <TrackRecentlyViewed>; the rail reads this device's history.
const viewed = ["thermal-bottle", "court-low-sneaker", "nomad-backpack", "pulse-smart-watch", "fleece-hoodie", "no-5-eau-de-parfum"];

export const WithHistory = () => (
  <div style={{ width: 1100 }}>
    {viewed.map((slug) => (
      <TrackRecentlyViewed key={slug} slug={slug} />
    ))}
    <RecentlyViewedRail products={products} />
  </div>
);

export const ExcludingCurrentProduct = () => (
  <div style={{ width: 760 }}>
    {viewed.map((slug) => (
      <TrackRecentlyViewed key={slug} slug={slug} />
    ))}
    <RecentlyViewedRail products={products} excludeSlug="no-5-eau-de-parfum" title="You looked at" max={4} />
  </div>
);
