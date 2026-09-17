import { useEffect, useRef } from "react";
import { CheckoutFlow, bag, cart, sampleData } from "@bluesigns/ui";

const { getProduct } = sampleData;

// CheckoutFlow reads the shared cart + bag stores: seed a realistic bag once.
const line = (slug: string, extra: { size?: string; color?: string; quantity?: number } = {}) => {
  const p = getProduct(slug)!;
  return { productId: p.id, slug: p.slug, name: p.name, image: p.images[0]!, price: p.price, compareAt: p.compareAt, ...extra };
};
cart.clear();
cart.add(line("aura-wireless-headphones", { color: "Graphite" }), { open: false });
cart.add(line("fleece-hoodie", { size: "M", color: "Black" }), { open: false });
bag.applyCoupon("BLUESIGNS20");
bag.setGiftWrap({ enabled: false, message: "", to: "", from: "" });

export const AddressStep = () => (
  <div className="p-4">
    <CheckoutFlow />
  </div>
);

// Advances to the payment step by pressing the flow's own Continue button once.
export const PaymentStep = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || root.dataset.advanced) return;
    root.dataset.advanced = "1";
    const t = setTimeout(() => {
      const next = [...root.querySelectorAll("button")].find((b) => /^Continue/.test(b.textContent?.trim() ?? "") && b.offsetParent !== null);
      next?.click();
      setTimeout(() => window.scrollTo(0, 0), 50);
    }, 50);
    return () => clearTimeout(t);
  }, []);
  return (
    <div ref={ref} className="p-4">
      <CheckoutFlow />
    </div>
  );
};
