import { deliveryLocation, ProductPurchasePanel, sampleData } from "@bluesigns/ui";

const { getProduct } = sampleData;

// The delivery check reads the shopper's stored PIN (shared with the header chip).
deliveryLocation.set({ pincode: "560066", city: "Bengaluru", state: "Karnataka" });

export const Apparel = () => (
  <div style={{ maxWidth: 520 }}>
    <ProductPurchasePanel product={getProduct("fleece-hoodie")!} />
  </div>
);

export const ColourOnly = () => (
  <div style={{ maxWidth: 520 }}>
    <ProductPurchasePanel product={getProduct("aura-wireless-headphones")!} />
  </div>
);

export const LowStock = () => (
  <div style={{ maxWidth: 520 }}>
    <ProductPurchasePanel product={getProduct("pulse-smart-watch")!} />
  </div>
);

export const SoldOut = () => (
  <div style={{ maxWidth: 520 }}>
    <ProductPurchasePanel product={getProduct("trail-hiker-sneaker")!} />
  </div>
);
