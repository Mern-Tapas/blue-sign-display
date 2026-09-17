import { SpecificationsTable, sampleData } from "@bluesigns/ui";

const headphones = sampleData.getProduct("aura-wireless-headphones")!;

const groups = [
  { title: "General", rows: [["Brand", headphones.brand], ["Model name", headphones.name], ["Colours", headphones.colors?.map((c) => c.name).join(", ") ?? "—"]] as [string, string][] },
  { title: "Audio", rows: [["Driver size", "40 mm"], ["Frequency response", "20 Hz – 20 kHz"], ["Noise cancellation", "Adaptive, 3 modes"]] as [string, string][] },
  { title: "Battery", rows: [["Playback", "Up to 40 hours"], ["Quick charge", "10 min = 5 hours"], ["Port", "USB-C"]] as [string, string][] },
  { title: "In the box", rows: [["Contents", "Headphones, carry case, USB-C cable, 3.5 mm cable"], ["Warranty", "1 year manufacturer warranty"]] as [string, string][] },
];

export const Collapsed = () => (
  <div style={{ maxWidth: 640 }}>
    <SpecificationsTable groups={groups} />
  </div>
);

export const AllGroups = () => (
  <div style={{ maxWidth: 640 }}>
    <SpecificationsTable groups={groups.slice(0, 3)} initialGroups={3} />
  </div>
);

export const Apparel = () => (
  <div style={{ maxWidth: 640 }}>
    <SpecificationsTable
      title="Product details"
      groups={[
        { title: "Fabric & care", rows: [["Material", "80% cotton, 20% polyester fleece"], ["Weight", "400 GSM"], ["Care", "Machine wash cold, dry flat"]] },
        { title: "Fit", rows: [["Fit", "Relaxed"], ["Model wears", "Size M · 5′11″"]] },
      ]}
    />
  </div>
);
