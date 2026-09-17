import { useState } from "react";
import { PriceRange, sampleData } from "@bluesigns/ui";

const { priceBounds } = sampleData;

function Range({ initial, step }: { initial: [number, number] | null; step?: number }) {
  const [value, setValue] = useState<[number, number] | null>(initial);
  return (
    <div style={{ maxWidth: 320 }}>
      <PriceRange min={priceBounds.min} max={priceBounds.max} step={step} value={value} onValueCommit={setValue} />
    </div>
  );
}

export const Narrowed = () => <Range initial={[999, 4999]} />;

export const FullRange = () => <Range initial={null} />;

export const CustomBounds = () => {
  const [value, setValue] = useState<[number, number] | null>([1500, 6000]);
  return (
    <div style={{ maxWidth: 320 }}>
      <PriceRange min={500} max={10000} step={250} value={value} onValueCommit={setValue} />
    </div>
  );
};
