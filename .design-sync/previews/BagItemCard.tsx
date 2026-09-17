import { useState } from "react";
import { BagItemCard, sampleData, toast } from "@bluesigns/ui";

const { getProduct } = sampleData;

const hoodie = getProduct("fleece-hoodie")!;
const bottle = getProduct("thermal-bottle")!;
const sneaker = getProduct("court-low-sneaker")!;

export const Default = () => {
  const [item, setItem] = useState({
    key: `${hoodie.id}:Graphite:M`,
    productId: hoodie.id,
    slug: hoodie.slug,
    name: hoodie.name,
    image: hoodie.images[0]!,
    price: hoodie.price,
    compareAt: hoodie.compareAt,
    quantity: 1,
    color: "Graphite",
    size: "M",
  });
  return (
    <div style={{ maxWidth: 560 }}>
      <BagItemCard
        item={item}
        brand={hoodie.brand}
        sizes={hoodie.sizes}
        stock={hoodie.stock}
        deliveryText="Delivery by Thu, 18 Sept"
        onSizeChange={(size) => setItem((i) => ({ ...i, size }))}
        onQuantityChange={(quantity) => setItem((i) => ({ ...i, quantity }))}
        onRemove={() => toast({ title: "Removed from bag", description: item.name })}
        onMoveToWishlist={() => toast({ title: "Moved to wishlist", description: item.name, tone: "accent" })}
        onSaveForLater={() => toast({ title: "Saved for later", description: item.name })}
      />
    </div>
  );
};

export const LowStockMultipleUnits = () => (
  <div style={{ maxWidth: 560 }}>
    <BagItemCard
      item={{
        key: `${bottle.id}:750ml`,
        productId: bottle.id,
        slug: bottle.slug,
        name: bottle.name,
        image: bottle.images[0]!,
        price: bottle.price,
        compareAt: bottle.compareAt,
        quantity: 2,
        size: "750ml",
      }}
      brand={bottle.brand}
      sizes={bottle.sizes}
      stock={3}
      deliveryText="Delivery by Wed, 17 Sept"
      onQuantityChange={() => {}}
      onSizeChange={() => {}}
      onRemove={() => {}}
      onSaveForLater={() => {}}
    />
  </div>
);

export const WithoutActions = () => (
  <div style={{ maxWidth: 560 }}>
    <BagItemCard
      item={{
        key: `${sneaker.id}:42`,
        productId: sneaker.id,
        slug: sneaker.slug,
        name: sneaker.name,
        image: sneaker.images[0]!,
        price: sneaker.price,
        compareAt: sneaker.compareAt,
        quantity: 1,
        size: "42",
      }}
      brand={sneaker.brand}
      sizes={sneaker.sizes}
      deliveryText="Delivery by Fri, 19 Sept"
      onQuantityChange={() => {}}
    />
  </div>
);
