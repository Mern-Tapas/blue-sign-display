"use client";

import { useState } from "react";
import Link from "next/link";
import { BellRing, ShoppingBag, TrendingDown, X } from "lucide-react";
import { PriceDisplay } from "@/components/commerce/price-display";
import { ProductImage } from "@/components/commerce/product-image";
import { cart } from "@/components/providers/cart-store";
import { toast } from "@/components/providers/toast-store";
import { wishlist } from "@/components/providers/wishlist-store";
import { RatingPill } from "@/components/reviews/rating-pill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/data/types";
import { MoveToBagSizeDialog } from "./move-to-bag-size-dialog";

export type WishlistItemCardProps = {
  product: Pick<Product, "id" | "slug" | "name" | "brand" | "images" | "price" | "compareAt" | "stock" | "sizes" | "rating" | "reviewCount">;
  /** Price when the shopper saved it. */
  savedPrice?: number;
  /** Override the default store-backed remove (e.g. for demos). */
  onRemove?: () => void;
  onNotify?: () => void;
  className?: string;
};

/**
 * Saved product with the facts that decide whether to buy now: current price vs MRP, a
 * price-drop note since saving, stock state, and Move to bag (asks for a size first when needed).
 * Removing offers Undo.
 */
export function WishlistItemCard({ product, savedPrice, onRemove, onNotify, className }: WishlistItemCardProps) {
  const [sizeOpen, setSizeOpen] = useState(false);
  const soldOut = product.stock <= 0;
  const drop = savedPrice !== undefined && savedPrice > product.price ? savedPrice - product.price : 0;
  const href = `/products/${product.slug}`;

  function remove() {
    if (onRemove) return onRemove();
    wishlist.remove(product.slug);
    toast({ title: "Removed from wishlist", description: product.name, tone: "neutral", action: { label: "Undo", onClick: () => wishlist.add(product.slug, savedPrice) } });
  }

  function moveToBag(size?: string) {
    cart.add({ productId: product.id, slug: product.slug, name: product.name, image: product.images[0]!, price: product.price, compareAt: product.compareAt, size }, { open: false });
    if (!onRemove) wishlist.remove(product.slug);
    else onRemove();
    toast({ title: "Moved to bag", description: [product.name, size].filter(Boolean).join(" · "), image: product.images[0], tone: "success", action: { label: "View bag", onClick: () => cart.setOpen(true) } });
  }

  return (
    <Card asChild padding="none" className={cn("group overflow-hidden", className)}>
    <article data-slot="wishlist-item">
      <div className="relative">
        <Link href={href} tabIndex={-1} aria-hidden>
          <ProductImage
            src={product.images[0]!}
            alt=""
            sizes="(min-width: 1024px) 22vw, 50vw"
            wrapperClassName={cn("aspect-[4/5]", soldOut && "opacity-60")}
            className="transition-transform duration-(--dur-slow) ease-out motion-safe:group-hover:scale-[1.03]"
          />
        </Link>
        <button
          type="button"
          aria-label={`Remove ${product.name} from wishlist`}
          onClick={remove}
          className="press state-layer hit-area absolute top-2.5 right-2.5 flex size-control-sm items-center justify-center rounded-pill bg-surface/85 text-fg backdrop-blur-sm transition-transform duration-(--dur-fast)"
        >
          <X aria-hidden className="size-icon-md" />
        </button>
        {soldOut && (
          <span className="absolute inset-x-2.5 bottom-2.5 rounded-pill bg-surface/90 py-1.5 text-center text-label text-fg backdrop-blur-sm">Out of stock</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="truncate text-caption text-fg-muted">{product.brand}</p>
        <h3 className="line-clamp-1 text-body-strong">
          <Link href={href} className="underline-offset-4 hover:underline">
            {product.name}
          </Link>
        </h3>
        <RatingPill value={product.rating} count={product.reviewCount} />
        <PriceDisplay amount={product.price} compareAt={product.compareAt} showDiscount className="gap-x-1.5" />
        {drop > 0 && (
          <p className="flex items-center gap-1 text-caption text-success-fg figures">
            <TrendingDown aria-hidden className="size-icon-sm" />
            Price dropped by {formatPrice(drop)} since you saved it
          </p>
        )}
        {!soldOut && product.stock <= 5 && <p className="text-caption text-warning-fg">Only {product.stock} left</p>}
        <div className="mt-auto pt-1">
          {soldOut ? (
            <Button variant="secondary" size="sm" fullWidth leadingIcon={<BellRing aria-hidden />} onClick={onNotify ?? (() => toast({ title: "We’ll tell you when it’s back", tone: "success" }))}>
              Notify me
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              leadingIcon={<ShoppingBag aria-hidden />}
              onClick={() => (product.sizes?.length ? setSizeOpen(true) : moveToBag())}
            >
              Move to bag
            </Button>
          )}
        </div>
      </div>
      {product.sizes?.length ? (
        <MoveToBagSizeDialog
          product={product}
          sizes={product.sizes.map((s) => ({ value: s }))}
          open={sizeOpen}
          onOpenChange={setSizeOpen}
          onConfirm={(s) => moveToBag(s)}
        />
      ) : null}
    </article>
    </Card>
  );
}
