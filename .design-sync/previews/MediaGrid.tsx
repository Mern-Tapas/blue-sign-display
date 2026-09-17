import { useState } from "react";
import { MediaGrid, sampleData } from "@bluesigns/ui";

const { products } = sampleData;

type Item = { id: string; label: string; preview: React.ReactNode };

const productItems: Item[] = [products[0]!, products[2]!, products[1]!, products[3]!].map((p, i) => ({
  id: `m${i + 1}`,
  label: `Image ${i + 1}`,
  preview: <img src={p.images[0]} alt={p.name} className="size-full object-cover" />,
}));

function Arrangeable({ initial, withCover = true, primaryLabel }: { initial: Item[]; withCover?: boolean; primaryLabel?: string }) {
  const [items, setItems] = useState(initial);
  const [cover, setCover] = useState(initial[0]?.id ?? "");
  return (
    <div style={{ width: 640 }}>
      <MediaGrid
        items={items}
        onItemsChange={setItems}
        primaryId={withCover ? cover : undefined}
        onPrimaryChange={withCover ? setCover : undefined}
        primaryLabel={primaryLabel}
        onRemove={(id) => setItems((all) => all.filter((i) => i.id !== id))}
      />
    </div>
  );
}

export const ProductPhotos = () => <Arrangeable initial={productItems} />;

const SWATCHES = ["#037ec2", "#1baf7a", "#eb6834", "#aa7fe4"];

export const ColourSwatches = () => (
  <Arrangeable
    primaryLabel="Hero"
    initial={SWATCHES.map((color, i) => ({
      id: `s${i + 1}`,
      label: `Swatch ${i + 1}`,
      preview: <span className="block size-full" style={{ background: color }} />,
    }))}
  />
);

export const OrderOnly = () => <Arrangeable initial={productItems.slice(0, 3)} withCover={false} />;
