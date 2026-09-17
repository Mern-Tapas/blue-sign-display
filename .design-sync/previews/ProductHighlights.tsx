import { icons, ProductHighlights, sampleData } from "@bluesigns/ui";

const { Battery, Bluetooth, Waves, Weight } = icons;
const headphones = sampleData.getProduct("aura-wireless-headphones")!;

export const List = () => (
  <div style={{ maxWidth: 640 }}>
    <ProductHighlights items={headphones.features} />
  </div>
);

export const Tiles = () => (
  <div style={{ maxWidth: 640 }}>
    <ProductHighlights
      variant="tiles"
      title="Key specs"
      items={[
        { icon: <Battery />, title: "40 h battery", description: "ANC off" },
        { icon: <Waves />, title: "Adaptive ANC" },
        { icon: <Bluetooth />, title: "Bluetooth 5.3", description: "Multipoint" },
        { icon: <Weight />, title: "250 g" },
      ]}
    />
  </div>
);

export const WithDescriptions = () => (
  <div style={{ maxWidth: 640 }}>
    <ProductHighlights
      title="Why it’s worth it"
      items={[
        { title: "400 GSM brushed fleece", description: "Warm without bulk for Bengaluru winters" },
        { title: "Relaxed fit", description: "Size down for a closer fit" },
        { title: "Machine washable", description: "Cold wash, dry flat" },
        { title: "Made in Tiruppur", description: "Organic cotton blend" },
      ]}
    />
  </div>
);
