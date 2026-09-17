import { sampleData, toast, WishlistItemCard } from "@bluesigns/ui";

const { getProduct } = sampleData;
const hoodie = getProduct("fleece-hoodie")!;
const watch = getProduct("pulse-smart-watch")!;
const bottle = getProduct("thermal-bottle")!;
const jacket = getProduct("field-jacket")!;
const noop = () => toast({ title: "Removed from wishlist" });

export const States = () => (
  <div className="grid grid-cols-4 gap-4" style={{ maxWidth: 860 }}>
    <WishlistItemCard product={hoodie} savedPrice={hoodie.price + 500} onRemove={noop} />
    <WishlistItemCard product={watch} onRemove={noop} />
    <WishlistItemCard product={{ ...jacket, stock: 0 }} onRemove={noop} />
    <WishlistItemCard product={{ ...bottle, stock: 3 }} savedPrice={bottle.price} onRemove={noop} />
  </div>
);

export const PriceDrop = () => (
  <div style={{ width: 220 }}>
    <WishlistItemCard product={hoodie} savedPrice={hoodie.price + 500} onRemove={noop} />
  </div>
);

export const OutOfStock = () => (
  <div style={{ width: 220 }}>
    <WishlistItemCard product={{ ...jacket, stock: 0 }} onRemove={noop} onNotify={() => toast({ title: "We’ll tell you when it’s back", tone: "success" })} />
  </div>
);

export const LowStock = () => (
  <div style={{ width: 220 }}>
    <WishlistItemCard product={{ ...bottle, stock: 3 }} onRemove={noop} />
  </div>
);
