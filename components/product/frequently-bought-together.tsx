"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PriceDisplay } from "@/components/commerce/price-display";
import { ProductImage } from "@/components/commerce/product-image";
import { cart } from "@/components/providers/cart-store";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Inset } from "@/components/ui/inset";
import { selectableCardClass } from "@/components/ui/radio-card";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/data/types";

type BundleProduct = Pick<Product, "id" | "slug" | "name" | "images" | "price" | "compareAt" | "stock">;

export type FrequentlyBoughtTogetherProps = {
  /** The product being viewed (always included). */
  product: BundleProduct;
  addOns: BundleProduct[];
  title?: string;
  className?: string;
};

/**
 * Current product plus add-ons with checkboxes, a running total against MRP and one button to
 * add the selection. Sold-out add-ons are shown but can't be selected.
 */
export function FrequentlyBoughtTogether({ product, addOns, title = "Frequently bought together", className }: FrequentlyBoughtTogetherProps) {
  const [picked, setPicked] = useState<string[]>(addOns.filter((a) => a.stock > 0).map((a) => a.id));
  const all = [product, ...addOns];
  const selected = all.filter((p) => p.id === product.id || picked.includes(p.id));
  const total = selected.reduce((n, p) => n + p.price, 0);
  const mrp = selected.reduce((n, p) => n + (p.compareAt ?? p.price), 0);

  return (
    <Card asChild className={cn("gap-5", className)}>
    <section data-slot="frequently-bought-together" aria-label={title}>
      <h2 className="text-title">{title}</h2>
      <ul className="flex items-center gap-2 overflow-x-auto pb-1 sm:gap-3">
        {all.map((p, i) => (
          <li key={p.id} className="flex shrink-0 items-center gap-2 sm:gap-3">
            {i > 0 && <Plus aria-hidden className="size-icon-md text-fg-muted" />}
            <Link href={`/products/${p.slug}`} className={cn("block rounded-lg transition-opacity duration-(--dur-fast)", p.id !== product.id && !picked.includes(p.id) && "opacity-40")}>
              <ProductImage src={p.images[0]!} alt={p.name} sizes="96px" wrapperClassName="size-20 rounded-lg sm:size-24" />
            </Link>
          </li>
        ))}
      </ul>
      <ul className="flex flex-col gap-2">
        {all.map((p) => {
          const isMain = p.id === product.id;
          const out = p.stock <= 0;
          return (
            <li
              key={p.id}
              className={cn(
                selectableCardClass,
                "items-start justify-between gap-3 p-3 has-data-[state=checked]:selected has-data-[state=checked]:border-transparent",
              )}
            >
              <Checkbox
                label={
                  <span className={cn(out && "text-fg-muted")}>
                    {isMain && <span className="font-medium">This item: </span>}
                    {p.name}
                    {out && <span className="text-caption"> · sold out</span>}
                  </span>
                }
                checked={isMain || picked.includes(p.id)}
                disabled={isMain || out}
                onCheckedChange={(v) => setPicked((list) => (v === true ? [...list, p.id] : list.filter((x) => x !== p.id)))}
                className="min-w-0 flex-1"
              />
              <PriceDisplay amount={p.price} compareAt={p.compareAt} size="sm" className="shrink-0 justify-end" />
            </li>
          );
        })}
      </ul>
      <Inset className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col">
          <p className="text-caption text-fg-muted" aria-live="polite">
            Total for {selected.length} {selected.length === 1 ? "item" : "items"}
          </p>
          <PriceDisplay amount={total} compareAt={mrp} size="lg" showDiscount />
        </div>
        <Button
          size="lg"
          onClick={() => {
            selected.forEach((p) => cart.add({ productId: p.id, slug: p.slug, name: p.name, image: p.images[0]!, price: p.price, compareAt: p.compareAt }, { open: false }));
            toast({ title: `Added ${selected.length} items to bag`, description: `${formatPrice(total)} total`, tone: "success", action: { label: "View bag", onClick: () => cart.setOpen(true) } });
          }}
        >
          Add {selected.length} to bag
        </Button>
      </Inset>
    </section>
    </Card>
  );
}
