"use client";

import { useState } from "react";
import Link from "next/link";
import { GitCompareArrows, X } from "lucide-react";
import { PriceDisplay } from "@/components/commerce/price-display";
import { ProductImage } from "@/components/commerce/product-image";
import { compare, COMPARE_MAX, useCompare } from "@/components/providers/compare-store";
import { toast } from "@/components/providers/toast-store";
import { RatingPill } from "@/components/reviews/rating-pill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogBody, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableContainer, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/data/types";

type CompareProduct = Pick<Product, "id" | "slug" | "name" | "brand" | "category" | "images" | "price" | "compareAt" | "rating" | "reviewCount" | "colors" | "sizes" | "stock" | "features" | "deliveryDays">;

/* ---------- Toggle on a card ---------- */

export function CompareToggle({ product, categoryName }: { product: CompareProduct; categoryName?: string }) {
  const { slugs } = useCompare();
  const checked = slugs.includes(product.slug);
  return (
    <Checkbox
      size="sm"
      label={<span className="text-caption text-fg-muted">Compare</span>}
      checked={checked}
      onCheckedChange={() => {
        const r = compare.toggle(product.slug, product.category);
        if (r === "full") toast({ title: `You can compare up to ${COMPARE_MAX} products`, description: "Remove one from the compare tray first.", tone: "info" });
        if (r === "category")
          toast({
            title: "Compare products from one category",
            description: `Start a new comparison with ${product.name}?`,
            tone: "info",
            action: { label: "Start new", onClick: () => compare.replaceWith(product.slug, product.category) },
          });
      }}
      aria-label={`Compare ${product.name}${categoryName ? ` in ${categoryName}` : ""}`}
    />
  );
}

/* ---------- Table ---------- */

export type CompareTableProps = { products: CompareProduct[]; onRemove?: (slug: string) => void };

