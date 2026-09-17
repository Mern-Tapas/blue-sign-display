import { SectionHeader } from "@bluesigns/ui";

export const WithLink = () => (
  <div style={{ width: 760 }}>
    <SectionHeader title="Trending now" muted="in Bengaluru" description="What shoppers near you are adding to their bags this week." href="/shop?sort=rating" />
  </div>
);

export const TitleOnly = () => (
  <div style={{ width: 760 }}>
    <SectionHeader title="Shop by category" />
  </div>
);

export const CustomLinkLabel = () => (
  <div style={{ width: 760 }}>
    <SectionHeader title="Festive deals" muted="up to 60% off" href="/shop?sale=1" linkLabel="See all offers" />
  </div>
);
