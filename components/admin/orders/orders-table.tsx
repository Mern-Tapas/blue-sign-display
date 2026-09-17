"use client";

import Link from "next/link";
import { Download, PackageCheck, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminRelative } from "@/lib/admin-format";
import { ADMIN_TODAY, orderStatusMeta, type AdminOrder } from "@/lib/data/admin";
import { formatNumber, formatPrice } from "@/lib/format";
import { StatusPill } from "../admin-display";
import { DataTable, type DataColumn } from "../data-table";
import { isShipByAtRisk, isUnshipped, paymentBadge, shipByHoursLeft } from "./order-helpers";
import { PaymentStatus } from "./payment-status";
import { ShipByStatus } from "./ship-by-status";

export type OrdersTableProps = {
  rows: AdminOrder[];
  toolbar?: React.ReactNode;
  loading?: boolean;
  empty: { title: string; description?: string; action?: React.ReactNode };
  onMarkPacked: (orders: AdminOrder[]) => void;
  onPrintLabels: (orders: AdminOrder[]) => void;
  onExport: (orders: AdminOrder[]) => void;
};

const units = (o: AdminOrder) => o.lines.reduce((s, l) => s + l.quantity, 0);

const columns: DataColumn<AdminOrder>[] = [
  {
    id: "order",
    header: "Order",
    sortValue: (o) => o.placedAt,
    cell: (o) => (
      <span className="flex flex-col">
        <span className="text-body-strong">{o.id}</span>
        <span className="text-caption text-fg-muted figures">{adminRelative(o.placedAt, ADMIN_TODAY)}</span>
      </span>
    ),
  },
  {
    id: "customer",
    header: "Customer",
    sortValue: (o) => o.customerName,
    cell: (o) => (
      <span className="flex flex-col">
        <span className="text-body">{o.customerName}</span>
        <span className="text-caption text-fg-muted">{o.city}</span>
      </span>
    ),
  },
  {
    id: "items",
    header: "Items",
    hideBelow: "lg",
    hideable: true,
    sortValue: units,
    cell: (o) => (
      <span className="flex max-w-32 flex-col">
        <span className="text-body figures">
          {formatNumber(units(o))} {units(o) === 1 ? "item" : "items"}
        </span>
        <span className="truncate text-caption text-fg-muted">
          {o.lines[0]!.name}
          {o.lines.length > 1 && ` +${o.lines.length - 1} more`}
        </span>
      </span>
    ),
  },
  {
    id: "payment",
    header: "Payment",
    hideable: true,
    sortValue: (o) => `${paymentBadge(o).label}-${o.payment}`,
    cell: (o) => <PaymentStatus order={o} />,
  },
  {
    id: "total",
    header: "Total",
    align: "end",
    sortValue: (o) => o.total,
    cell: (o) => <span className="text-body-strong">{formatPrice(o.total)}</span>,
  },
  {
    id: "status",
    header: "Status",
    sortValue: (o) => orderStatusMeta[o.status].label,
    cell: (o) => {
      const meta = orderStatusMeta[o.status];
      return <StatusPill tone={meta.tone} label={meta.label} live={meta.live} />;
    },
  },
  {
    id: "shipBy",
    header: "Ship-by",
    hideBelow: "lg",
    hideable: true,
    sortValue: (o) => (isUnshipped(o.status) ? shipByHoursLeft(o) : Number.MAX_SAFE_INTEGER),
    cell: (o) => <ShipByStatus order={o} />,
  },
  {
    id: "courier",
    header: "Courier / AWB",
    hideBelow: "xl",
    hideable: true,
    sortValue: (o) => o.courier ?? "~",
    cell: (o) =>
      o.courier ? (
        <span className="flex flex-col">
          <span className="text-body">{o.courier}</span>
          <span className="text-code text-fg-muted">{o.awb}</span>
        </span>
      ) : (
        <span className="text-caption text-fg-muted">Not assigned</span>
      ),
  },
];

function OrderCard({ order }: { order: AdminOrder }) {
  const meta = orderStatusMeta[order.status];
  const pay = paymentBadge(order);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <Link href={`/admin/orders/${order.id}`} className="text-body-strong focus-ring-card [--focus-card-radius:var(--radius-md)] after:absolute after:inset-0">
            {order.id}
          </Link>
          <span className="truncate text-caption text-fg-muted">
            {order.customerName} · {order.city} · {adminRelative(order.placedAt, ADMIN_TODAY)}
          </span>
        </div>
        <StatusPill tone={meta.tone} label={meta.label} live={meta.live} />
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 flex-wrap items-center gap-2 text-caption text-fg-muted">
          <span className="figures">
            {units(order)} {units(order) === 1 ? "item" : "items"}
          </span>
          <span aria-hidden>·</span>
          <span>{order.payment}</span>
          <Badge tone={pay.tone} size="sm">
            {pay.label}
          </Badge>
        </span>
        <span className="text-body-strong figures">{formatPrice(order.total)}</span>
      </div>
      {isShipByAtRisk(order) && <ShipByStatus order={order} layout="inline" />}
    </div>
  );
}

/** Orders list: sortable columns, row links to the order, bulk fulfilment actions and a card layout on phones. */
export function OrdersTable({ rows, toolbar, loading, empty, onMarkPacked, onPrintLabels, onExport }: OrdersTableProps) {
  return (
    <DataTable
      caption="Orders"
      columns={columns}
      rows={rows}
      getRowId={(o) => o.id}
      rowHref={(o) => `/admin/orders/${o.id}`}
      defaultSort={{ id: "order", direction: "desc" }}
      pageSize={15}
      selectable
      loading={loading}
      toolbar={toolbar}
      empty={empty}
      renderCard={(o) => <OrderCard order={o} />}
      bulkActions={(selected, clear) => (
        <>
          <Button
            variant="secondary"
            size="sm"
            leadingIcon={<PackageCheck aria-hidden />}
            onClick={() => {
              onMarkPacked(selected);
              clear();
            }}
          >
            Mark as packed
          </Button>
          <Button variant="secondary" size="sm" leadingIcon={<Printer aria-hidden />} onClick={() => onPrintLabels(selected)}>
            Print shipping labels
          </Button>
          <Button variant="secondary" size="sm" leadingIcon={<Download aria-hidden />} onClick={() => onExport(selected)}>
            Export CSV
          </Button>
        </>
      )}
    />
  );
}
