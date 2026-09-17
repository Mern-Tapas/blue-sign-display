"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { PriceDisplay } from "@/components/commerce/price-display";
import { ProductImage } from "@/components/commerce/product-image";
import { useCart } from "@/components/providers/cart-store";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatPrice } from "@/lib/format";

export type MiniBagPopoverProps = {
  bagHref?: string;
  checkoutHref?: string;
  /** Items listed before "+N more". */
  max?: number;
  trigger?: React.ReactElement;
};

/** Desktop header bag preview: latest items, subtotal, View bag and Checkout. Phones should link straight to the bag. */
export function MiniBagPopover({ bagHref = "/bag", checkoutHref = "/checkout", max = 3, trigger }: MiniBagPopoverProps) {
  const { items, count, subtotal } = useCart();
  const shown = items.slice(-max).reverse();
  const extra = items.length - shown.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger ?? (
          <IconButton label={`Bag, ${count} items`} variant="secondary" badge={count}>
            <ShoppingBag aria-hidden />
          </IconButton>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0" aria-label="Bag preview">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <ShoppingBag aria-hidden className="size-8 text-fg-muted" />
            <p className="text-body-strong">Your bag is empty</p>
            <Button asChild size="sm" variant="secondary">
              <Link href="/shop">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="border-b border-border-subtle px-4 py-3 text-title">
              Bag <span className="font-normal text-fg-muted figures">({count})</span>
            </p>
            <ul className="flex flex-col divide-y divide-border-subtle px-4">
              {shown.map((i) => (
                <li key={i.key} className="flex items-center gap-3 py-3">
                  <ProductImage src={i.image} alt="" sizes="48px" wrapperClassName="size-12 shrink-0 rounded-md" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link href={`/products/${i.slug}`} className="truncate text-label hover:underline">
                      {i.name}
                    </Link>
                    <span className="text-caption text-fg-muted figures">
                      {[i.size, `Qty ${i.quantity}`].filter(Boolean).join(" · ")}
                    </span>
                  </div>
                  <PriceDisplay amount={i.price * i.quantity} size="sm" />
                </li>
              ))}
            </ul>
            {extra > 0 && <p className="px-4 pb-2 text-caption text-fg-muted">+{extra} more in your bag</p>}
            <div className="flex flex-col gap-2 border-t border-border-subtle p-4">
              <p className="flex justify-between text-body">
                <span className="text-fg-muted">Subtotal</span>
                <span className="text-body-strong figures">{formatPrice(subtotal)}</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="secondary" size="sm">
                  <Link href={bagHref}>View bag</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={checkoutHref}>Checkout</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
