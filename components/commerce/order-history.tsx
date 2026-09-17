import Link from "next/link";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { getProductById } from "@/lib/data/products";
import type { Order } from "@/lib/data/types";
import { formatDate, formatPrice } from "@/lib/format";
import { OrderStatusBadge } from "./order-status-badge";
import { ProductImage } from "./product-image";

export type OrderHistoryProps = {
  orders: Order[];
  /** Highlighted order (e.g. the one whose timeline is open). */
  activeId?: string;
  hrefFor?: (order: Order) => string;
  className?: string;
};

export function OrderHistory({ orders, activeId, hrefFor, className }: OrderHistoryProps) {
  return (
    <ul data-slot="order-history" className={cn("flex flex-col gap-3", className)}>
      {orders.map((order) => {
        const products = order.items.map((i) => getProductById(i.productId)).filter((p) => p !== undefined);
        const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);
        const active = order.id === activeId;
        return (
          <Card
            asChild
            key={order.id}
            variant={active ? "contrast" : "surface"}
            padding="none"
            className="gap-4 p-4 transition-[background-color,color,box-shadow] duration-(--dur-base) sm:flex-row sm:items-center sm:p-5"
          >
          <li>
            <div className="flex -space-x-3">
              {products.slice(0, 3).map((p) => (
                <ProductImage
                  key={p.id}
                  src={p.images[0]!}
                  alt={p.name}
                  sizes="56px"
                  wrapperClassName={cn("size-14 rounded-pill ring-2", active ? "ring-surface-contrast" : "ring-surface")}
                />
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-body-lg font-medium figures"># {order.id}</p>
                <OrderStatusBadge status={order.status} className={cn(active && "border-edge-on-color bg-tile-on-color text-fg-on-contrast")} />
              </div>
              <p className={cn("mt-1 text-caption", active ? "text-fg-on-contrast-muted" : "text-fg-muted")}>
                Placed <time dateTime={order.date}>{formatDate(order.date)}</time> · {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <p className="text-heading-sm figures">{formatPrice(order.total)}</p>
              <div className="flex gap-2">
                {order.status === "delivered" && (
                  <Button size="sm" variant="secondary" leadingIcon={<RotateCcw aria-hidden />}>
                    Buy again
                  </Button>
                )}
                {hrefFor && (
                  <Button
                    asChild
                    size="sm"
                    variant={active ? "secondary" : "neutral"}
                    trailingIcon={<ArrowUpRight aria-hidden />}
                  >
                    <Link href={hrefFor(order)} scroll={false}>
                      {active ? "Viewing" : "Track"}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </li>
          </Card>
        );
      })}
    </ul>
  );
}
