"use client";

import { Check, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { cart } from "@/components/providers/cart-store";
import { toast } from "@/components/providers/toast-store";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { Product } from "@/lib/data/types";

export type AddToCartButtonProps = Omit<ButtonProps, "onClick" | "children"> & {
  product: Pick<Product, "id" | "slug" | "name" | "images" | "price" | "compareAt" | "stock">;
  color?: string;
  size?: ButtonProps["size"];
  variantSize?: string;
  quantity?: number;
  /** "full" = label button, "compact" = small quick-add pill. */
  appearance?: "full" | "compact";
  openDrawer?: boolean;
  label?: string;
};

export function AddToCartButton({
  product,
  color,
  variantSize,
  quantity = 1,
  appearance = "full",
  openDrawer = true,
  label = "Add to cart",
  disabled,
  ...props
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;

  function add(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    cart.add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0]!,
        price: product.price,
        compareAt: product.compareAt,
        color,
        size: variantSize,
        quantity,
      },
      { open: openDrawer },
    );
    if (!openDrawer) {
      toast({
        title: "Added to cart",
        description: [product.name, color, variantSize].filter(Boolean).join(" · "),
        image: product.images[0],
        action: { label: "View", onClick: () => cart.setOpen(true) },
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (appearance === "compact") {
    return (
      <Button
        size="sm"
        variant="neutral"
        disabled={disabled || soldOut}
        onClick={add}
        leadingIcon={added ? <Check aria-hidden /> : <Plus aria-hidden />}
        aria-label={soldOut ? `${product.name} is sold out` : `Add ${product.name} to cart`}
        {...props}
      >
        {soldOut ? "Sold out" : added ? "Added" : "Quick add"}
      </Button>
    );
  }

  return (
    <Button
      disabled={disabled || soldOut}
      onClick={add}
      leadingIcon={added ? <Check aria-hidden /> : <ShoppingBag aria-hidden />}
      {...props}
    >
      {soldOut ? "Sold out" : added ? "Added to cart" : label}
    </Button>
  );
}
