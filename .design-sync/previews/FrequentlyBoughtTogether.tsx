import { FrequentlyBoughtTogether, sampleData } from "@bluesigns/ui";

const { getProduct } = sampleData;

export const Bundle = () => (
  <div style={{ maxWidth: 640 }}>
    <FrequentlyBoughtTogether
      product={getProduct("aura-wireless-headphones")!}
      addOns={[getProduct("thermal-bottle")!, getProduct("nomad-backpack")!]}
    />
  </div>
);

export const WithSoldOutAddOn = () => (
  <div style={{ maxWidth: 640 }}>
    <FrequentlyBoughtTogether
      title="Complete the look"
      product={getProduct("heavyweight-tee")!}
      addOns={[getProduct("field-jacket")!, getProduct("trail-hiker-sneaker")!]}
    />
  </div>
);

export const SingleAddOn = () => (
  <div style={{ maxWidth: 640 }}>
    <FrequentlyBoughtTogether product={getProduct("daily-glow-serum")!} addOns={[getProduct("no-5-eau-de-parfum")!]} />
  </div>
);
