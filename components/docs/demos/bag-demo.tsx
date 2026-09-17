"use client";

import { useState } from "react";
import { DsGrid, DsPreview } from "@/components/docs/ds-section";
import { BagItemCard } from "@/components/cart/bag-item-card";
import { CouponSheet } from "@/components/cart/coupon-sheet";
import { FreeDeliveryProgress } from "@/components/cart/free-delivery-progress";
import { GiftWrapOption, type GiftWrap } from "@/components/cart/gift-wrap-option";
import { MiniBagPopover } from "@/components/cart/mini-bag-popover";
import { PriceDetails } from "@/components/cart/price-details";
import { SaveForLaterList } from "@/components/cart/save-for-later-list";
import { UnavailableItemNotice } from "@/components/cart/unavailable-item-notice";
import { cart, type CartItem } from "@/components/providers/cart-store";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { coupons } from "@/lib/data/india";
import { getProduct } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import { computeBagTotals } from "@/lib/pricing";

const toItem = (slug: string, size?: string, quantity = 1): CartItem => {
  const p = getProduct(slug)!;
  return { key: `${p.id}:${size ?? ""}`, productId: p.id, slug, name: p.name, image: p.images[0]!, price: p.price, compareAt: p.compareAt, quantity, size };
};

export function BagItemsDemo() {
  const [items, setItems] = useState([toItem("fleece-hoodie", "M", 1), toItem("thermal-bottle", undefined, 2)]);
  const [saved, setSaved] = useState([toItem("court-low-sneaker", "42")]);
  const hoodie = getProduct("fleece-hoodie")!;
  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => {
        const p = getProduct(item.slug)!;
        return (
          <BagItemCard
            key={item.key}
            item={item}
            brand={p.brand}
            sizes={p.sizes}
            stock={item.slug === "thermal-bottle" ? 3 : p.stock}
            deliveryText="Delivery by Thu, 18 Sept"
            onSizeChange={(s) => setItems((all) => all.map((i) => (i.key === item.key ? { ...i, size: s } : i)))}
            onQuantityChange={(q) => setItems((all) => all.map((i) => (i.key === item.key ? { ...i, quantity: q } : i)))}
            onRemove={() => toast({ title: "Removed (demo)", description: item.name })}
            onMoveToWishlist={() => toast({ title: "Moved to wishlist (demo)", description: item.name, tone: "accent" })}
            onSaveForLater={() => {
              setSaved((s) => [item, ...s]);
              setItems((all) => all.filter((i) => i.key !== item.key));
            }}
          />
        );
      })}
      {items.length === 0 && (
        <Button variant="secondary" className="self-start" onClick={() => setItems([toItem("fleece-hoodie", hoodie.sizes?.[2]), toItem("thermal-bottle")])}>
          Reset items
        </Button>
      )}
      <SaveForLaterList
        items={saved}
        onMoveToBag={(i) => {
          setItems((all) => [...all, i]);
          setSaved((s) => s.filter((x) => x.key !== i.key));
        }}
        onRemove={(i) => setSaved((s) => s.filter((x) => x.key !== i.key))}
      />
    </div>
  );
}

export function PricingDemo() {
  const [subtotalBase, setSubtotal] = useState([2499]);
  const [code, setCode] = useState<string | null>("BLUESIGNS20");
  const [gift, setGift] = useState<GiftWrap>({ enabled: true, message: "", to: "", from: "" });
  const subtotal = subtotalBase[0]!;
  const lines = [{ price: subtotal, compareAt: Math.round(subtotal * 1.35), quantity: 1 }];
  const coupon = coupons.find((c) => c.code === code) ?? null;
  const totals = computeBagTotals(lines, { coupon, giftWrap: gift.enabled });

  return (
    <DsGrid>
      <div className="flex flex-col gap-4">
        <DsPreview label="Bag value" className="flex-col items-stretch">
          <div className="flex justify-between text-label">
            <span>Selling price subtotal</span>
            <span className="figures">{formatPrice(subtotal)}</span>
          </div>
          <Slider value={subtotalBase} onValueChange={setSubtotal} min={199} max={9999} step={50} thumbLabels={["Bag subtotal"]} />
          <FreeDeliveryProgress subtotal={subtotal} />
          <FreeDeliveryProgress subtotal={subtotal} variant="inline" />
        </DsPreview>
        <CouponSheet coupons={coupons} subtotal={subtotal} today="2026-09-15" appliedCode={code} onApply={setCode} />
        <GiftWrapOption value={gift} onChange={(p) => setGift((g) => ({ ...g, ...p }))} />
      </div>
      <PriceDetails totals={totals} id="demo-price-details" />
    </DsGrid>
  );
}

export function NoticesDemo() {
  const perfume = getProduct("no-5-eau-de-parfum")!;
  const jacket = getProduct("field-jacket")!;
  return (
    <DsGrid>
      <UnavailableItemNotice
        pincode="744101"
        items={[
          { key: "a", name: jacket.name, image: jacket.images[0]!, reason: "out-of-stock" },
          { key: "b", name: perfume.name, image: perfume.images[0]!, reason: "not-deliverable", detail: "fragrances can’t ship by air" },
        ]}
        onRemoveAll={() => toast({ title: "Removed unavailable items (demo)" })}
        onMoveToWishlist={() => toast({ title: "Moved to wishlist (demo)", tone: "accent" })}
      />
      <DsPreview label="MiniBagPopover (live bag)" className="flex-col items-start" overflowVisible>
        <MiniBagPopover />
        <Button variant="ghost" size="sm" onClick={() => cart.add({ productId: "p1", slug: "aura-wireless-headphones", name: "Aura Wireless Headphones", image: getProduct("aura-wireless-headphones")!.images[0]!, price: 12999, compareAt: 16999 }, { open: false })}>
          Add a sample item
        </Button>
      </DsPreview>
    </DsGrid>
  );
}
