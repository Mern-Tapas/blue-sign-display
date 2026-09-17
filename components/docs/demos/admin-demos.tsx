"use client";

import { useState } from "react";
import { BadgePercent, Boxes, LayoutDashboard, MessageSquareText, Package, PackageCheck, RotateCcw, Search, Settings, ShoppingBag, Truck, Users, Wallet } from "lucide-react";
import { useDraft, DetailPanel, FilterBar, FormActionsBar, type FilterValues } from "@/components/admin/admin-parts";
import { openCommandPalette, SidebarNav, type AdminNavGroup } from "@/components/admin/admin-shell";
import { StatusPill } from "@/components/admin/admin-display";
import { CommandPalette, type CommandItem } from "@/components/admin/command-palette";
import { DataTable, type DataColumn } from "@/components/admin/data-table";
import { DateRangePicker } from "@/components/admin/date-range-picker";
import { BarChart } from "@/components/charts/bar-chart";
import { ChartFrame, ChartLegend } from "@/components/charts/chart-frame";
import { LineChart } from "@/components/charts/line-chart";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { toast } from "@/components/providers/toast-store";
import { adminDateTime } from "@/lib/admin-format";
import { ADMIN_TODAY, adminOrders, categorySales, dailySales, orderStatusMeta, type AdminOrder } from "@/lib/data/admin";
import { resolveRange, type DateRangeValue } from "@/lib/date-range";
import { formatPrice } from "@/lib/format";

/* ---------------------------------------------------------------- shell */

const demoNav: AdminNavGroup[] = [
  { items: [{ href: "/design-system/admin-shell", label: "Overview", icon: LayoutDashboard, exact: true }] },
  {
    label: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag, count: 15 },
      { href: "/admin/returns", label: "Returns", icon: RotateCcw, count: 6 },
      { href: "/admin/customers", label: "Customers", icon: Users },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/inventory", label: "Inventory", icon: Boxes, count: 5 },
      { href: "/admin/reviews", label: "Reviews", icon: MessageSquareText },
    ],
  },
  { label: "Money", items: [{ href: "/admin/coupons", label: "Coupons", icon: BadgePercent }, { href: "/admin/payouts", label: "Payouts & GST", icon: Wallet }, { href: "/admin/settings", label: "Settings", icon: Settings }] },
];

export function SidebarNavDemo() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="w-64 rounded-2xl bg-surface p-3 shadow-flat">
        <SidebarNav groups={demoNav} />
      </div>
      <div className="flex w-[4.5rem] justify-center rounded-2xl bg-surface p-3 shadow-flat">
        <SidebarNav groups={demoNav} collapsed />
      </div>
    </div>
  );
}

const demoCommands: CommandItem[] = [
  ...demoNav.flatMap((g) => g.items.map((i) => ({ id: i.href, label: i.label, group: "Pages", href: i.href, icon: <i.icon aria-hidden /> }))),
  { id: "a1", label: "Mark LM-200599 as packed", group: "Actions", icon: <PackageCheck aria-hidden />, onSelect: () => toast({ title: "LM-200599 marked as packed (demo)", tone: "success" }) },
  { id: "a2", label: "Ship LM-200594", group: "Actions", icon: <Truck aria-hidden />, onSelect: () => toast({ title: "Opening ship dialog (demo)" }) },
  ...adminOrders.slice(0, 12).map((o) => ({ id: o.id, label: o.id, hint: `${o.customerName} · ${o.city}`, group: "Orders", icon: <ShoppingBag aria-hidden />, onSelect: () => toast({ title: `Would open ${o.id}` }) })),
];

export function CommandPaletteDemo() {
  return (
    <>
      <Button variant="secondary" leadingIcon={<Search aria-hidden />} onClick={openCommandPalette}>
        Open command palette
      </Button>
      <p className="text-caption text-fg-muted">Or press Ctrl K / ⌘K while this page is focused (bound by AdminShell in /admin).</p>
      <CommandPalette items={demoCommands} />
    </>
  );
}

/* ---------------------------------------------------------------- tables & filters */

