"use client";

import { useState } from "react";
import Link from "next/link";
import { Archive, FilePen, Percent, Upload } from "lucide-react";
import { ProductImage } from "@/components/commerce/product-image";
import { toast } from "@/components/providers/toast-store";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AdminProduct } from "@/lib/data/admin";
import { formatNumber, formatPrice } from "@/lib/format";
import { FilterBar, type FilterValues } from "../admin-parts";
import { StatusPill } from "../admin-display";
import { DataTable, type DataColumn } from "../data-table";
import { AdjustPriceDialog, adjustedPrice } from "./adjust-price-dialog";
import { productStatusMeta, stockState, stockStateMeta, type ProductStatus } from "./catalog-data";
import { StockCell } from "./stock-cell";

type Tab = "all" | ProductStatus;

const tabs: { value: Tab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const emptyCopy: Record<Tab, { title: string; description: string }> = {
  all: { title: "No products match", description: "Try another name, SKU or brand, or clear the filters." },
  active: { title: "No active products match", description: "Publish a draft to list it on the storefront, or clear the filters." },
  draft: { title: "No drafts", description: "New products and imports wait here until you publish them." },
  archived: { title: "Nothing archived", description: "Archived products are hidden from the storefront but keep their order history." },
};

/** Catalogue list: status tabs, search and filters, bulk publish / draft / archive / price change. */
export function ProductsTable({ initialProducts }: { initialProducts: AdminProduct[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [archiveIds, setArchiveIds] = useState<string[] | null>(null);
  const [priceIds, setPriceIds] = useState<string[] | null>(null);
  /** The table's clear-selection callback, kept while a bulk dialog is open. */
  const [pendingClear, setPendingClear] = useState<(() => void) | null>(null);

  const categories = [...new Set(products.map((p) => p.category))].sort();
  const q = search.trim().toLowerCase();
  const cat = filters.category ?? [];
  const stock = filters.stock ?? [];
  const matching = products.filter(
    (p) =>
      (!q || [p.name, p.sku, p.brand].some((s) => s.toLowerCase().includes(q))) &&
      (cat.length === 0 || cat.includes(p.category)) &&
      (stock.length === 0 || stock.includes(stockState(p.stock, p.reorderPoint))),
  );
  const counts = Object.fromEntries(tabs.map((t) => [t.value, t.value === "all" ? products.length : products.filter((p) => p.status === t.value).length])) as Record<Tab, number>;
  const rows = tab === "all" ? matching : matching.filter((p) => p.status === tab);
  const filtered = Boolean(q) || cat.length > 0 || stock.length > 0;

  /** Apply a change to some products, with an Undo that restores exactly what was there. */
  function change(ids: string[], update: (p: AdminProduct) => AdminProduct, title: string, clear: () => void) {
    const before = products;
    setProducts((list) => list.map((p) => (ids.includes(p.id) ? update(p) : p)));
    clear();
    toast({ tone: "success", title, description: "Demo: saved in this browser tab only.", action: { label: "Undo", onClick: () => setProducts(before) } });
  }

  const plural = (n: number) => `${n} ${n === 1 ? "product" : "products"}`;

  const columns: DataColumn<AdminProduct>[] = [
    {
      id: "product",
      header: "Product",
      sortValue: (p) => p.name,
      cell: (p) => (
        <span className="flex items-center gap-3">
          <ProductImage src={p.image} alt="" sizes="40px" wrapperClassName="size-10 shrink-0 rounded-sm" />
          <span className="flex min-w-0 flex-col">
            <span className="max-w-64 truncate text-body-strong">{p.name}</span>
            <span className="text-caption text-fg-muted">{p.brand}</span>
          </span>
        </span>
      ),
    },
    { id: "sku", header: "SKU", sortValue: (p) => p.sku, hideable: true, hideBelow: "lg", cell: (p) => <span className="text-code text-fg-muted">{p.sku}</span> },
    { id: "category", header: "Category", sortValue: (p) => p.category, hideable: true, cell: (p) => p.category },
    {
      id: "price",
      header: "Price",
      align: "end",
      sortValue: (p) => p.price,
      cell: (p) => (
        <span className="inline-flex flex-col items-end">
          <span>{formatPrice(p.price)}</span>
          {p.mrp > p.price && (
            <span className="text-caption text-fg-muted line-through">
              <span className="sr-only">MRP </span>
              {formatPrice(p.mrp)}
            </span>
          )}
        </span>
      ),
    },
    { id: "stock", header: "Stock", align: "end", sortValue: (p) => p.stock, cell: (p) => <StockCell stock={p.stock} reorderPoint={p.reorderPoint} /> },
    {
      id: "gst",
      header: "GST · HSN",
      hideBelow: "xl",
      hideable: true,
      sortValue: (p) => p.gstRate,
      cell: (p) => (
        <span className="text-fg-muted figures">
          {p.gstRate}% · <span className="text-code">{p.hsn}</span>
        </span>
      ),
    },
    { id: "sold", header: "Sold 30d", align: "end", hideBelow: "lg", hideable: true, sortValue: (p) => p.sold30d, cell: (p) => formatNumber(p.sold30d) },
    { id: "status", header: "Status", sortValue: (p) => p.status, cell: (p) => <StatusPill tone={productStatusMeta[p.status].tone} label={productStatusMeta[p.status].label} /> },
  ];

  const archiving = products.filter((p) => archiveIds?.includes(p.id));
  const pricing = products.filter((p) => priceIds?.includes(p.id));

  const table = (
    <DataTable
      caption="Products"
      columns={columns}
      rows={rows}
      getRowId={(p) => p.id}
      rowHref={(p) => `/admin/products/${p.id}`}
      defaultSort={{ id: "product", direction: "asc" }}
      selectable
      toolbar={
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search name, SKU or brand"
          filters={[
            { id: "category", label: "Category", options: categories.map((c) => ({ value: c, label: c, count: products.filter((p) => p.category === c).length })) },
            {
              id: "stock",
              label: "Stock",
              options: (["in", "low", "out"] as const).map((s) => ({ value: s, label: stockStateMeta[s].label, count: products.filter((p) => stockState(p.stock, p.reorderPoint) === s).length })),
            },
          ]}
          values={filters}
          onValuesChange={setFilters}
        />
      }
      empty={{
        ...emptyCopy[tab],
        action: filtered ? (
          <Button variant="secondary" size="sm" onClick={() => { setSearch(""); setFilters({}); }}>
            Clear search and filters
          </Button>
        ) : tab === "draft" ? (
          <Button asChild variant="secondary" size="sm">
            <Link href="/admin/products/new">Add product</Link>
          </Button>
        ) : undefined,
      }}
      bulkActions={(selected, clear) => {
        const ids = selected.map((p) => p.id);
        const bulk = "text-fg-inverse";
        return (
          <>
            <Button variant="ghost" size="sm" className={bulk} leadingIcon={<Upload aria-hidden />} onClick={() => change(ids, (p) => ({ ...p, status: "active" }), `Published ${plural(ids.length)}`, clear)}>
              Publish
            </Button>
            <Button variant="ghost" size="sm" className={bulk} leadingIcon={<FilePen aria-hidden />} onClick={() => change(ids, (p) => ({ ...p, status: "draft" }), `Moved ${plural(ids.length)} to draft`, clear)}>
              Move to draft
            </Button>
            <Button variant="ghost" size="sm" className={bulk} leadingIcon={<Percent aria-hidden />} onClick={() => { setPendingClear(() => clear); setPriceIds(ids); }}>
              Adjust price
            </Button>
            <Button variant="ghost" size="sm" className={bulk} leadingIcon={<Archive aria-hidden />} onClick={() => { setPendingClear(() => clear); setArchiveIds(ids); }}>
              Archive
            </Button>
          </>
        );
      }}
      renderCard={(p) => (
        <div className="flex gap-3">
          <ProductImage src={p.image} alt="" sizes="56px" wrapperClassName="size-14 shrink-0 rounded-sm" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Link href={`/admin/products/${p.id}`} className="focus-ring-card truncate text-body-strong [--focus-card-radius:var(--radius-xs)] after:absolute after:inset-0">
              {p.name}
            </Link>
            <p className="truncate text-caption text-fg-muted">
              {p.brand} · <span className="text-code">{p.sku}</span>
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="text-body figures">{formatPrice(p.price)}</span>
              <StockCell stock={p.stock} reorderPoint={p.reorderPoint} suffix="in stock" className="text-caption text-fg-muted" />
              <StatusPill tone={productStatusMeta[p.status].tone} label={productStatusMeta[p.status].label} className="ml-auto" />
            </div>
          </div>
        </div>
      )}
    />
  );

  return (
    <>
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="gap-4">
        <TabsList variant="underline" aria-label="Product status">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value} count={counts[t.value]}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((t) => (
          <TabsContent key={t.value} value={t.value} className="min-w-0">
            {t.value === tab && table}
          </TabsContent>
        ))}
      </Tabs>

      <ConfirmDialog
        open={archiveIds !== null}
        onOpenChange={(o) => !o && setArchiveIds(null)}
        tone="danger"
        icon={<Archive aria-hidden />}
        title={`Archive ${plural(archiving.length)}?`}
        description="Archived products disappear from the storefront and search. Order history and reports keep them. You can restore them from the Archived tab."
        confirmLabel="Archive"
        onConfirm={() => {
          change(archiveIds ?? [], (p) => ({ ...p, status: "archived" }), `Archived ${plural(archiving.length)}`, pendingClear ?? (() => {}));
          setArchiveIds(null);
        }}
      />

      <AdjustPriceDialog
        open={priceIds !== null}
        onOpenChange={(o) => !o && setPriceIds(null)}
        products={pricing}
        onApply={(percent, roundTo9) => {
          change(priceIds ?? [], (p) => ({ ...p, price: adjustedPrice(p, percent, roundTo9) }), `Updated prices for ${plural(pricing.length)}`, pendingClear ?? (() => {}));
          setPriceIds(null);
        }}
      />
    </>
  );
}
