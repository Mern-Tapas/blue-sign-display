"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useDeliveryLocation } from "@/components/providers/location-store";
import { bag, useBag } from "@/components/providers/bag-store";
import { cart, useCart, type CartItem } from "@/components/providers/cart-store";
import { toast } from "@/components/providers/toast-store";
import { wishlist } from "@/components/providers/wishlist-store";
import { DeliverToPincode } from "@/components/search/deliver-to-pincode";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ValuePropsStrip } from "@/components/merch/value-props-strip";
import { coupons, lookupPincode } from "@/lib/data/india";
import { LOCALE, TIME_ZONE } from "@/lib/format";
import type { Product } from "@/lib/data/types";
import { computeBagTotals } from "@/lib/pricing";
import { useHydrated } from "@/lib/use-hydrated";
import { BagItemCard } from "./bag-item-card";
import { CouponSheet } from "./coupon-sheet";
import { FreeDeliveryProgress } from "./free-delivery-progress";
import { GiftWrapOption } from "./gift-wrap-option";
import { PriceDetails } from "./price-details";
import { SaveForLaterList } from "./save-for-later-list";
import { StickyCheckoutBar } from "./sticky-checkout-bar";
import { UnavailableItemNotice } from "./unavailable-item-notice";

export type BagViewProps = {
  /** Catalogue for stock, sizes, brand and delivery days. */
  products: Product[];
  checkoutHref?: string;
};

const deliveryDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return new Intl.DateTimeFormat(LOCALE, { weekday: "short", day: "numeric", month: "short", timeZone: TIME_ZONE }).format(d);
};

/** The bag page: delivery PIN, availability notice, items, saved for later, coupon, gift wrap, price details and a sticky phone bar. */
export function BagView({ products, checkoutHref = "/checkout" }: BagViewProps) {
  const hydrated = useHydrated();
  const { items, subtotal } = useCart();
  const { savedForLater, couponCode, giftWrap } = useBag();
  const location = useDeliveryLocation();
  const pin = location ? lookupPincode(location.pincode) : undefined;
  const today = hydrated ? new Date().toISOString().slice(0, 10) : "";

  const coupon = coupons.find((c) => c.code === couponCode) ?? null;
  const totals = computeBagTotals(items, { coupon, giftWrap: giftWrap.enabled });
  const productOf = (item: CartItem) => products.find((p) => p.id === item.productId);

  const unavailable = items
    .map((i) => ({ i, p: productOf(i) }))
    .filter(({ p }) => (p && p.stock <= 0) || (pin && !pin.serviceable))
    .map(({ i, p }) => ({ key: i.key, name: i.name, image: i.image, reason: p && p.stock <= 0 ? ("out-of-stock" as const) : ("not-deliverable" as const) }));

  const moveToWishlist = (item: CartItem) => {
    wishlist.add(item.slug, item.price);
    cart.remove(item.key);
    toast({ title: "Moved to wishlist", description: item.name, tone: "accent" });
  };

  if (!hydrated) {
    return (
      <div aria-hidden className="grid gap-5 lg:grid-cols-[1fr_24rem]">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <Card variant="outline" padding="none">
          <EmptyState
            icon={<ShoppingBag aria-hidden />}
            title="Your bag is empty"
            description="Items you add appear here, with delivery dates and the full price breakdown."
            action={
              <>
                <Button asChild>
                  <Link href="/shop">Start shopping</Link>
                </Button>
                <Button asChild variant="secondary" leadingIcon={<Heart aria-hidden />}>
                  <Link href="/account/wishlist">Add from wishlist</Link>
                </Button>
              </>
            }
          />
        </Card>
        <SaveForLaterList
          items={savedForLater}
          onMoveToBag={(i) => {
            cart.add(i, { open: false });
            bag.removeSaved(i.key);
          }}
          onRemove={(i) => bag.removeSaved(i.key)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-5 pb-24 lg:grid-cols-[minmax(0,1fr)_24rem] lg:pb-0">
        <div className="flex min-w-0 flex-col gap-4">
          <Card variant="outline" padding="none" className="gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
            <DeliverToPincode lookup={lookupPincode} appearance="chip" className="max-w-none" />
            <FreeDeliveryProgress subtotal={subtotal} variant="inline" className="px-3 sm:px-0" />
          </Card>
          <UnavailableItemNotice
            items={unavailable}
            pincode={location?.pincode}
            onRemoveAll={() => unavailable.forEach((u) => cart.remove(u.key))}
            onMoveToWishlist={() => items.filter((i) => unavailable.some((u) => u.key === i.key)).forEach(moveToWishlist)}
          />
          <ul className="flex flex-col gap-3" aria-label="Items in your bag">
            {items.map((item) => {
              const p = productOf(item);
              const days = (pin?.etaDays ?? 3) + Math.max(0, (p?.deliveryDays ?? 3) - 2);
              return (
                <li key={item.key}>
                  <BagItemCard
                    item={item}
                    brand={p?.brand}
                    sizes={p?.sizes}
                    stock={p?.stock}
                    deliveryText={pin && !pin.serviceable ? undefined : `Delivery by ${deliveryDate(days)}`}
                    onSizeChange={(s) => cart.setSize(item.key, s)}
                    onQuantityChange={(q) => cart.setQuantity(item.key, q)}
                    onRemove={() => {
                      cart.remove(item.key);
                      toast({ title: "Removed from bag", description: item.name, action: { label: "Undo", onClick: () => cart.add(item, { open: false }) } });
                    }}
                    onMoveToWishlist={() => moveToWishlist(item)}
                    onSaveForLater={() => {
                      bag.saveForLater(item);
                      cart.remove(item.key);
                      toast({ title: "Saved for later", description: item.name });
                    }}
                  />
                </li>
              );
            })}
          </ul>
          <SaveForLaterList
            items={savedForLater}
            onMoveToBag={(i) => {
              cart.add(i, { open: false });
              bag.removeSaved(i.key);
            }}
            onRemove={(i) => bag.removeSaved(i.key)}
          />
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start" aria-label="Order summary">
          <CouponSheet coupons={coupons} subtotal={subtotal} today={today} appliedCode={coupon ? coupon.code : null} onApply={bag.applyCoupon} />
          <GiftWrapOption value={giftWrap} onChange={bag.setGiftWrap} />
          <PriceDetails id="bag-price-details" totals={totals} />
          {unavailable.length > 0 ? (
            <Button size="xl" fullWidth className="max-lg:hidden" disabled>
              Remove unavailable items to continue
            </Button>
          ) : (
            <Button asChild size="xl" fullWidth className="max-lg:hidden">
              <Link href={checkoutHref}>Place order</Link>
            </Button>
          )}
          <ValuePropsStrip variant="inline" className="justify-center" />
        </aside>
      </div>

      <StickyCheckoutBar
        total={totals.total}
        detailsId="bag-price-details"
        disabled={unavailable.length > 0}
        action={
          unavailable.length > 0 ? undefined : (
            <Button asChild size="lg" className="min-w-40">
              <Link href={checkoutHref}>Place order</Link>
            </Button>
          )
        }
      />
    </>
  );
}
