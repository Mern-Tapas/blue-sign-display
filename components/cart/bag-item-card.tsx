"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, Heart, Trash2, Truck, X } from "lucide-react";
import { PriceDisplay } from "@/components/commerce/price-display";
import { ProductImage } from "@/components/commerce/product-image";
import type { CartItem } from "@/components/providers/cart-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { TextButton } from "@/components/ui/text-button";
import { cn } from "@/lib/cn";

export type BagItemCardProps = {
  item: CartItem;
  brand?: string;
  /** Sizes offered for this product; enables the size select. */
  sizes?: string[];
  /** Units available; caps the quantity select and shows "Only N left". */
  stock?: number;
  /** "Delivery by Wed, 17 Sept" for the shopper's PIN. */
  deliveryText?: string;
  maxQuantity?: number;
  onSizeChange?: (size: string) => void;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
  onMoveToWishlist?: () => void;
  onSaveForLater?: () => void;
  className?: string;
};

/**
 * Bag row with the controls shoppers expect on Indian marketplaces: size and quantity selects,
 * price vs MRP with % off, delivery date for their PIN, and a remove flow that offers moving to
 * the wishlist instead of losing the item.
 */
export function BagItemCard({
  item,
  brand,
  sizes,
  stock,
  deliveryText,
  maxQuantity = 10,
  onSizeChange,
  onQuantityChange,
  onRemove,
  onMoveToWishlist,
  onSaveForLater,
  className,
}: BagItemCardProps) {
  const [confirm, setConfirm] = useState(false);
  const qtyMax = Math.max(1, Math.min(maxQuantity, stock ?? maxQuantity));
  const href = `/products/${item.slug}`;

  return (
    <Card asChild padding="none" className={cn("flex-row gap-3 p-3 sm:gap-4 sm:p-4", className)}>
      <article data-slot="bag-item">
        <Link href={href} tabIndex={-1} aria-hidden className="shrink-0">
          <ProductImage src={item.image} alt="" sizes="120px" wrapperClassName="aspect-[4/5] w-24 rounded-lg sm:w-28" />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="pr-8">
            {brand && <p className="text-caption text-fg-muted">{brand}</p>}
            <h3 className="line-clamp-2 text-body-strong">
              <Link href={href} className="underline-offset-4 hover:underline">
                {item.name}
              </Link>
            </h3>
            {item.color && <p className="text-caption text-fg-muted">Colour: {item.color}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes && sizes.length > 0 && (
              <Select
                aria-label={`Size for ${item.name}`}
                prefix="Size:"
                size="sm"
                variant="sunken"
                shape="rounded"
                value={item.size}
                placeholder="Select"
                onValueChange={(v) => onSizeChange?.(v)}
                options={sizes.map((s) => ({ value: s, label: s }))}
                className="w-auto min-w-24"
              />
            )}
            <Select
              aria-label={`Quantity for ${item.name}`}
              prefix="Qty:"
              size="sm"
              variant="sunken"
              shape="rounded"
              value={String(item.quantity)}
              onValueChange={(v) => onQuantityChange?.(Number(v))}
              options={Array.from({ length: qtyMax }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))}
              className="w-auto min-w-20"
            />
          </div>
          <PriceDisplay amount={item.price * item.quantity} compareAt={item.compareAt ? item.compareAt * item.quantity : undefined} size="sm" showDiscount />
          {stock !== undefined && stock > 0 && stock <= 5 && <p className="text-caption text-warning-fg">Only {stock} left</p>}
          {deliveryText && (
            <p className="flex items-center gap-1.5 text-caption text-fg-muted">
              <Truck aria-hidden className="size-icon-sm" />
              {deliveryText}
            </p>
          )}
          {(onMoveToWishlist || onSaveForLater) && (
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              {onSaveForLater && (
                <TextButton tone="muted" onClick={onSaveForLater}>
                  <Bookmark aria-hidden /> Save for later
                </TextButton>
              )}
              {onMoveToWishlist && (
                <TextButton tone="muted" onClick={onMoveToWishlist}>
                  <Heart aria-hidden /> Move to wishlist
                </TextButton>
              )}
            </div>
          )}
        </div>
        {onRemove && (
          <button
            type="button"
            aria-label={`Remove ${item.name} from bag`}
            onClick={() => (onMoveToWishlist ? setConfirm(true) : onRemove())}
            className="state-layer hit-area absolute top-3 right-3 flex size-control-xs items-center justify-center rounded-pill text-fg-muted hover:text-fg"
          >
            <X aria-hidden className="size-icon-md" />
          </button>
        )}

        {onMoveToWishlist && onRemove && (
          <Dialog open={confirm} onOpenChange={setConfirm}>
            <DialogContent size="sm">
              <DialogHeader title="Remove from bag?" description="Move it to your wishlist instead to buy it later." />
              <DialogBody className="py-4">
                <div className="flex items-center gap-3">
                  <ProductImage src={item.image} alt="" sizes="56px" wrapperClassName="size-14 shrink-0 rounded-md" />
                  <p className="line-clamp-2 text-body">{item.name}</p>
                </div>
              </DialogBody>
              <DialogFooter>
                <Button
                  variant="secondary"
                  leadingIcon={<Trash2 aria-hidden />}
                  onClick={() => {
                    setConfirm(false);
                    onRemove();
                  }}
                >
                  Remove
                </Button>
                <Button
                  leadingIcon={<Heart aria-hidden />}
                  onClick={() => {
                    setConfirm(false);
                    onMoveToWishlist();
                  }}
                >
                  Move to wishlist
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </article>
    </Card>
  );
}