const columns: DataColumn<AdminOrder>[] = [
  {
    id: "order",
    header: "Order",
    sortValue: (o) => o.placedAt,
    cell: (o) => (
      <span className="flex flex-col">
        <span className="text-body-strong">{o.id}</span>
        <span className="text-caption text-fg-muted">{adminDateTime(o.placedAt)}</span>
      </span>
    ),
  },
  { id: "customer", header: "Customer", sortValue: (o) => o.customerName, cell: (o) => <span className="flex flex-col"><span>{o.customerName}</span><span className="text-caption text-fg-muted">{o.city}</span></span> },
  { id: "payment", header: "Payment", hideBelow: "lg", hideable: true, cell: (o) => o.payment },
  { id: "total", header: "Total", align: "end", sortValue: (o) => o.total, cell: (o) => formatPrice(o.total) },
  { id: "status", header: "Status", sortValue: (o) => o.status, cell: (o) => <StatusPill tone={orderStatusMeta[o.status].tone} label={orderStatusMeta[o.status].label} live={orderStatusMeta[o.status].live} /> },
  { id: "awb", header: "AWB", hideBelow: "xl", hideable: true, defaultHidden: true, cell: (o) => (o.awb ? <span className="text-code">{o.awb}</span> : <span className="text-fg-muted">—</span>) },
];

export function DataTableDemo() {
  const [state, setState] = useState<"data" | "loading" | "empty" | "error">("data");
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [range, setRange] = useState<DateRangeValue>(() => resolveRange("30d", ADMIN_TODAY));
  const rows = adminOrders
    .filter((o) => !q || `${o.id} ${o.customerName} ${o.awb ?? ""}`.toLowerCase().includes(q.toLowerCase()))
    .filter((o) => !filters.payment?.length || filters.payment.includes(o.payment));

  return (
    <div className="flex w-full flex-col gap-4">
      <SegmentedControl
        aria-label="Table state"
        size="sm"
        value={state}
        onValueChange={(v) => setState(v as typeof state)}
        options={[
          { value: "data", label: "Data" },
          { value: "loading", label: "Loading" },
          { value: "empty", label: "Empty" },
          { value: "error", label: "Error" },
        ]}
      />
      <DataTable
        caption="Orders"
        columns={columns}
        rows={state === "empty" ? [] : rows}
        getRowId={(o) => o.id}
        selectable
        defaultSort={{ id: "order", direction: "desc" }}
        pageSize={8}
        loading={state === "loading"}
        error={state === "error" ? "The orders service didn’t respond (demo)." : undefined}
        onRetry={() => setState("data")}
        empty={{ title: "No orders match", description: "Try another search or clear the payment filter." }}
        toolbar={
          <FilterBar
            search={q}
            onSearchChange={setQ}
            searchPlaceholder="Search order, customer, AWB"
            filters={[{ id: "payment", label: "Payment", options: ["UPI", "Card", "COD", "Net banking", "Wallet", "EMI"].map((p) => ({ value: p, label: p, count: adminOrders.filter((o) => o.payment === p).length })) }]}
            values={filters}
            onValuesChange={setFilters}
          >
            <DateRangePicker value={range} onValueChange={setRange} today={ADMIN_TODAY} className="h-control-sm" />
          </FilterBar>
        }
        bulkActions={(sel, clear) => (
          <>
            <Button size="sm" variant="inverse" onClick={() => { toast({ title: `${sel.length} orders marked as packed (demo)`, tone: "success" }); clear(); }}>
              Mark as packed
            </Button>
            <Button size="sm" variant="ghost" className="text-fg-inverse" onClick={() => toast({ title: `Labels for ${sel.length} orders queued (demo)` })}>
              Print labels
            </Button>
          </>
        )}
        renderCard={(o) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-body-strong">{o.id}</span>
              <span className="text-body-strong figures">{formatPrice(o.total)}</span>
            </div>
            <span className="text-caption text-fg-muted">{o.customerName} · {o.city}</span>
            <StatusPill tone={orderStatusMeta[o.status].tone} label={orderStatusMeta[o.status].label} className="self-start" />
          </div>
        )}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- charts */

export function LineChartDemo() {
  const [metric, setMetric] = useState<"revenue" | "orders">("revenue");
  const window = dailySales.slice(-30);
  return (
    <ChartFrame
      title={metric === "revenue" ? "Net sales" : "Orders"}
      description="Daily, last 30 days · demo data"
      action={
        <SegmentedControl
          aria-label="Metric"
          size="sm"
          value={metric}
          onValueChange={(v) => setMetric(v as typeof metric)}
          options={[
            { value: "revenue", label: "Net sales" },
            { value: "orders", label: "Orders" },
          ]}
        />
      }
      table={{ columns: ["Date", metric === "revenue" ? "Net sales" : "Orders"], rows: window.map((d) => [d.label, metric === "revenue" ? formatPrice(d.revenue) : String(d.orders)]) }}
      className="w-full"
    >
      <LineChart labels={window.map((d) => d.label)} series={[{ id: metric, label: metric === "revenue" ? "Net sales" : "Orders", slot: 0, values: window.map((d) => d[metric]) }]} area format={metric === "revenue" ? "inr" : "number"} summary={`Daily ${metric} for the last 30 days`} />
    </ChartFrame>
  );
}

export function GroupedBarDemo() {
  const [stacked, setStacked] = useState(false);
  const series = [
    { id: "now", label: "Last 30 days", slot: 0, values: categorySales.map((c) => c.revenue) },
    { id: "prev", label: "Previous 30 days", slot: 1, values: categorySales.map((c) => c.lastPeriod) },
  ];
  return (
    <ChartFrame
      title="Sales by category"
      description="Two series share one axis · demo data"
      action={<SegmentedControl aria-label="Layout" size="sm" value={stacked ? "stacked" : "grouped"} onValueChange={(v) => setStacked(v === "stacked")} options={[{ value: "grouped", label: "Grouped" }, { value: "stacked", label: "Stacked" }]} />}
      legend={<ChartLegend items={series.map((s) => ({ label: s.label, color: `var(--chart-${s.slot + 1})` }))} />}
      table={{ columns: ["Category", "Last 30 days", "Previous 30 days"], rows: categorySales.map((c) => [c.label, formatPrice(c.revenue), formatPrice(c.lastPeriod)]) }}
      className="w-full"
    >
      <BarChart categories={categorySales.map((c) => c.label)} series={series} stacked={stacked} format="inr" summary="Sales by category for the last 30 days compared with the previous 30 days" />
    </ChartFrame>
  );
}

/* ---------------------------------------------------------------- editors */

export function FormActionsDemo() {
  const { draft, setDraft, dirty, commit, discard } = useDraft({ name: "BlueSigns", email: "support@bluesigns.shop" });
  const [saving, setSaving] = useState(false);
  return (
    <form
      className="flex w-full max-w-lg flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        await new Promise((r) => setTimeout(r, 700));
        setSaving(false);
        commit();
        toast({ title: "Store profile saved (demo)", tone: "success" });
      }}
    >
      <Field label="Store name">
        <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
      </Field>
      <Field label="Support email">
        <Input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
      </Field>
      <p className="text-caption text-fg-muted">Edit a field to reveal the unsaved-changes bar.</p>
      <FormActionsBar dirty={dirty} saving={saving} onDiscard={discard} />
    </form>
  );
}

