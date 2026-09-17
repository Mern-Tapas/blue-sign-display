import { CustomerTagsCard } from "@bluesigns/ui";

export const WithTags = () => (
  <div style={{ width: 380 }}>
    <CustomerTagsCard initialTags={["VIP", "Prefers COD", "Uses coupons", "Gifting"]} />
  </div>
);

export const NoTags = () => (
  <div style={{ width: 380 }}>
    <CustomerTagsCard initialTags={[]} />
  </div>
);
