"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ChevronDown, ShoppingBag, X } from "lucide-react";
import { PriceDisplay } from "@/components/commerce/price-display";
import { ProductImage } from "@/components/commerce/product-image";
import type { CartItem } from "@/components/providers/cart-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type SaveForLaterListProps = {
  items: CartItem[];
  onMoveToBag: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  defaultOpen?: boolean;
  className?: string;
};

/** Items parked out of the bag total, collapsible, each with Move to bag and remove. */
export function SaveForLaterList({ items, onMoveToBag, onRemove, defaultOpen = true, className }: SaveForLaterListProps) {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);
  if (items.length === 0) return null;

  return (
    <Card asChild variant="outline" padding="sm" className={className}>
      <section data-slot="save-for-later" aria-labelledby={`${id}-title`}>
        <h2 id={`${id}-title`}>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`${id}-list`}
            onClick={() => setOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-3 rounded-md text-left text-title"
          >
            <span>
              Saved for later <span className="font-normal text-fg-muted figures">({items.length})</span>
            </span>
            <ChevronDown aria-hidden className={cn("size-icon-md text-fg-muted transition-transform duration-(--dur-fast)", open && "rotate-180")} />
          </button>
        </h2>
        {open && (
          <ul id={`${id}-list`} className="flex flex-col divide-y divide-border-subtle">
            {items.map((item) => (
              <li key={item.key} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <Link href={`/products/${item.slug}`} tabIndex={-1} aria-hidden className="shrink-0">
                  <ProductImage src={item.image} alt="" sizes="64px" wrapperClassName="size-16 rounded-md" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Link href={`/products/${item.slug}`} className="line-clamp-1 text-body-strong underline-offset-4 hover:underline">
                    {item.name}
                  </Link>
                  <PriceDisplay amount={item.price} compareAt={item.compareAt} size="sm" showDiscount />
                </div>
                <Button variant="secondary" size="sm" leadingIcon={<ShoppingBag aria-hidden />} onClick={() => onMoveToBag(item)} aria-label={`Move ${item.name} to bag`}>
                  <span className="max-sm:sr-only">Move to bag</span>
                </Button>
                <button
                  type="button"
                  aria-label={`Remove ${item.name} from saved for later`}
                  onClick={() => onRemove(item)}
                  className="state-layer hit-area relative flex size-control-xs shrink-0 items-center justify-center rounded-pill text-fg-muted hover:text-fg"
                >
                  <X aria-hidden className="size-icon-sm" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Card>
  );
}
