import Link from "next/link";
import { CircleCheck, MapPin, Package, Wallet } from "lucide-react";
import { PriceDetails } from "@/components/cart/price-details";
import { ProductImage } from "@/components/commerce/product-image";
import type { CartItem } from "@/components/providers/cart-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { IconTile } from "@/components/ui/icon-tile";
import { cn } from "@/lib/cn";
import type { BagTotals } from "@/lib/pricing";

export type OrderConfirmationProps = {
  orderId: string;
  customerName?: string;
  /** "Thu, 18 Sept" — computed where the date is known. */
  deliveryBy?: string;
  addressLine: string;
  paymentLine: string;
  items: CartItem[];
  totals: BagTotals;
  trackHref?: string;
  shopHref?: string;
  /** Extra line, e.g. "Pay ₹3,518 in cash on delivery". */
  note?: React.ReactNode;
  className?: string;
};

/** Order placed: order number to copy, delivery date, where and how it's paid, the items and the final price breakdown. Server-safe. */
export function OrderConfirmation({ orderId, customerName, deliveryBy, addressLine, paymentLine, items, totals, trackHref = "/account/orders", shopHref = "/shop", note, className }: OrderConfirmationProps) {
  return (
    <div data-slot="order-confirmation" className={cn("mx-auto flex w-full max-w-3xl animate-slide-up flex-col gap-5", className)}>
      <Card asChild padding="none" className="items-center gap-4 p-6 text-center sm:p-10">
        <section>
          <IconTile size="xl" tone="success">
            <CircleCheck />
          </IconTile>
          <h1 className="text-display-lg">
            Order placed{customerName ? "," : ""} <span className="text-fg-muted">{customerName ? customerName.split(" ")[0] : ""}</span>
          </h1>
          <p className="flex flex-wrap items-center justify-center gap-1 text-body-lg text-fg-muted">
            Order <span className="font-medium text-fg figures">{orderId}</span>
            <CopyButton value={orderId} label="Copy order number" size="xs" />
          </p>
          {deliveryBy && (
            <p className="rounded-pill bg-accent-soft px-4 py-1.5 text-body text-accent-soft-fg">
              Arriving by <span className="text-body-strong">{deliveryBy}</span>
            </p>
          )}
          {note && <p className="text-body text-fg-muted">{note}</p>}
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="neutral" leadingIcon={<Package aria-hidden />}>
              <Link href={trackHref}>Track order</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={shopHref}>Continue shopping</Link>
            </Button>
          </div>
        </section>
      </Card>

      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_20rem]">
        <Card asChild>
          <section aria-label="Order details">
            <ul className="flex flex-col gap-3 text-body">
              <li className="flex items-start gap-3">
                <MapPin aria-hidden className="mt-0.5 size-icon-md shrink-0 text-fg-muted" />
                <span>
                  <span className="block text-caption text-fg-muted">Delivering to</span>
                  {addressLine}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Wallet aria-hidden className="mt-0.5 size-icon-md shrink-0 text-fg-muted" />
                <span>
                  <span className="block text-caption text-fg-muted">Payment</span>
                  {paymentLine}
                </span>
              </li>
            </ul>
            <ul className="flex flex-col divide-y divide-border-subtle border-t border-border-subtle">
              {items.map((i) => (
                <li key={i.key} className="flex items-center gap-3 py-3">
                  <ProductImage src={i.image} alt="" sizes="56px" wrapperClassName="size-14 shrink-0 rounded-md" />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-body-strong">{i.name}</span>
                    <span className="text-caption text-fg-muted figures">{[i.color, i.size && `Size ${i.size}`, `Qty ${i.quantity}`].filter(Boolean).join(" · ")}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </Card>
        <PriceDetails totals={totals} title="Paid" />
      </div>
    </div>
  );
}
