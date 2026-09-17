"use client";

import { Search, X } from "lucide-react";
import { ChipGroup } from "@/components/ui/chip";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/cn";
import type { Order } from "@/lib/data/types";
import { orderGroup, orderLines, type OrderGroup } from "@/lib/orders";

export type OrderFilterState = { query: string; status: OrderGroup | "all"; range: "30d" | "6m" | "2026" | "2025" | "all" };

export const emptyOrderFilters: OrderFilterState = { query: "", status: "all", range: "all" };

/** `today` as yyyy-mm-dd for relative ranges. */
export function applyOrderFilters(orders: Order[], f: OrderFilterState, today: string) {
  const q = f.query.trim().toLowerCase();
  const since = (days: number) => {
    const d = new Date(`${today}T00:00:00`);
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
  };
  return orders.filter((o) => {
    if (f.status !== "all" && orderGroup(o) !== f.status) return false;
    if (f.range === "30d" && today && o.date < since(30)) return false;
    if (f.range === "6m" && today && o.date < since(183)) return false;
    if ((f.range === "2026" || f.range === "2025") && !o.date.startsWith(f.range)) return false;
    if (q && !`${o.id} ${orderLines(o).map((l) => `${l.product.name} ${l.product.brand}`).join(" ")}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

export type OrderFiltersProps = {
  orders: Order[];
  value: OrderFilterState;
  onChange: (next: OrderFilterState) => void;
  className?: string;
};

/** Search by order number or product, status chips with counts, and a time range. */
export function OrderFilters({ orders, value, onChange, className }: OrderFiltersProps) {
  const count = (g: OrderGroup) => orders.filter((o) => orderGroup(o) === g).length;
  return (
    <div data-slot="order-filters" className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div role="search" className="flex h-control-md min-w-0 flex-1 items-center gap-2 rounded-pill bg-surface px-4 shadow-flat focus-ring-inset">
          <Search aria-hidden className="size-icon-md shrink-0 text-fg-muted" />
          <input
            type="search"
            aria-label="Search orders"
            placeholder="Search by product or order number"
            value={value.query}
            onChange={(e) => onChange({ ...value, query: e.target.value })}
            className="h-full min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-fg-placeholder [&::-webkit-search-cancel-button]:hidden"
          />
          {value.query && (
            <button type="button" aria-label="Clear search" onClick={() => onChange({ ...value, query: "" })} className="state-layer hit-area relative flex size-6 items-center justify-center rounded-pill text-fg-muted">
              <X aria-hidden className="size-icon-sm" />
            </button>
          )}
        </div>
        <Select
          aria-label="Order date range"
          value={value.range}
          onValueChange={(v) => onChange({ ...value, range: v as OrderFilterState["range"] })}
          className="w-auto min-w-44"
          options={[
            { value: "all", label: "All time" },
            { value: "30d", label: "Last 30 days" },
            { value: "6m", label: "Last 6 months" },
            { value: "2026", label: "2026" },
            { value: "2025", label: "2025" },
          ]}
        />
      </div>
      <ChipGroup
        type="single"
        scroll
        aria-label="Order status"
        showCheck={false}
        value={value.status}
        onValueChange={(v: string) => onChange({ ...value, status: (v || "all") as OrderFilterState["status"] })}
        options={[
          { value: "all", label: "All", count: orders.length },
          { value: "active", label: "In progress", count: count("active") },
          { value: "delivered", label: "Delivered", count: count("delivered") },
          { value: "returned", label: "Returned", count: count("returned") },
          { value: "cancelled", label: "Cancelled", count: count("cancelled") },
        ]}
      />
    </div>
  );
}
