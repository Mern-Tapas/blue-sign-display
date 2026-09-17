"use client";

import { ShoppingBag } from "lucide-react";
import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { CartLineItem } from "@/components/commerce/cart-line-item";
import { cart, useCart } from "@/components/providers/cart-store";
import { DsGrid, DsPreview } from "@/components/docs/ds-section";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/data/types";

export function CartDemo({ product }: { product: Product }) {
  const { items, count } = useCart();
  const sample = items[0] ?? {
    key: "demo",
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.images[0]!,
    price: product.price,
    compareAt: product.compareAt,
    quantity: 1,
    color: "Violet",
  };
  return (
    <DsGrid>
      <DsPreview label="Add to cart">
        <AddToCartButton product={product} color="Violet" />
        <AddToCartButton product={product} appearance="compact" openDrawer={false} color="Graphite" />
        <AddToCartButton product={{ ...product, stock: 0 }} variant="secondary" />
        <Button variant="secondary" leadingIcon={<ShoppingBag aria-hidden />} onClick={() => cart.setOpen(true)}>
          Open cart ({count})
        </Button>
      </DsPreview>
      <DsPreview label="Cart line item, editable and read-only" className="flex-col items-stretch gap-5">
        <CartLineItem
          item={sample}
          onQuantityChange={(q) => items[0] && cart.setQuantity(sample.key, q)}
          onRemove={() => items[0] && cart.remove(sample.key)}
        />
        <CartLineItem item={{ ...sample, quantity: 2 }} readOnly />
      </DsPreview>
    </DsGrid>
  );
}
