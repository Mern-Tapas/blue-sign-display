import { DealOfTheDay, sampleData } from "@bluesigns/ui";

const { featuredDeal, products } = sampleData;

const hoodie = products.find((p) => p.slug === "fleece-hoodie")!;

export const Contrast = () => (
  <div style={{ width: 960 }}>
    <DealOfTheDay product={featuredDeal.product} endsAt={featuredDeal.endsAt} note={featuredDeal.note} claimedPercent={62} />
  </div>
);

export const Surface = () => (
  <div style={{ width: 960 }}>
    <DealOfTheDay product={hoodie} endsAt="2026-12-20T23:59:59+05:30" tone="surface" title="Weekend deal" note="Limit 1 per order" />
  </div>
);
