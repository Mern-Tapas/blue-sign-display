import { useEffect } from "react";
import { sampleData, wishlist, WishlistGrid } from "@bluesigns/ui";

const { getProduct, products } = sampleData;

// WishlistGrid reads the device wishlist store; pages add items with wishlist.add(slug, savedPrice).
const saved = ["fleece-hoodie", "aura-wireless-headphones", "court-low-sneaker", "trail-hiker-sneaker", "pulse-smart-watch", "no-5-eau-de-parfum"];

export const Saved = () => {
  useEffect(() => {
    wishlist.clear();
    [...saved].reverse().forEach((slug, i) => {
      const p = getProduct(slug)!;
      // A couple were saved at a higher price, so the cards show a price drop.
      wishlist.add(slug, i % 2 === 0 ? p.price + 400 * (i + 1) : p.price);
    });
  }, []);
  return <WishlistGrid products={products} title="Wishlist" shareUrl="https://bluesigns.shop/wishlist/sujon" />;
};

export const Empty = () => {
  useEffect(() => wishlist.clear(), []);
  return <WishlistGrid products={products} />;
};
