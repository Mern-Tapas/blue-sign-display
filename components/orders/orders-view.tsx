"use client";

import { useState } from "react";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useHydrated } from "@/lib/use-hydrated";
import type { Order } from "@/lib/data/types";
import { OrderFilters, applyOrderFilters, emptyOrderFilters } from "./order-filters";
import { OrderItemCard } from "./order-item-card";

/** The orders page body: filters and the matching orders, with an empty state that offers a way back. */
export function OrdersView({ orders, detailsHref = (o) => `/account/orders/${o.id}` }: { orders: Order[]; detailsHref?: (order: Order) => string }) {
  const hydrated = useHydrated();
  const today = hydrated ? new Date().toISOString().slice(0, 10) : "";
  const [filters, setFilters] = useState(emptyOrderFilters);
  const shown = applyOrderFilters(orders, filters, today);

  return (
    <div className="flex flex-col gap-5">
      <OrderFilters orders={orders} value={filters} onChange={setFilters} />
      <p className="text-label text-fg-muted" aria-live="polite">
        {shown.length} {shown.length === 1 ? "order" : "orders"}
      </p>
      {shown.length === 0 ? (
        <Card variant="outline" padding="none">
          <EmptyState
            icon={<PackageSearch aria-hidden />}
            title="No orders match"
            description="Try another status or date range, or search by the order number from your SMS."
            action={
              <>
                <Button variant="secondary" onClick={() => setFilters(emptyOrderFilters)}>
                  Clear filters
                </Button>
                <Button asChild>
                  <Link href="/shop">Continue shopping</Link>
                </Button>
              </>
            }
          />
        </Card>
      ) : (
        <ul className="grid gap-3 xl:grid-cols-2">
          {shown.map((o) => (
            <li key={o.id}>
              <OrderItemCard order={o} today={today} detailsHref={detailsHref(o)} className="h-full" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
