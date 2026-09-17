import { useState } from "react";
import { CompareTable, sampleData } from "@bluesigns/ui";

const { getProduct } = sampleData;

function Removable() {
  const [list, setList] = useState(["velocity-runner-red", "court-low-sneaker", "trail-hiker-sneaker", "everyday-sneaker-pack"].map((s) => getProduct(s)!));
  return <CompareTable products={list} onRemove={(slug) => setList((l) => l.filter((p) => p.slug !== slug))} />;
}

export const FourSneakersRemovable = () => (
  <div style={{ maxWidth: 860 }}>
    <Removable />
  </div>
);

export const TwoHeadphones = () => (
  <div style={{ maxWidth: 640 }}>
    <CompareTable products={["aura-wireless-headphones", "studio-over-ear-headphones"].map((s) => getProduct(s)!)} />
  </div>
);

export const TwoWatches = () => (
  <div style={{ maxWidth: 640 }}>
    <CompareTable products={["meridian-classic-watch", "pulse-smart-watch"].map((s) => getProduct(s)!)} />
  </div>
);
