import { BagView, bag, cart, sampleData } from "@bluesigns/ui";

const { products, getProduct } = sampleData;

// BagView reads the shared cart + bag stores, so seed them once with a realistic bag.
const line = (slug: string, extra: { size?: string; color?: string; quantity?: number } = {}) => {
  const p = getProduct(slug)!;
  return { productId: p.id, slug: p.slug, name: p.name, image: p.images[0]!, price: p.price, compareAt: p.compareAt, ...extra };
};
cart.clear();
cart.add(line("aura-wireless-headphones", { color: "Graphite" }), { open: false });
cart.add(line("fleece-hoodie", { size: "M", color: "Black" }), { open: false });
cart.add(line("thermal-bottle", { size: "750ml", quantity: 2 }), { open: false });
bag.applyCoupon("BLUESIGNS20");
bag.setGiftWrap({ enabled: false, message: "", to: "", from: "" });
bag.saveForLater({ ...line("court-low-sneaker", { size: "42" }), key: "p6:42", quantity: 1 });

export const BagPage = () => (
  <div className="p-4">
    <BagView products={products} checkoutHref="/checkout" />
  </div>
);

export const NarrowColumn = () => (
  <div className="p-4" style={{ maxWidth: 480 }}>
    <BagView products={products} />
  </div>
);
