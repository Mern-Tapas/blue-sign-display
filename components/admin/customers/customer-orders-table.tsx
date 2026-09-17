"use client";

import Link from "next/link";
import { adminDateShort } from "@/lib/admin-format";
import { orderStatusMeta, type AdminOrder } from "@/lib/data/admin";
import { formatNumber, formatPrice } from "@/lib/format";
import { StatusPill } from "../admin-display";
import { DataTable, type DataColumn } from "../data-table";

const columns: DataColumn<AdminOrder>[] = [
  { id: "order", header: "Order", sortValue: (o) => o.id, cell: (o) => <span className="text-body-strong">{o.id}</span> },
  { id: "placed", header: "Placed", sortValue: (o) => o.placedAt, cell: (o) => <span className="figures">{adminDateShort(o.placedAt)}</span> },
  { id: "items", header: "Items", align: "end", hideBelow: "lg", sortValue: (o) => o.lines.reduce((s, l) => s + l.quantity, 0), cell: (o) => formatNumber(o.lines.reduce((s, l) => s + l.quantity, 0)) },
  { id: "payment", header: "Payment", hideBelow: "xl", sortValue: (o) => o.payment, cell: (o) => o.payment },
  { id: "status", header: "Status", sortValue: (o) => orderStatusMeta[o.status].label, cell: (o) => <StatusPill tone={orderStatusMeta[o.status].tone} label={orderStatusMeta[o.status].label} live={orderStatusMeta[o.status].live} /> },
  { id: "total", header: "Total", align: "end", sortValue: (o) => o.total, cell: (o) => formatPrice(o.total) },
];

export type CustomerOrdersTableProps = {
  orders: AdminOrder[];
  firstName: string;
  /** Teaching empty state action (e.g. send a win-back coupon). */
  emptyAction?: React.ReactNode;
};

/** A customer's recent orders; each row opens the order. */
export function CustomerOrdersTable({ orders, firstName, emptyAction }: CustomerOrdersTableProps) {
  return (
    <DataTable
      caption={`Orders from ${firstName}`}
      columns={columns}
      rows={orders}
      getRowId={(o) => o.id}
      rowHref={(o) => `/admin/orders/${o.id}`}
      defaultSort={{ id: "placed", direction: "desc" }}
      pageSize={5}
      density="compact"
      toolbar={
        <div className="flex min-w-0 flex-col">
          <h2 className="text-title">Orders</h2>
          <p className="text-caption text-fg-muted">Last 60 days</p>
        </div>
      }
      empty={{
        title: `No orders from ${firstName} in the last 60 days`,
        description: "When they order, each one appears here with its status and total, and opens to the full order. A coupon is often what brings a quiet customer back.",
        action: emptyAction,
      }}
      renderCard={(o) => (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3">
            <Link href={`/admin/orders/${o.id}`} className="text-body-strong focus-ring-card [--focus-card-radius:var(--radius-md)] after:absolute after:inset-0">
              {o.id}
            </Link>
            <span className="text-body-strong figures">{formatPrice(o.total)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-caption text-fg-muted figures">
              {adminDateShort(o.placedAt)} · {o.payment}
            </span>
            <StatusPill tone={orderStatusMeta[o.status].tone} label={orderStatusMeta[o.status].label} />
          </div>
        </div>
      )}
    />
  );
}
