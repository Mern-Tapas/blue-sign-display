"use client";

import Link from "next/link";
import { MapPin, Wallet } from "lucide-react";
import { PriceDetails } from "@/components/cart/price-details";
import { OrderStatusBadge } from "@/components/commerce/order-status-badge";
import { OrderTimeline } from "@/components/commerce/order-timeline";
import { PriceDisplay } from "@/components/commerce/price-display";
import { ProductImage } from "@/components/commerce/product-image";
import { toast } from "@/components/providers/toast-store";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import type { Order } from "@/lib/data/types";
import { canCancel, canReturn, orderLines, returnDeadline } from "@/lib/orders";
import { computeBagTotals } from "@/lib/pricing";
import { useHydrated } from "@/lib/use-hydrated";
import { CancelOrderDialog } from "./cancel-order-dialog";
import { InvoiceDownloadButton } from "./invoice-download-button";
import { OrderSupportCard } from "./order-support-card";
import { RateProductPrompt } from "./rate-product-prompt";
import { RefundStatusCard } from "./refund-status-card";
import { ReturnExchangeFlow } from "./return-exchange-flow";
import { ShipmentTracker } from "./shipment-tracker";

export type OrderDetailsProps = {
  order: Order;
  className?: string;
};

const wait = (ms = 900) => new Promise((r) => setTimeout(r, ms));

/**
 * Everything about one order: status and tracking, refund progress, items with rate prompts,
 * delivery address, payment, price breakdown, scan history, and the actions allowed right now
 * (cancel, return / exchange, invoice, help). Actions here are demo-only.
 */
export function OrderDetails({ order, className }: OrderDetailsProps) {
  const hydrated = useHydrated();
  const today = hydrated ? new Date().toISOString().slice(0, 10) : "";
  const lines = orderLines(order);
  const totals = computeBagTotals(lines.map((l) => ({ price: l.price, compareAt: l.product.compareAt, quantity: l.quantity })), { cod: order.paymentMethod === "Cash on Delivery" });
  const isCod = order.paymentMethod === "Cash on Delivery";
  const deadline = returnDeadline(order);
  const delivered = order.status === "delivered";

  return (
    <div data-slot="order-details" className={cn("grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]", className)}>
      <div className="flex min-w-0 flex-col gap-5">
        <Card asChild className="gap-3">
          <header>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="flex items-center gap-1 text-heading-lg figures">
                Order {order.id}
                <CopyButton value={order.id} label="Copy order number" size="xs" />
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-body text-fg-muted">Placed on {formatDate(order.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
            {order.status !== "cancelled" && <ShipmentTracker order={order} trackingUrl={order.awb ? `https://www.google.com/search?q=${order.courier}+${order.awb}` : undefined} className="mt-2" />}
            <div className="flex flex-wrap gap-2 pt-2">
              {canCancel(order) && (
                <CancelOrderDialog
                  orderId={order.id}
                  amount={order.total}
                  paymentMethod={order.paymentMethod ?? "your payment method"}
                  isCod={isCod}
                  onConfirm={async () => {
                    await wait();
                    toast({ title: "Demo: cancellation requested", tone: "info" });
                  }}
                />
              )}
              {delivered && deadline && canReturn(order, today) && (
                <ReturnExchangeFlow
                  orderId={order.id}
                  lines={lines}
                  deadline={deadline}
                  isCod={isCod}
                  paymentMethod={order.paymentMethod ?? "original payment method"}
                  pickupAddress={order.address}
                  onSubmit={async () => {
                    await wait();
                  }}
                />
              )}
              <InvoiceDownloadButton
                orderId={order.id}
                available={delivered || order.status === "returned"}
                getInvoice={async () => {
                  await wait(600);
                  const text = `Tax invoice (demo)\nOrder ${order.id}\nDate ${order.date}\n\n${lines.map((l) => `${l.product.name} x${l.quantity}  INR ${l.price * l.quantity}`).join("\n")}\n\nTotal INR ${order.total} (inclusive of GST)\nSold by BlueSigns Retail Pvt. Ltd.`;
                  return new Blob([text], { type: "text/plain" });
                }}
                fileName={`Invoice-${order.id}.txt`}
              />
            </div>
            {delivered && deadline && hydrated && !canReturn(order, today) && (
              <p className="text-caption text-fg-muted">Return window closed on {formatDate(deadline, { day: "numeric", month: "long" })}. You can still contact support for warranty issues.</p>
            )}
          </header>
        </Card>

        {order.refund && <RefundStatusCard refund={order.refund} />}

        <Card asChild className="gap-3">
          <section aria-label="Items">
            <h2 className="text-title">Items</h2>
            <ul className="flex flex-col divide-y divide-border-subtle">
              {lines.map((l) => (
                <li key={l.productId} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <Link href={`/products/${l.product.slug}`} tabIndex={-1} aria-hidden className="shrink-0">
                    <ProductImage src={l.product.images[0]!} alt="" sizes="64px" wrapperClassName="size-16 rounded-lg" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <Link href={`/products/${l.product.slug}`} className="truncate text-body-strong underline-offset-4 hover:underline">
                      {l.product.name}
                    </Link>
                    <span className="text-caption text-fg-muted figures">{[l.color, l.size && `Size ${l.size}`, `Qty ${l.quantity}`].filter(Boolean).join(" · ")}</span>
                  </div>
                  <PriceDisplay amount={l.price * l.quantity} size="sm" />
                </li>
              ))}
            </ul>
          </section>
        </Card>

        {delivered && lines[0] && <RateProductPrompt product={{ name: lines[0].product.name, image: lines[0].product.images[0]! }} />}

        <Card asChild padding="none">
          <section aria-label="Tracking history">
            <Accordion type="single" collapsible defaultValue={order.status === "out-for-delivery" ? "history" : undefined} className="px-(--card-pad)">
              <AccordionItem value="history" className="border-b-0">
                <AccordionTrigger>Tracking history</AccordionTrigger>
                <AccordionContent>
                  <OrderTimeline events={order.timeline} newestFirst />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </Card>
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start" aria-label="Order information">
        <Card asChild className="gap-3 text-body">
          <section>
            <p className="flex items-start gap-3">
              <MapPin aria-hidden className="mt-0.5 size-icon-md shrink-0 text-fg-muted" />
              <span>
                <span className="block text-caption text-fg-muted">Delivery address</span>
                {order.address}
              </span>
            </p>
            <p className="flex items-start gap-3">
              <Wallet aria-hidden className="mt-0.5 size-icon-md shrink-0 text-fg-muted" />
              <span>
                <span className="block text-caption text-fg-muted">Payment</span>
                {order.paymentMethod}
              </span>
            </p>
          </section>
        </Card>
        <PriceDetails totals={totals} title="Price details" />
        <OrderSupportCard orderId={order.id} />
      </aside>
    </div>
  );
}
