import { useEffect, useRef } from "react";
import { Button, MiniBagPopover, cart, icons, sampleData } from "@bluesigns/ui";

const { ShoppingBag } = icons;
const { getProduct } = sampleData;

// MiniBagPopover reads the shared cart store: seed it with a realistic bag.
const line = (slug: string, extra: { size?: string; color?: string; quantity?: number } = {}) => {
  const p = getProduct(slug)!;
  return { productId: p.id, slug: p.slug, name: p.name, image: p.images[0]!, price: p.price, compareAt: p.compareAt, ...extra };
};
cart.clear();
cart.add(line("aura-wireless-headphones", { color: "Graphite" }), { open: false });
cart.add(line("fleece-hoodie", { size: "M" }), { open: false });
cart.add(line("thermal-bottle", { size: "750ml", quantity: 2 }), { open: false });

// The popover owns its open state; open it by clicking its trigger once mounted.
function AutoOpen({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const trigger = ref.current?.querySelector("button");
    if (!trigger || trigger.dataset.autoOpened) return;
    trigger.dataset.autoOpened = "1";
    trigger.click();
    setTimeout(() => (document.activeElement as HTMLElement | null)?.blur(), 80);
  }, []);
  return (
    <div ref={ref} className="flex justify-end p-4" style={{ maxWidth: 520 }}>
      {children}
    </div>
  );
}

export const OpenWithItems = () => (
  <AutoOpen>
    <MiniBagPopover bagHref="/bag" checkoutHref="/checkout" />
  </AutoOpen>
);

export const CustomTriggerMaxTwo = () => (
  <AutoOpen>
    <MiniBagPopover
      max={2}
      trigger={
        <Button variant="secondary" leadingIcon={<ShoppingBag aria-hidden />}>
          Bag (4)
        </Button>
      }
    />
  </AutoOpen>
);
