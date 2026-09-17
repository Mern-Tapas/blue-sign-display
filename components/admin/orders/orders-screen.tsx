"use client";

import { useMemo, useRef, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { adminDateTime } from "@/lib/admin-format";
import { ADMIN_DEMO_NOTE, ADMIN_TODAY, adminOrders, orderStatusMeta, type AdminOrder } from "@/lib/data/admin";
import { resolveRange, type DateRangeValue } from "@/lib/date-range";
import { formatNumber } from "@/lib/format";
import { FilterBar, type FilterValues } from "../admin-parts";
import { DateRangePicker } from "../date-range-picker";
import { PageHeader } from "../page-header";
import { downloadCsv } from "./download-csv";
import { isShipByAtRisk, orderInTab, orderTabs, type OrderTab } from "./order-helpers";
import { OrdersTable } from "./orders-table";
import { StatusTabs } from "./status-tabs";

const localDay = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const emptyCopy: Partial<Record<OrderTab, { title: string; description: string }>> = {
  pending: { title: "No payments pending", description: "UPI orders wait here until the customer completes payment. Unpaid orders are cancelled automatically after 30 minutes." },
  "to-pack": { title: "Nothing to pack", description: "Confirmed orders land here as soon as payment clears. Pack them before their ship-by time." },
  ready: { title: "Nothing waiting for pickup", description: "Mark orders as packed and they queue here until you add a courier and AWB." },
  shipped: { title: "No orders in transit", description: "Orders move here once they have a courier and AWB, and leave when delivered or returned to origin." },
  delivered: { title: "No deliveries in this range", description: "Try a longer date range." },
  closed: { title: "No cancellations or RTOs", description: "Cancelled, returned and RTO orders in this date range show up here." },
};

export type OrdersScreenProps = {
  initialTab: OrderTab;
  /** `?sla=risk` from the overview: only orders whose ship-by is within 24 h. */
  initialSlaRisk: boolean;
};

/** /admin/orders: fulfilment queue tabs, search and filters, and the orders table with bulk actions. */
export function OrdersScreen({ initialTab, initialSlaRisk }: OrdersScreenProps) {
  const [orders, setOrders] = useState<AdminOrder[]>(adminOrders);
  const [tab, setTab] = useState<OrderTab>(initialTab);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>(() => (initialSlaRisk ? { sla: ["risk"] } : ({} as FilterValues)));
  const [range, setRange] = useState<DateRangeValue>(() => resolveRange("30d", ADMIN_TODAY));
  const [refreshing, setRefreshing] = useState(false);
  const refreshTimer = useRef<number | undefined>(undefined);

  const syncUrl = (next: { status?: OrderTab; sla?: boolean }) => {
    const url = new URL(window.location.href);
    if (next.status !== undefined) {
      if (next.status === "all") url.searchParams.delete("status");
      else url.searchParams.set("status", next.status);
    }
    if (next.sla !== undefined) {
      if (next.sla) url.searchParams.set("sla", "risk");
      else url.searchParams.delete("sla");
    }
    window.history.replaceState(null, "", url);
  };

  const base = useMemo(() => {
    const q = search.trim().toLowerCase();
    const pay = filters.payment ?? [];
    const channel = filters.channel ?? [];
    const risk = (filters.sla ?? []).includes("risk");
    return orders.filter((o) => {
      const day = localDay(o.placedAt);
      if (day < range.from || day > range.to) return false;
      if (pay.length && !pay.includes(o.payment)) return false;
      if (channel.length && !channel.includes(o.channel)) return false;
      if (risk && !isShipByAtRisk(o)) return false;
      if (q && !`${o.id} ${o.customerName} ${o.awb ?? ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [orders, search, filters, range]);

  const counts = useMemo(
    () => Object.fromEntries(orderTabs.map((t) => [t.id, base.filter((o) => orderInTab(o, t.id)).length])) as Record<OrderTab, number>,
    [base],
  );
  const rows = useMemo(() => base.filter((o) => orderInTab(o, tab)), [base, tab]);

  const countBy = (key: "payment" | "channel", value: string) => orders.filter((o) => o[key] === value).length;
  const filterDefs = [
    { id: "payment", label: "Payment", options: ["UPI", "Card", "COD", "Net banking", "Wallet", "EMI"].map((v) => ({ value: v, label: v === "COD" ? "Cash on delivery" : v, count: countBy("payment", v) })) },
    { id: "channel", label: "Channel", options: ["App", "Web"].map((v) => ({ value: v, label: v, count: countBy("channel", v) })) },
    { id: "sla", label: "Ship-by", options: [{ value: "risk", label: "Within 24 h or overdue", count: orders.filter((o) => isShipByAtRisk(o)).length }] },
  ];

  const filtered = search.trim() !== "" || Object.values(filters).some((v) => v.length > 0);
  const clearFilters = () => {
    setSearch("");
    setFilters({});
    syncUrl({ sla: false });
  };

  const exportRows = (list: AdminOrder[], label: string) => {
    downloadCsv(
      `bluesigns-orders-${range.from}-to-${range.to}.csv`,
      ["Order", "Placed", "Customer", "City", "PIN code", "Items", "Payment", "Payment status", "Total (INR)", "Status", "Ship by", "Courier", "AWB"],
      list.map((o) => [o.id, adminDateTime(o.placedAt), o.customerName, o.city, o.pincode, o.lines.reduce((s, l) => s + l.quantity, 0), o.payment, o.paymentStatus, o.total, orderStatusMeta[o.status].label, adminDateTime(o.shipBy), o.courier, o.awb]),
    );
    toast({ title: `Exported ${formatNumber(list.length)} ${list.length === 1 ? "order" : "orders"}`, description: `${label} · CSV saved to your downloads.`, tone: "success" });
  };

  const markPacked = (selected: AdminOrder[]) => {
    const ids = new Set(selected.filter((o) => o.status === "confirmed").map((o) => o.id));
    const skipped = selected.length - ids.size;
    if (ids.size === 0) {
      toast({ title: "Nothing to pack", description: "Only orders in To pack can be marked as packed.", tone: "neutral" });
      return;
    }
    setOrders((prev) => prev.map((o) => (ids.has(o.id) ? { ...o, status: "packed" } : o)));
    toast({
      title: `${ids.size} ${ids.size === 1 ? "order" : "orders"} marked as packed`,
      description: skipped ? `${skipped} skipped: not in To pack.` : "They’re now in Ready to ship.",
      tone: "success",
      action: { label: "Undo", onClick: () => setOrders((prev) => prev.map((o) => (ids.has(o.id) ? { ...o, status: "confirmed" } : o))) },
    });
  };

  const printLabels = (selected: AdminOrder[]) => {
    const ready = selected.filter((o) => ["packed", "shipped", "out-for-delivery"].includes(o.status));
    if (ready.length === 0) {
      toast({ title: "No labels to print", description: "Shipping labels are available once an order is packed.", tone: "neutral" });
      return;
    }
    const skipped = selected.length - ready.length;
    toast({
      title: `${ready.length} shipping ${ready.length === 1 ? "label" : "labels"} sent to the printer`,
      description: `4 × 6 in thermal labels${skipped ? ` · ${skipped} skipped: not packed yet` : ""}.`,
      tone: "success",
    });
  };

  const changeRange = (next: DateRangeValue) => {
    setRange(next);
    setRefreshing(true);
    window.clearTimeout(refreshTimer.current);
    refreshTimer.current = window.setTimeout(() => setRefreshing(false), 400);
  };

  const copy = filtered
    ? { title: "No orders match these filters", description: "Try another search or date range, or clear the filters.", action: <Button variant="secondary" size="sm" onClick={clearFilters}>Clear filters</Button> }
    : (emptyCopy[tab] ?? { title: "No orders in this range", description: "Orders placed in the selected date range appear here." });

  const tabLabel = orderTabs.find((t) => t.id === tab)!.label;

  return (
    <>
      <PageHeader
        title="Orders"
        meta={
          <>
            <span className="figures">
              {formatNumber(counts["to-pack"])} to pack · {formatNumber(counts.ready)} ready to ship
            </span>
            <span aria-hidden>·</span>
            <span>{ADMIN_DEMO_NOTE}</span>
          </>
        }
        actions={
          <Button variant="secondary" leadingIcon={<Download aria-hidden />} onClick={() => exportRows(rows, tabLabel)} disabled={rows.length === 0}>
            Export
          </Button>
        }
      />

      <StatusTabs
        label="Order status"
        tabs={orderTabs}
        value={tab}
        counts={counts}
        hideWhenEmpty={["pending"]}
        onValueChange={(t) => {
          setTab(t);
          syncUrl({ status: t });
        }}
      >
        <OrdersTable
          key={tab}
          rows={rows}
          loading={refreshing}
          empty={copy}
          onMarkPacked={markPacked}
          onPrintLabels={printLabels}
          onExport={(list) => exportRows(list, "Selected orders")}
          toolbar={
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search ID, customer or AWB"
              filters={filterDefs}
              values={filters}
              onValuesChange={(v) => {
                setFilters(v);
                syncUrl({ sla: (v.sla ?? []).includes("risk") });
              }}
            >
              <DateRangePicker value={range} onValueChange={changeRange} today={ADMIN_TODAY} comparable={false} className="h-control-sm px-3.5 text-label" />
            </FilterBar>
          }
        />
      </StatusTabs>
    </>
  );
}
