"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShoppingBag, Zap } from "lucide-react";
import { WishlistButton } from "@/components/commerce/wishlist-button";
import { cart } from "@/components/providers/cart-store";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/data/types";

export type ProductActionsProps = {
  product: Pick<Product, "id" | "slug" | "name" | "images" | "price" | "compareAt" | "stock" | "sizes">;
  color?: string;
  size?: string;
  quantity?: number;
  /** Called when a size is required but missing — show the selector error and move focus there. */
  onMissingSize?: () => void;
  checkoutHref?: string;
  /** Stack full width on phones (default) or keep in one row. */
  layout?: "responsive" | "row";
  className?: string;
};

/**
 * Add to bag · Buy now · Wishlist. Buttons stay enabled without a size so the shopper learns
 * what's missing (onMissingSize) instead of facing a dead button. Buy now adds and goes
 * straight to checkout. Sold-out products render nothing here — show NotifyMeForm instead.
 */
export function ProductActions({ product, color, size, quantity = 1, onMissingSize, checkoutHref = "/checkout", layout = "responsive", className }: ProductActionsProps) {
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);
  const needsSize = Boolean(product.sizes?.length);

  if (product.stock <= 0) return null;

  function add(open: boolean) {
    if (needsSize && !size) {
      onMissingSize?.();
      return false;
    }
    cart.add({ productId: product.id, slug: product.slug, name: product.name, image: product.images[0]!, price: product.price, compareAt: product.compareAt, color, size, quantity }, { open });
    return true;
  }

  return (
    <div data-slot="product-actions" className={cn("flex gap-3", layout === "responsive" ? "flex-col sm:flex-row" : "flex-row", className)}>
      <Button
        size="xl"
        variant="secondary"
        className="flex-1"
        leadingIcon={added ? <Check aria-hidden /> : <ShoppingBag aria-hidden />}
        onClick={() => {
          if (!add(false)) return;
          setAdded(true);
          toast({
            title: "Added to bag",
            description: [product.name, color, size].filter(Boolean).join(" · "),
            image: product.images[0],
            tone: "success",
            action: { label: "View bag", onClick: () => cart.setOpen(true) },
          });
          window.setTimeout(() => setAdded(false), 1800);
        }}
      >
        {added ? "Added to bag" : "Add to bag"}
      </Button>
      <Button
        size="xl"
        className="flex-1"
        loading={buying}
        leadingIcon={<Zap aria-hidden />}
        onClick={() => {
          if (!add(false)) return;
          setBuying(true);
          router.push(checkoutHref);
        }}
      >
        Buy now
      </Button>
      <WishlistButton productName={product.name} slug={product.slug} price={product.price} variant="secondary" size="lg" className={cn("size-control-xl", layout === "responsive" && "max-sm:hidden")} />
    </div>
  );
}
