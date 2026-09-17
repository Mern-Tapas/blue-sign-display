"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { FreeDeliveryProgress } from "@/components/cart/free-delivery-progress";
import { PriceDetails } from "@/components/cart/price-details";
import { useBag } from "@/components/providers/bag-store";
import { cart, useCart } from "@/components/providers/cart-store";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { CountBadge } from "@/components/ui/count-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader } from "@/components/ui/sheet";
import { coupons } from "@/lib/data/india";
import { computeBagTotals } from "@/lib/pricing";
import { CartLineItem } from "./cart-line-item";

export { FREE_DELIVERY_THRESHOLD as FREE_SHIPPING_THRESHOLD } from "@/lib/data/india";

export type CartDrawerProps = {
  checkoutHref?: string;
  shopHref?: string;
  /** Full bag page with coupons, gift wrap and save for later. */
  bagHref?: string;
};

/** Quick bag after "Add to bag": items, free-delivery progress, the same price breakdown as checkout, and the next step. */
export function CartDrawer({ checkoutHref = "/checkout", shopHref = "/shop", bagHref = "/bag" }: CartDrawerProps) {
  const { items, open, count, subtotal } = useCart();
  const { couponCode } = useBag();
  const totals = computeBagTotals(items, { coupon: coupons.find((c) => c.code === couponCode) });

  return (
    <Sheet open={open} onOpenChange={cart.setOpen}>
      <SheetContent side="right">
        <SheetHeader
          title={
            <span className="flex items-center gap-2">
              Your bag
              {count > 0 && <CountBadge count={count} tone="accent" />}
            </span>
          }
          description={count > 0 ? undefined : "Nothing here yet"}
        />

        {items.length === 0 ? (
          <SheetBody className="flex items-center justify-center">
            <EmptyState
              icon={<ShoppingBag aria-hidden />}
              title="Your bag is empty"
              description="Browse best sellers and new arrivals — free delivery above ₹499."
              action={
                <Button asChild onClick={() => cart.setOpen(false)}>
                  <Link href={shopHref}>Start shopping</Link>
                </Button>
              }
            />
          </SheetBody>
        ) : (
          <>
            <FreeDeliveryProgress subtotal={subtotal} className="mx-6 mb-4" />

            <SheetBody>
              <ul className="flex flex-col divide-y divide-border-subtle">
                {items.map((item) => (
                  <li key={item.key} className="py-4 first:pt-0">
                    <CartLineItem
                      item={item}
                      onQuantityChange={(q) => cart.setQuantity(item.key, q)}
                      onRemove={() => {
                        cart.remove(item.key);
                        toast({
                          title: "Removed from bag",
                          description: item.name,
                          action: { label: "Undo", onClick: () => cart.add(item, { open: false }) },
                        });
                      }}
                    />
                  </li>
                ))}
              </ul>
            </SheetBody>

            <SheetFooter>
              <PriceDetails totals={totals} variant="plain" compact />
              <Button asChild size="lg" fullWidth trailingIcon={<ArrowRight aria-hidden />}>
                <Link href={checkoutHref} onClick={() => cart.setOpen(false)}>
                  Place order
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" fullWidth>
                <Link href={bagHref} onClick={() => cart.setOpen(false)}>
                  View bag, coupons &amp; gift wrap
                </Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
