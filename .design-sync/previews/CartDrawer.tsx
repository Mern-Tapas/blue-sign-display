import { useEffect } from "react";
import { bag, Button, cart, icons, sampleData } from "@bluesigns/ui";

const { ShoppingBag } = icons;
const { getProduct } = sampleData;

// <CartDrawer /> is mounted once by <Providers> (next to the Toaster). Pages fill the cart
// store and open it: cart.add(item, { open: true }) or cart.setOpen(true).
const lines = [
  { product: getProduct("aura-wireless-headphones")!, color: "Violet" },
  { product: getProduct("fleece-hoodie")!, color: "Graphite", size: "M" },
  { product: getProduct("thermal-bottle")!, color: "Cloud", size: "750ml", quantity: 2 },
];

const ViewBag = () => (
  <Button variant="secondary" leadingIcon={<ShoppingBag aria-hidden />} onClick={() => cart.setOpen(true)}>
    View bag
  </Button>
);

export const WithItems = () => {
  useEffect(() => {
    cart.clear();
    bag.applyCoupon("BLUESIGNS20");
    for (const { product: p, color, size, quantity } of lines) {
      cart.add(
        { productId: p.id, slug: p.slug, name: p.name, image: p.images[0]!, price: p.price, compareAt: p.compareAt, color, size, quantity },
        { open: false },
      );
    }
    cart.setOpen(true);
  }, []);
  return <ViewBag />;
};

export const SingleItem = () => {
  useEffect(() => {
    cart.clear();
    bag.applyCoupon(null);
    const p = getProduct("daily-glow-serum")!;
    cart.add({ productId: p.id, slug: p.slug, name: p.name, image: p.images[0]!, price: p.price, compareAt: p.compareAt }, { open: true });
  }, []);
  return <ViewBag />;
};

export const Empty = () => {
  useEffect(() => {
    cart.clear();
    bag.applyCoupon(null);
    cart.setOpen(true);
  }, []);
  return <ViewBag />;
};
