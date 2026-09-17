import { useState } from "react";
import { CartLineItem, sampleData } from "@bluesigns/ui";

const { getProduct } = sampleData;
const hoodie = getProduct("fleece-hoodie")!;
const headphones = getProduct("aura-wireless-headphones")!;
const bottle = getProduct("thermal-bottle")!;

const toItem = (p: typeof hoodie, extra: { color?: string; size?: string; quantity?: number }) => ({
  key: [p.id, extra.color, extra.size].filter(Boolean).join(":"),
  productId: p.id,
  slug: p.slug,
  name: p.name,
  image: p.images[0]!,
  price: p.price,
  compareAt: p.compareAt,
  quantity: extra.quantity ?? 1,
  color: extra.color,
  size: extra.size,
});

function EditableLine({ item }: { item: ReturnType<typeof toItem> }) {
  const [quantity, setQuantity] = useState(item.quantity);
  return <CartLineItem item={{ ...item, quantity }} onQuantityChange={setQuantity} onRemove={() => setQuantity(1)} />;
}

export const Editable = () => (
  <ul className="flex flex-col divide-y divide-border-subtle" style={{ maxWidth: 400 }}>
    <li className="pb-4">
      <EditableLine item={toItem(hoodie, { color: "Graphite", size: "M", quantity: 2 })} />
    </li>
    <li className="pt-4">
      <EditableLine item={toItem(headphones, { color: "Violet" })} />
    </li>
  </ul>
);

export const ReadOnlySummary = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 400 }}>
    <CartLineItem readOnly item={toItem(headphones, { color: "Sand" })} />
    <CartLineItem readOnly item={toItem(bottle, { color: "Cloud", size: "750ml", quantity: 3 })} />
  </div>
);

export const QuantityAtMinimum = () => (
  <div style={{ maxWidth: 400 }}>
    <CartLineItem item={toItem(bottle, { size: "500ml" })} onQuantityChange={() => {}} onRemove={() => {}} />
  </div>
);
