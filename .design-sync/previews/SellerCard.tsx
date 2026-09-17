import { SellerCard, sampleData } from "@bluesigns/ui";

const { sellers } = sampleData;

export const Assured = () => (
  <div style={{ maxWidth: 440 }}>
    <SellerCard seller={sellers.default!} otherSellersHref="/shop" otherSellersCount={2} demo />
  </div>
);

export const Marketplace = () => (
  <div style={{ maxWidth: 440 }}>
    <SellerCard seller={{ name: "Tiruppur Knits", rating: 3.8, since: "2024", returnDays: 7 }} otherSellersHref="/shop" otherSellersCount={1} />
  </div>
);

export const LowRatedSeller = () => (
  <div style={{ maxWidth: 440 }}>
    <SellerCard seller={{ name: "Gadget Hub Mumbai", rating: 2.7, since: "2025", returnDays: 10 }} />
  </div>
);
