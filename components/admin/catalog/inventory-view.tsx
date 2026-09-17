"use client";

import { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { BarChart } from "@/components/charts/bar-chart";
import { ChartFrame } from "@/components/charts/chart-frame";
import { ProductImage } from "@/components/commerce/product-image";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { adminRelative } from "@/lib/admin-format";
import { ADMIN_TODAY, inrCompact } from "@/lib/data/admin";
import { formatNumber } from "@/lib/format";
import { ActivityFeed, StatusPill, type ActivityItem } from "../admin-display";
import { FilterBar, type FilterValues } from "../admin-parts";
import { DataTable, type DataColumn } from "../data-table";
import { KpiRow, KpiTile } from "../metrics";
import { AdjustStockDialog, stockReasons, type StockAdjustment } from "./adjust-stock-dialog";
import { seedAdjustments, stockState, stockStateMeta, type InventoryRow, type StockState } from "./catalog-data";

export type InventoryFilter = "all" | StockState;

const filterChips: { value: InventoryFilter; label: string }[] = [
  { value: "all", label: "All SKUs" },
  { value: "low", label: "Low stock" },
  { value: "out", label: "Out of stock" },
  { value: "in", label: "In stock" },
];

const variantName = (r: InventoryRow) => (r.variant === "Default" ? r.productName : `${r.productName} (${r.variant})`);
const shortLabel = (r: InventoryRow) => {
  const full = variantName(r);
  return full.length > 21 ? `${full.slice(0, 20).trimEnd()}…` : full;
};

/** Stock on hand per SKU: KPIs, state chips, adjustable table, days of cover and the adjustment log. */
export function InventoryView({ initialRows, initialFilter }: { initialRows: InventoryRow[]; initialFilter: InventoryFilter }) {
  const [rows, setRows] = useState(initialRows);
  const [filter, setFilter] = useState<InventoryFilter>(initialFilter);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [target, setTarget] = useState<InventoryRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [log, setLog] = useState<ActivityItem[]>(seedAdjustments);

  const stateOf = (r: InventoryRow) => stockState(r.onHand, r.reorderPoint);
  const counts = rows.reduce<Record<InventoryFilter, number>>((acc, r) => ({ ...acc, [stateOf(r)]: acc[stateOf(r)] + 1 }), { all: rows.length, low: 0, out: 0, in: 0 });
  const stockValue = rows.reduce((s, r) => s + r.onHand * r.price, 0);
  const productCount = new Set(rows.map((r) => r.productId)).size;

  const q = search.trim().toLowerCase();
  const cats = filters.category ?? [];
  const visible = rows.filter(
    (r) => (filter === "all" || stateOf(r) === filter) && (!q || [r.productName, r.sku, r.variant].some((s) => s.toLowerCase().includes(q))) && (cats.length === 0 || cats.includes(r.category)),
  );

  const cover = rows
    .filter((r) => r.onHand > 0 && r.dailyRate > 0)
    .map((r) => ({ row: r, days: Math.round((r.onHand / r.dailyRate) * 10) / 10 }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 6);

  function selectFilter(next: InventoryFilter) {
    setFilter(next);
    const url = next === "all" ? window.location.pathname : `${window.location.pathname}?filter=${next}`;
    window.history.replaceState(null, "", url);
  }

  function openAdjust(r: InventoryRow) {
    setTarget(r);
    setDialogOpen(true);
  }

  function save(row: InventoryRow, { delta, reason, note }: StockAdjustment) {
    const before = rows;
    const beforeLog = log;
    const nextOnHand = row.onHand + delta;
    setRows((list) => list.map((r) => (r.sku === row.sku ? { ...r, onHand: nextOnHand } : r)));
    const now = new Date();
    const at = new Date(ADMIN_TODAY.getFullYear(), ADMIN_TODAY.getMonth(), ADMIN_TODAY.getDate(), now.getHours(), now.getMinutes()).toISOString();
    const verb = reason === "received" ? `received ${delta} units of` : reason === "damaged" ? `wrote off ${-delta} units of` : `corrected`;
    setLog((l) => [
      {
        id: `adj-${row.sku}-${l.length}`,
        actor: "You",
        action: `${verb} ${variantName(row)}${reason === "correction" ? `, ${delta > 0 ? "+" : "−"}${Math.abs(delta)} units` : ""}${note ? ` · “${note}”` : ""}`,
        at,
        tone: reason === "received" ? "success" : reason === "damaged" ? "danger" : "neutral",
      },
      ...l,
    ]);
    toast({
      tone: "success",
      title: `Stock updated: ${formatNumber(row.onHand)} → ${formatNumber(nextOnHand)}`,
      description: `${variantName(row)} · ${stockReasons[reason].label}. Demo only.`,
      action: { label: "Undo", onClick: () => { setRows(before); setLog(beforeLog); } },
    });
  }

  const columns: DataColumn<InventoryRow>[] = [
    {
      id: "product",
      header: "Product",
      sortValue: (r) => r.productName,
      cell: (r) => (
        <span className="flex items-center gap-3">
          <ProductImage src={r.image} alt="" sizes="36px" wrapperClassName="size-9 shrink-0 rounded-sm" />
          <Link href={`/admin/products/${r.productId}`} className="max-w-56 truncate text-body-strong hover:underline">
            {r.productName}
          </Link>
        </span>
      ),
    },
    { id: "variant", header: "Variant", sortValue: (r) => r.variant, cell: (r) => (r.variant === "Default" ? <span className="text-fg-muted">—</span> : r.variant) },
    { id: "sku", header: "SKU", sortValue: (r) => r.sku, hideBelow: "lg", hideable: true, cell: (r) => <span className="text-code text-fg-muted">{r.sku}</span> },
    { id: "onHand", header: "On hand", align: "end", sortValue: (r) => r.onHand, cell: (r) => <span className="text-body-strong">{formatNumber(r.onHand)}</span> },
    { id: "reorder", header: "Reorder at", align: "end", hideBelow: "xl", hideable: true, sortValue: (r) => r.reorderPoint, cell: (r) => <span className="text-fg-muted">{formatNumber(r.reorderPoint)}</span> },
    { id: "status", header: "Status", sortValue: (r) => ["out", "low", "in"].indexOf(stateOf(r)), cell: (r) => <StatusPill tone={stockStateMeta[stateOf(r)].tone} label={stockStateMeta[stateOf(r)].label} /> },
    {
      id: "actions",
      header: "Adjust",
      align: "end",
      cell: (r) => (
        <Button variant="secondary" size="sm" onClick={() => openAdjust(r)} aria-label={`Adjust stock for ${variantName(r)}`}>
          Adjust
        </Button>
      ),
    },
  ];

  const categories = [...new Set(rows.map((r) => r.category))].sort();

  return (
    <>
      <KpiRow>
        <KpiTile label="SKUs tracked" value={formatNumber(rows.length)} note={`across ${productCount} products`} />
        <KpiTile label="Out of stock" value={formatNumber(counts.out)} note={counts.out ? "SKUs that can’t be ordered" : "Every SKU can be ordered"} />
        <KpiTile label="Low stock" value={formatNumber(counts.low)} note="at or below reorder point" />
        <KpiTile label="Stock value" value={inrCompact(stockValue)} note="units on hand × selling price" />
      </KpiRow>

      <section aria-labelledby="stock-table-title" className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="stock-table-title" className="text-title">
            Stock by SKU
          </h2>
          <div role="group" aria-label="Filter by stock status" className="scrollbar-none -mx-1 flex max-w-full gap-2 overflow-x-auto px-1 py-1">
            {filterChips.map((c) => (
              <Chip key={c.value} selected={filter === c.value} count={counts[c.value]} onClick={() => selectFilter(c.value)}>
                {c.label}
              </Chip>
            ))}
          </div>
        </div>

        <DataTable
          caption="Stock by SKU"
          columns={columns}
          rows={visible}
          getRowId={(r) => r.sku}
          defaultSort={{ id: "onHand", direction: "asc" }}
          density="compact"
          pageSize={12}
          toolbar={
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search product, variant or SKU"
              filters={[{ id: "category", label: "Category", options: categories.map((c) => ({ value: c, label: c, count: rows.filter((r) => r.category === c).length })) }]}
              values={filters}
              onValuesChange={setFilters}
            />
          }
          empty={{
            title: filter === "out" && !q ? "Nothing is out of stock" : filter === "low" && !q ? "No SKUs are running low" : "No SKUs match",
            description: filter !== "all" && !q ? "Every SKU in this view is above its reorder point." : "Try another product name or SKU, or show all SKUs.",
            action: (
              <Button variant="secondary" size="sm" onClick={() => { selectFilter("all"); setSearch(""); setFilters({}); }}>
                Show all SKUs
              </Button>
            ),
          }}
          renderCard={(r) => {
            const state = stateOf(r);
            return (
              <div className="flex gap-3">
                <ProductImage src={r.image} alt="" sizes="48px" wrapperClassName="size-12 shrink-0 rounded-sm" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Link href={`/admin/products/${r.productId}`} className="truncate text-body-strong">
                    {variantName(r)}
                  </Link>
                  <p className="truncate text-code text-fg-muted">{r.sku}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="text-body figures">
                      {formatNumber(r.onHand)} <span className="text-caption text-fg-muted">on hand · reorder at {r.reorderPoint}</span>
                    </span>
                    <StatusPill tone={stockStateMeta[state].tone} label={stockStateMeta[state].label} />
                    <Button variant="secondary" size="sm" className="ml-auto" leadingIcon={<SlidersHorizontal aria-hidden />} onClick={() => openAdjust(r)} aria-label={`Adjust stock for ${variantName(r)}`}>
                      Adjust
                    </Button>
                  </div>
                </div>
              </div>
            );
          }}
        />
      </section>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <ChartFrame
          title="Lowest cover"
          description="Days until each SKU sells out at its last-30-day pace"
          table={{ columns: ["SKU", "On hand", "Sold per day", "Days of cover"], rows: cover.map((c) => [variantName(c.row), formatNumber(c.row.onHand), formatNumber(c.row.dailyRate, { maximumFractionDigits: 1 }), formatNumber(c.days, { maximumFractionDigits: 1 })]) }}
          empty={cover.length === 0 ? <EmptyState compact title="No selling SKUs in stock" description="Cover appears once SKUs with sales have units on hand." /> : undefined}
        >
          <BarChart
            orientation="horizontal"
            categories={cover.map((c) => shortLabel(c.row))}
            series={[{ id: "days", label: "Days of cover", slot: 0, values: cover.map((c) => c.days) }]}
            valueLabels
            summary={`Six in-stock SKUs with the fewest days of cover. Lowest: ${cover[0] ? `${variantName(cover[0].row)}, ${cover[0].days} days` : "none"}.`}
          />
          <p className="text-caption text-fg-muted">Reorder anything under your supplier’s lead time. Most apparel suppliers in Tiruppur need 10–14 days.</p>
        </ChartFrame>

        <Card padding="md" className="gap-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-title">Adjustment log</h2>
            <span className="text-caption text-fg-muted">Demo</span>
          </div>
          <ActivityFeed items={log.slice(0, 6)} formatTime={(iso) => adminRelative(iso, ADMIN_TODAY)} />
        </Card>
      </div>

      <AdjustStockDialog row={target} open={dialogOpen} onOpenChange={setDialogOpen} onSave={save} />
    </>
  );
}