export function DetailPanelDemo() {
  const [open, setOpen] = useState<AdminOrder | null>(null);
  return (
    <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-start">
      <ul className="flex min-w-0 flex-1 flex-col divide-y divide-border-subtle rounded-2xl bg-surface shadow-flat">
        {adminOrders.slice(0, 5).map((o) => (
          <li key={o.id}>
            <button type="button" onClick={() => setOpen(o)} className="state-layer focus-ring-row relative flex h-row-lg w-full items-center gap-3 px-4 text-left aria-pressed:bg-selected" aria-pressed={open?.id === o.id}>
              <span className="flex-1 text-body-strong">{o.id}</span>
              <span className="text-body text-fg-muted">{o.customerName}</span>
              <span className="w-24 text-right text-body figures">{formatPrice(o.total)}</span>
            </button>
          </li>
        ))}
      </ul>
      <DetailPanel open={!!open} onOpenChange={(v) => !v && setOpen(null)} title={open?.id ?? ""} description={open ? `${open.customerName} · ${open.city}` : undefined} footer={<Button size="sm" fullWidth onClick={() => toast({ title: "Marked as packed (demo)", tone: "success" })}>Mark as packed</Button>}>
        {open && (
          <>
            <StatusPill tone={orderStatusMeta[open.status].tone} label={orderStatusMeta[open.status].label} className="self-start" />
            <ul className="flex flex-col gap-2 text-body">
              {open.lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span>{l.name} × {l.quantity}</span>
                  <span className="figures">{formatPrice(l.price * l.quantity)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </DetailPanel>
    </div>
  );
}
