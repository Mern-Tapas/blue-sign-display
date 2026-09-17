"use client";

import Link from "next/link";
import { Camera } from "lucide-react";
import { ProductImage } from "@/components/commerce/product-image";
import { Badge } from "@/components/ui/badge";
import { adminRelative } from "@/lib/admin-format";
import { ADMIN_TODAY } from "@/lib/data/admin";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { StatusPill } from "../admin-display";
import { DataTable, type DataColumn } from "../data-table";
import { returnStatusMeta } from "./order-helpers";
import type { ReturnRecord } from "./return-records";

export type ReturnsQueueProps = {
  rows: ReturnRecord[];
  selectedId: string | null;
  onOpen: (id: string) => void;
  /** Narrow the table while the detail panel is open beside it. */
  compact?: boolean;
  toolbar?: React.ReactNode;
  empty: { title: string; description?: string; action?: React.ReactNode };
};

/** Stretched button: the whole row opens the detail panel; links inside the row stay clickable above it. */
function OpenButton({ r, selected, onOpen, children }: { r: ReturnRecord; selected: boolean; onOpen: (id: string) => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(r.id)}
      aria-current={selected || undefined}
      aria-label={`Review return ${r.id}, ${r.productName}`}
      className="focus-ring-card flex flex-col text-left [--focus-card-radius:var(--radius-xs)] after:absolute after:inset-0"
    >
      {children}
    </button>
  );
}

const statusCell = (r: ReturnRecord) => {
  const meta = returnStatusMeta[r.status];
  return <StatusPill tone={meta.tone} label={meta.label} />;
};

/** Returns queue: product, reason, resolution and amount; rows open the review panel instead of a new page. */
export function ReturnsQueue({ rows, selectedId, onOpen, compact = false, toolbar, empty }: ReturnsQueueProps) {
  const columns: DataColumn<ReturnRecord>[] = [
    {
      id: "return",
      header: "Return",
      sortValue: (r) => r.requestedAt,
      cell: (r) => (
        <OpenButton r={r} selected={r.id === selectedId} onOpen={onOpen}>
          <span className="text-body-strong">{r.id}</span>
          <span className="text-caption text-fg-muted figures">{adminRelative(r.requestedAt, ADMIN_TODAY)}</span>
        </OpenButton>
      ),
    },
    {
      id: "product",
      header: "Product",
      sortValue: (r) => r.productName,
      cell: (r) => (
        <span className="flex items-center gap-3">
          <ProductImage src={r.image} alt="" sizes="40px" wrapperClassName="size-10 shrink-0 rounded-sm" />
          <span className="flex min-w-0 flex-col">
            <span className="max-w-48 truncate text-body">{r.productName}</span>
            <span className="text-caption text-fg-muted">{r.customerName}</span>
          </span>
        </span>
      ),
    },
    {
      id: "order",
      header: "Order",
      hideBelow: "lg",
      sortValue: (r) => r.orderId,
      cell: (r) => (
        <Link href={`/admin/orders/${r.orderId}`} className="relative z-10 text-body text-accent-fg underline-offset-4 hover:underline">
          {r.orderId}
        </Link>
      ),
    },
    { id: "reason", header: "Reason", hideBelow: "xl", hideable: true, sortValue: (r) => r.reason, cell: (r) => <span className="text-body">{r.reason}</span> },
    {
      id: "resolution",
      header: "Resolution",
      hideBelow: "lg",
      hideable: true,
      sortValue: (r) => r.resolution,
      cell: (r) => (
        <Badge tone={r.resolution === "refund" ? "neutral" : "info"} size="sm">
          {r.resolution === "refund" ? "Refund" : "Exchange"}
        </Badge>
      ),
    },
    { id: "amount", header: "Amount", align: "end", sortValue: (r) => r.amount, cell: (r) => <span className="text-body-strong">{formatPrice(r.amount)}</span> },
    { id: "status", header: "Status", sortValue: (r) => returnStatusMeta[r.status].label, cell: statusCell },
    {
      id: "photos",
      header: "Photos",
      align: "end",
      hideBelow: "xl",
      hideable: true,
      sortValue: (r) => r.photos,
      cell: (r) =>
        r.photos > 0 ? (
          <span className="inline-flex items-center gap-1 text-body">
            <Camera aria-hidden className="size-icon-sm text-fg-muted" />
            {r.photos}
          </span>
        ) : (
          <span className="text-caption text-fg-muted">None</span>
        ),
    },
  ];

  const visible = compact ? columns.filter((c) => !["order", "reason", "resolution", "photos"].includes(c.id)) : columns;

  return (
    <DataTable
      caption="Return requests"
      columns={visible}
      rows={rows}
      getRowId={(r) => r.id}
      defaultSort={{ id: "return", direction: "desc" }}
      pageSize={10}
      toolbar={toolbar}
      empty={empty}
      className={cn("[&_tbody_tr]:relative [&_tbody_tr:has([aria-current=true])]:bg-selected", "[&_li:has([aria-current=true])]:bg-selected")}
      renderCard={(r) => (
        <div className="flex items-start gap-3">
          <ProductImage src={r.image} alt="" sizes="48px" wrapperClassName="size-12 shrink-0 rounded-sm" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-start justify-between gap-2">
              <OpenButton r={r} selected={r.id === selectedId} onOpen={onOpen}>
                <span className="text-body-strong">{r.id}</span>
              </OpenButton>
              <span className="text-body-strong figures">{formatPrice(r.amount)}</span>
            </div>
            <p className="truncate text-caption text-fg-muted">
              {r.productName} · {r.reason}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {statusCell(r)}
              <span className="text-caption text-fg-muted">{adminRelative(r.requestedAt, ADMIN_TODAY)}</span>
            </div>
          </div>
        </div>
      )}
    />
  );
}