/** Side-by-side attributes with an option to show only rows that differ. */
export function CompareTable({ products, onRemove }: CompareTableProps) {
  const [diffOnly, setDiffOnly] = useState(false);
  const rows: { label: string; value: (p: CompareProduct) => React.ReactNode; key: (p: CompareProduct) => string }[] = [
    { label: "Price", value: (p) => <PriceDisplay amount={p.price} compareAt={p.compareAt} size="sm" showDiscount />, key: (p) => `${p.price}-${p.compareAt}` },
    { label: "Rating", value: (p) => <RatingPill value={p.rating} count={p.reviewCount} />, key: (p) => String(p.rating) },
    { label: "Brand", value: (p) => p.brand, key: (p) => p.brand },
    { label: "Colours", value: (p) => p.colors?.map((c) => c.name).join(", ") || "—", key: (p) => p.colors?.map((c) => c.name).join() ?? "" },
    { label: "Sizes", value: (p) => p.sizes?.join(", ") || "—", key: (p) => p.sizes?.join() ?? "" },
    { label: "Delivery", value: (p) => (p.deliveryDays === 1 ? "Tomorrow" : `${p.deliveryDays ?? "—"} days`), key: (p) => String(p.deliveryDays) },
    { label: "Availability", value: (p) => (p.stock === 0 ? "Sold out" : p.stock <= 5 ? `Only ${p.stock} left` : "In stock"), key: (p) => String(Math.min(p.stock, 6)) },
    {
      label: "Highlights",
      value: (p) => (
        <ul className="flex list-disc flex-col gap-1 pl-4">
          {p.features.slice(0, 3).map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      ),
      key: (p) => p.features.join(),
    },
  ];
  const visibleRows = diffOnly ? rows.filter((r) => new Set(products.map(r.key)).size > 1) : rows;

  return (
    <div data-slot="compare-table" className="flex flex-col gap-4">
      <Switch size="sm" label="Show only differences" checked={diffOnly} onCheckedChange={setDiffOnly} />
      <TableContainer>
        <Table className="min-w-[40rem] table-fixed text-left">
          <caption className="sr-only">Product comparison</caption>
          <thead>
            <tr className="border-b border-border-subtle">
              <th scope="col" className="w-32 bg-surface-sunken p-3 align-bottom text-overline text-fg-muted">
                {products.length} products
              </th>
              {products.map((p) => (
                <th key={p.slug} scope="col" className="relative p-3 align-top font-normal">
                  <div className="flex flex-col gap-2">
                    <ProductImage src={p.images[0]!} alt="" sizes="160px" wrapperClassName="aspect-square w-full max-w-36 rounded-lg" />
                    <Link href={`/products/${p.slug}`} className="line-clamp-2 rounded-xs text-label text-fg underline-offset-4 hover:underline">
                      {p.name}
                    </Link>
                  </div>
                  {onRemove && (
                    <button
                      type="button"
                      aria-label={`Remove ${p.name} from comparison`}
                      onClick={() => onRemove(p.slug)}
                      className="state-layer hit-area absolute top-4 right-4 flex size-control-xs items-center justify-center rounded-pill bg-surface text-fg-muted shadow-xs hover:text-fg"
                    >
                      <X aria-hidden className="size-icon-sm" />
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <TableBody>
            {visibleRows.map((r) => (
              <TableRow key={r.label} className="align-top">
                <th scope="row" className="bg-surface-sunken p-3 text-label text-fg-muted">
                  {r.label}
                </th>
                {products.map((p) => (
                  <td key={p.slug} className="p-3 text-fg">
                    {r.value(p)}
                  </td>
                ))}
              </TableRow>
            ))}
            {visibleRows.length === 0 && (
              <tr>
                <td colSpan={products.length + 1} className="p-6 text-center text-fg-muted">
                  These products match on every attribute shown.
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

/* ---------- Tray ---------- */

export type CompareTrayProps = {
  /** Catalogue to resolve stored slugs. */
  products: CompareProduct[];
  className?: string;
};

/**
 * Floating tray once one or more products are picked: thumbnails with remove, empty slots up to
 * the limit, Clear and Compare (needs two). Sits above the phone bottom nav.
 */
export function CompareTray({ products, className }: CompareTrayProps) {
  const { slugs } = useCompare();
  const [open, setOpen] = useState(false);
  const picked = slugs.map((s) => products.find((p) => p.slug === s)).filter((p): p is CompareProduct => Boolean(p));
  if (picked.length === 0) return null;

  return (
    <>
      <Card
        asChild
        padding="none"
        className={cn(
          "fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-(--z-sticky) mx-auto max-w-2xl animate-slide-up flex-row items-center gap-3 p-2.5 pl-4 shadow-modal lg:bottom-4",
          className,
        )}
      >
      <section aria-label="Compare tray" data-slot="compare-tray">
        <GitCompareArrows aria-hidden className="hidden size-icon-lg shrink-0 text-accent-fg sm:block" />
        <ul className="flex min-w-0 flex-1 items-center gap-2">
          {Array.from({ length: COMPARE_MAX }, (_, i) => {
            const p = picked[i];
            return (
              <li key={p?.slug ?? `empty-${i}`} className="relative">
                {p ? (
                  <>
                    <ProductImage src={p.images[0]!} alt={p.name} sizes="48px" wrapperClassName="size-12 rounded-md" />
                    <button
                      type="button"
                      aria-label={`Remove ${p.name}`}
                      onClick={() => compare.remove(p.slug)}
                      className="hit-area absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-pill bg-surface-inverse text-fg-inverse"
                    >
                      <X aria-hidden className="size-3" />
                    </button>
                  </>
                ) : (
                  <span aria-hidden className="flex size-12 items-center justify-center rounded-md border border-dashed border-border-strong text-caption text-fg-muted">
                    +
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <Button variant="ghost" size="sm" onClick={compare.clear}>
          Clear
        </Button>
        <Button size="md" disabled={picked.length < 2} onClick={() => setOpen(true)}>
          Compare{picked.length >= 2 ? ` ${picked.length}` : ""}
        </Button>
      </section>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="xl">
          <DialogHeader title="Compare products" description="Prices and availability can change; check the product page before buying." />
          <DialogBody>
            <CompareTable
              products={picked}
              onRemove={(slug) => {
                compare.remove(slug);
                if (picked.length <= 2) setOpen(false);
              }}
            />
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}
