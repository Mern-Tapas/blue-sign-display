"use client";

import { Button } from "@/components/ui/button";
import { formatNumber, formatPrice } from "@/lib/format";
import { DataTable, type DataColumn } from "../data-table";
import type { CityRow } from "./reports-data";

const share = (v: number) => `${formatNumber(v, { maximumFractionDigits: 0 })}%`;

const columns: DataColumn<CityRow>[] = [
  {
    id: "city",
    header: "City",
    cell: (r) => (
      <span className="flex flex-col">
        <span className="text-body-strong">{r.city}</span>
        <span className="text-caption text-fg-muted">{r.state}</span>
      </span>
    ),
    sortValue: (r) => r.city,
  },
  { id: "orders", header: "Orders", cell: (r) => formatNumber(r.orders), sortValue: (r) => r.orders, align: "end" },
  { id: "revenue", header: "Revenue", cell: (r) => formatPrice(r.revenue), sortValue: (r) => r.revenue, align: "end" },
  { id: "aov", header: "AOV", cell: (r) => formatPrice(r.aov), sortValue: (r) => r.aov, align: "end", hideBelow: "lg" },
  { id: "cod", header: "COD share", cell: (r) => share(r.codShare), sortValue: (r) => r.codShare, align: "end" },
];

/** Cities ranked by revenue from the order book, scoped by the page filters. */
export function TopCitiesTable({ rows, onReset }: { rows: CityRow[]; onReset: () => void }) {
  return (
    <DataTable
      caption="Top cities by revenue"
      columns={columns}
      rows={rows}
      getRowId={(r) => r.city}
      defaultSort={{ id: "revenue", direction: "desc" }}
      pageSize={6}
      toolbar={<p className="text-caption text-fg-muted">Delivered, shipped and open orders; cancelled orders excluded.</p>}
      empty={{
        title: "No orders in this range",
        description: "Top cities fill in as orders arrive. Widen the date range or switch the channel to All.",
        action: (
          <Button variant="secondary" size="sm" onClick={onReset}>
            Show last 30 days, all channels
          </Button>
        ),
      }}
      renderCard={(r) => (
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-body-strong">{r.city}</p>
            <p className="text-caption text-fg-muted figures">
              {formatNumber(r.orders)} orders · AOV {formatPrice(r.aov)} · COD {share(r.codShare)}
            </p>
          </div>
          <span className="text-body-strong figures">{formatPrice(r.revenue)}</span>
        </div>
      )}
    />
  );
}
