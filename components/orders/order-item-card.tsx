"use client";

import Link from "next/link";
import { ChevronRight, RotateCcw } from "lucide-react";
import { OrderStatusBadge } from "@/components/commerce/order-status-badge";
import { ProductImage } from "@/components/commerce/product-image";
import { cart } from "@/components/providers/cart-store";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { formatDate, formatPrice } from "@/lib/format";
import type { Order } from "@/lib/data/types";
import { canReturn, orderLines, returnDeadline } from "@/lib/orders";

export type OrderItemCardProps = {
  order: Order;
  /** yyyy-mm-dd for return-window messages. */
  today: string;
  detailsHref: string;
  className?: string;
};

function statusLine(order: Order, today: string) {
  const d = (iso: string) => formatDate(iso, { weekday: "short", day: "numeric", month: "short" });
  switch (order.status) {
    case "processing":
      return { text: "Order confirmed · preparing to ship", tone: "text-fg" };
    case "shipped":
      return { text: order.expectedBy ? `Shipped · arriving by ${d(order.expectedBy)}` : "Shipped", tone: "text-fg" };
    case "out-for-delivery":
      return { text: "Out for delivery · arriving today", tone: "text-accent-fg" };
    case "delivered": {
      const deadline = returnDeadline(order);
      const open = canReturn(order, today);
      return {
        text: `Delivered on ${order.deliveredOn ? d(order.deliveredOn) : ""}`,
        sub: deadline ? (open ? `Return or exchange until ${d(deadline)}` : `Return window closed on ${d(deadline)}`) : undefined,
        tone: "text-success-fg",
      };
    }
    case "cancelled":
      return { text: "Cancelled", sub: order.refund ? `Refund ${order.refund.status === "credited" ? "credited" : "in progress"} · ${formatPrice(order.refund.amount)}` : undefined, tone: "text-danger-fg" };
    case "returned":
      return { text: "Returned", sub: order.refund ? `Refund ${order.refund.status === "credited" ? "credited" : "in progress"} · ${formatPrice(order.refund.amount)}` : undefined, tone: "text-fg" };
  }
}

/**
 * One order in the list, in the shopper's words: the status as a sentence ("Delivered on Wed,
 * 9 Sept"), the return window or refund state, product thumbnails, total, and the obvious next
 * action — Track, Buy again or details.
 */
export function OrderItemCard({ order, today, detailsHref, className }: OrderItemCardProps) {
  const lines = orderLines(order);
  const status = statusLine(order, today);
  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);
  const first = lines[0];

  return (
    <Card asChild className={cn("group", className)}>
      <article data-slot="order-item">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <p className={cn("text-body-strong", status.tone)}>{status.text}</p>
            {status.sub && <p className="text-caption text-fg-muted">{status.sub}</p>}
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex shrink-0 -space-x-4">
            {lines.slice(0, 3).map((l) => (
              <ProductImage key={l.productId} src={l.product.images[0]!} alt="" sizes="64px" wrapperClassName="size-16 rounded-lg ring-2 ring-surface" />
            ))}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h3 className="truncate text-body-strong">
              <Link href={detailsHref} className="focus-ring-card after:absolute after:inset-0 after:rounded-2xl">
                {first?.product.name}
                {lines.length > 1 && <span className="text-fg-muted"> + {lines.length - 1} more</span>}
              </Link>
            </h3>
            <p className="text-caption text-fg-muted figures">
              {order.id} · {itemCount} {itemCount === 1 ? "item" : "items"} · {formatDate(order.date, { day: "numeric", month: "short", year: "numeric" })}
            </p>
            <p className="text-label figures">{formatPrice(order.total)}</p>
          </div>
          <ChevronRight aria-hidden className="size-icon-md shrink-0 text-fg-muted" />
        </div>

        <div className="relative z-10 flex flex-wrap gap-2">
          {(order.status === "shipped" || order.status === "out-for-delivery" || order.status === "processing") && (
            <Button asChild size="sm" variant="neutral">
              <Link href={detailsHref}>Track order</Link>
            </Button>
          )}
          {(order.status === "delivered" || order.status === "cancelled" || order.status === "returned") && (
            <Button
              size="sm"
              variant="secondary"
              leadingIcon={<RotateCcw aria-hidden />}
              onClick={() => {
                lines.forEach((l) => cart.add({ productId: l.productId, slug: l.product.slug, name: l.product.name, image: l.product.images[0]!, price: l.product.price, compareAt: l.product.compareAt, size: l.size, color: l.color, quantity: l.quantity }, { open: false }));
                toast({ title: "Added to bag", description: `${lines.length} ${lines.length === 1 ? "item" : "items"} from ${order.id} at today’s price`, tone: "success", action: { label: "View bag", onClick: () => cart.setOpen(true) } });
              }}
            >
              Buy again
            </Button>
          )}
        </div>
      </article>
    </Card>
  );
}
