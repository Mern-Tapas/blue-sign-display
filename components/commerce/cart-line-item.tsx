"use client";

import Link from "next/link";
import { X } from "lucide-react";
import type { CartItem } from "@/components/providers/cart-store";
import { CountBadge } from "@/components/ui/count-badge";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./product-image";
import { QuantityStepper } from "./quantity-stepper";

export type CartLineItemProps = {
  item: CartItem;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
  /** Read-only rows for order summaries. */
  readOnly?: boolean;
  className?: string;
};

export function CartLineItem({ item, onQuantityChange, onRemove, readOnly, className }: CartLineItemProps) {
  const variant = [item.color, item.size].filter(Boolean).join(" · ");
  return (
    <div data-slot="cart-line-item" className={cn("flex gap-3", className)}>
      <div className="relative shrink-0">
        <ProductImage src={item.image} alt={item.name} sizes="80px" wrapperClassName={cn("rounded-lg", readOnly ? "size-16" : "size-20")} />
        {readOnly && (
          <CountBadge count={item.quantity} tone="inverse" className="absolute -top-1.5 -right-1.5" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/products/${item.slug}`} className="line-clamp-1 rounded-xs text-body-strong transition-colors duration-(--dur-fast) hover:text-accent-fg">
              {item.name}
            </Link>
            {variant && <p className="text-caption text-fg-muted">{variant}</p>}
          </div>
          {!readOnly && onRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${item.name}`}
              className="-mt-1 -mr-1 state-layer hit-area relative flex size-7 shrink-0 items-center justify-center rounded-pill text-fg-muted transition-colors duration-(--dur-fast) hover:text-fg"
            >
              <X aria-hidden className="size-icon-md" />
            </button>
          )}
          {readOnly && <p className="shrink-0 text-body-strong figures">{formatPrice(item.price * item.quantity)}</p>}
        </div>
        {!readOnly && (
          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <QuantityStepper
              size="sm"
              value={item.quantity}
              onValueChange={onQuantityChange}
              removeAtMin
              onRemove={onRemove}
              label={`Quantity for ${item.name}`}
            />
            <div className="text-right">
              {item.compareAt && item.compareAt > item.price && (
                <p className="text-caption text-fg-muted line-through figures">{formatPrice(item.compareAt * item.quantity)}</p>
              )}
              <p className="text-body-strong figures">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
