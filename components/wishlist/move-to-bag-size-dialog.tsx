"use client";

import { useState } from "react";
import { ProductImage } from "@/components/commerce/product-image";
import { PriceDisplay } from "@/components/commerce/price-display";
import { SizeSelector, type SizeOption } from "@/components/product/size-selector";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import type { Product } from "@/lib/data/types";

export type MoveToBagSizeDialogProps = {
  product: Pick<Product, "name" | "brand" | "images" | "price" | "compareAt">;
  sizes: SizeOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with the chosen size; the caller adds to bag and removes from the wishlist. */
  onConfirm: (size: string) => void;
};

/** Size step when moving a sized product from the wishlist to the bag. */
export function MoveToBagSizeDialog({ product, sizes, open, onOpenChange, onConfirm }: MoveToBagSizeDialogProps) {
  const [size, setSize] = useState<string>();
  const [error, setError] = useState<string>();

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) {
          setSize(undefined);
          setError(undefined);
        }
      }}
    >
      <DialogContent size="sm">
        <DialogHeader title="Select a size" description="Choose a size to move this item to your bag." />
        <DialogBody className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <ProductImage src={product.images[0]!} alt="" sizes="64px" wrapperClassName="size-16 shrink-0 rounded-lg" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="text-caption text-fg-muted">{product.brand}</p>
              <p className="truncate text-body-strong">{product.name}</p>
              <PriceDisplay amount={product.price} compareAt={product.compareAt} size="sm" showDiscount />
            </div>
          </div>
          <SizeSelector
            sizes={sizes}
            value={size}
            onValueChange={(s) => {
              setSize(s);
              setError(undefined);
            }}
            error={error}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!size) return setError("Select a size to continue");
              onConfirm(size);
              onOpenChange(false);
            }}
          >
            Move to bag
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
