import { useState } from "react";
import { Button, CouponSheet, OrderSummary, PromoCodeInput, computeBagTotals, sampleData } from "@bluesigns/ui";

const { getProduct, coupons } = sampleData;

const item = (slug: string, extra: { size?: string; color?: string; quantity?: number } = {}) => {
  const p = getProduct(slug)!;
  return { key: [p.id, extra.color, extra.size].filter(Boolean).join(":"), productId: p.id, slug: p.slug, name: p.name, image: p.images[0]!, price: p.price, compareAt: p.compareAt, quantity: 1, ...extra };
};

const items = [item("aura-wireless-headphones", { color: "Graphite" }), item("fleece-hoodie", { size: "M", color: "Black" }), item("thermal-bottle", { size: "750ml", quantity: 2 })];
const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);

export const CheckoutSidebar = () => {
  const [code, setCode] = useState<string | null>("BLUESIGNS20");
  const totals = computeBagTotals(items, { coupon: coupons.find((c) => c.code === code), express: true });
  return (
    <div style={{ maxWidth: 400 }}>
      <OrderSummary
        items={items}
        details={totals}
        promo={<CouponSheet coupons={coupons} subtotal={subtotal} today="2026-09-15" appliedCode={code} onApply={setCode} />}
        action={
          <Button size="lg" fullWidth>
            Continue to payment
          </Button>
        }
      />
    </div>
  );
};

export const PromoCodeAndLegacyTotals = () => (
  <div style={{ maxWidth: 400 }}>
    <OrderSummary
      items={items.slice(0, 2)}
      totals={{ subtotal: 15998, shipping: null, tax: 0, discount: 500 }}
      promo={<PromoCodeInput onApply={(c) => (c === "FIRST500" ? { ok: true, label: "FIRST500 · ₹500 off" } : { ok: false, error: "This code isn’t valid" })} />}
      action={
        <Button size="lg" fullWidth>
          Place order
        </Button>
      }
    />
  </div>
);

export const SingleItemNoAction = () => (
  <div style={{ maxWidth: 400 }}>
    <OrderSummary items={[item("no-5-eau-de-parfum", { size: "50ml" })]} details={computeBagTotals([{ price: 3499, quantity: 1 }], { cod: true })} />
  </div>
);
