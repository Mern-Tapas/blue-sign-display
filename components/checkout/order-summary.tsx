"use client";

import { ShieldCheck } from "lucide-react";
import { CartLineItem } from "@/components/commerce/cart-line-item";
import type { CartItem } from "@/components/providers/cart-store";
import { PriceDetails } from "@/components/cart/price-details";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Inset } from "@/components/ui/inset";
import type { BagTotals } from "@/lib/pricing";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

export type OrderTotals = {
  subtotal: number;
  shipping: number | null;
  tax: number;
  discount: number;
};

export function orderTotal(t: OrderTotals) {
  return Math.max(0, t.subtotal - t.discount) + (t.shipping ?? 0) + t.tax;
}

export type OrderSummaryProps = {
  items: CartItem[];
  /** Legacy subtotal / shipping / tax totals. Prefer `details`. */
  totals?: OrderTotals;
  /** Slot for the promo code input. */
  promo?: React.ReactNode;
  /** Slot for the primary CTA. */
  action?: React.ReactNode;
  /** Indian price breakdown (MRP, discounts, fees). When given it replaces the legacy totals rows. */
  details?: BagTotals;
  className?: string;
};

function Row({ label, value, className }: { label: React.ReactNode; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <dt className="text-fg-muted">{label}</dt>
      <dd className="figures">{value}</dd>
    </div>
  );
}

export function OrderSummary({ items, totals, promo, action, details, className }: OrderSummaryProps) {
  const count = items.reduce((n, i) => n + i.quantity, 0);
  return (
    <Card asChild className={cn("gap-5", className)}>
      <section data-slot="order-summary" aria-label="Order summary">
        <div className="flex items-center justify-between">
          <h2 className="text-title">Order summary</h2>
          <span className="text-caption text-fg-muted figures">
            {count} {count === 1 ? "item" : "items"}
          </span>
        </div>

        {items.length > 0 && (
          <ul className="flex max-h-72 flex-col gap-4 overflow-y-auto pt-1.5 pr-1">
            {items.map((i) => (
              <li key={i.key}>
                <CartLineItem item={i} readOnly />
              </li>
            ))}
          </ul>
        )}

        {promo}

        {details ? (
          <Inset>
            <PriceDetails totals={details} variant="plain" compact />
          </Inset>
        ) : totals ? (
          <Inset>
            <dl className="flex flex-col gap-2.5 text-body">
              <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
              {totals.discount > 0 && <Row label="Discount" value={`-${formatPrice(totals.discount)}`} className="[&_dd]:text-success-fg" />}
              <Row
                label="Shipping"
                value={totals.shipping === null ? <span className="text-fg-muted">Next step</span> : totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
              />
              <Row label="Estimated tax" value={formatPrice(totals.tax)} />
              <Divider className="my-1" />
              <div className="flex items-baseline justify-between">
                <dt className="text-body-lg font-medium">Total</dt>
                <dd className="text-figure-lg figures">
                  <span className="mr-1 text-caption font-normal text-fg-muted">INR</span>
                  {formatPrice(orderTotal(totals))}
                </dd>
              </div>
            </dl>
          </Inset>
        ) : null}

        {action}

        <p className="flex items-center justify-center gap-1.5 text-caption text-fg-muted">
          <ShieldCheck aria-hidden className="size-icon-sm" /> Secure payments · 14-day easy returns
        </p>
      </section>
    </Card>
  );
}
