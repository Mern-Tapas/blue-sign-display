"use client";

import { useState } from "react";
import { ArrowUpRight, Eye } from "lucide-react";
import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { ImageGallery } from "@/components/commerce/image-gallery";
import { PriceDisplay } from "@/components/commerce/price-display";
import { SwatchGroup } from "@/components/commerce/swatch-group";
import { WishlistButton } from "@/components/commerce/wishlist-button";
import { RatingPill } from "@/components/reviews/rating-pill";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TextLink } from "@/components/ui/text-link";
import { Dialog as DialogPrimitive } from "radix-ui";
import type { Product } from "@/lib/data/types";

export type QuickViewDialogProps = {
  product: Product;
  /** Custom trigger; defaults to a small "Quick view" pill that fits the card's hover actions. */
  trigger?: React.ReactElement;
};

/**
 * Lets desktop shoppers check photos, price, colour and size and add to bag without leaving
 * the listing. Always links to the full product page, which remains the source of truth.
 */
export function QuickViewDialog({ product, trigger }: QuickViewDialogProps) {
  const [color, setColor] = useState(product.colors?.[0]?.name);
  const [size, setSize] = useState<string>();
  const needsSize = Boolean(product.sizes?.length);
  const href = `/products/${product.slug}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant="secondary" leadingIcon={<Eye aria-hidden />} aria-label={`Quick view ${product.name}`} className="shadow-popover">
            View
          </Button>
        )}
      </DialogTrigger>
      <DialogContent size="xl" className="overflow-y-auto">
        <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-2">
          <ImageGallery images={product.images} alt={product.name} />
          <div className="flex flex-col gap-5 md:pr-10">
            <div className="flex flex-col gap-1.5">
              <p className="text-caption text-fg-muted">{product.brand}</p>
              <DialogPrimitive.Title className="text-heading-md">{product.name}</DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">Quick view of {product.name}</DialogPrimitive.Description>
              <RatingPill value={product.rating} count={product.reviewCount} size="md" />
            </div>
            <PriceDisplay amount={product.price} compareAt={product.compareAt} size="xl" showDiscount mrpLabel taxNote />
            {product.colors && (
              <SwatchGroup type="color" label="Color" value={color} onValueChange={setColor} options={product.colors.map((c) => ({ value: c.name, color: c.value }))} />
            )}
            {product.sizes && <SwatchGroup type="size" label="Size" value={size} onValueChange={setSize} options={product.sizes.map((s) => ({ value: s }))} />}
            <div className="flex items-center gap-3">
              <AddToCartButton
                product={product}
                color={color}
                variantSize={size}
                size="lg"
                className="flex-1"
                disabled={needsSize && !size}
                label={needsSize && !size ? "Select a size" : "Add to bag"}
              />
              <WishlistButton productName={product.name} slug={product.slug} price={product.price} variant="secondary" size="lg" />
            </div>
            <TextLink href={href} className="self-start text-label">
              View full details
              <ArrowUpRight aria-hidden />
            </TextLink>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
