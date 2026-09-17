"use client";

import { CircleAlert } from "lucide-react";
import { ProductImage } from "@/components/commerce/product-image";
import { Button } from "@/components/ui/button";
import { Inset } from "@/components/ui/inset";
import { cn } from "@/lib/cn";

export type UnavailableItem = { key: string; name: string; image: string; reason: "out-of-stock" | "not-deliverable" | "price-changed"; detail?: string };

export type UnavailableItemNoticeProps = {
  items: UnavailableItem[];
  pincode?: string;
  onRemoveAll: () => void;
  onMoveToWishlist?: () => void;
  className?: string;
};

const reasons: Record<UnavailableItem["reason"], string> = {
  "out-of-stock": "Out of stock",
  "not-deliverable": "Not deliverable to your PIN",
  "price-changed": "Price changed",
};

/**
 * Blocks surprises at checkout: lists bag items that can't be ordered right now and why, with
 * one action to clear them (or keep them in the wishlist).
 */
export function UnavailableItemNotice({ items, pincode, onRemoveAll, onMoveToWishlist, className }: UnavailableItemNoticeProps) {
  if (items.length === 0) return null;
  const blocking = items.some((i) => i.reason !== "price-changed");
  return (
    <Inset asChild tone="warning" className={cn("flex flex-col gap-4 rounded-2xl", className)}>
      <section data-slot="unavailable-items" role="alert">
        <div className="flex items-start gap-3">
          <CircleAlert aria-hidden className="mt-0.5 size-icon-lg shrink-0" />
          <div className="flex flex-col gap-0.5">
            <p className="text-body-strong">
              {items.length === 1 ? "1 item needs your attention" : `${items.length} items need your attention`}
            </p>
            <p className="text-body">
              {blocking ? "Remove them to place your order" : "Review the new price before you continue"}
              {pincode && items.some((i) => i.reason === "not-deliverable") ? ` · delivering to ${pincode}` : ""}.
            </p>
          </div>
        </div>
        <ul className="flex flex-col gap-2">
          {items.map((i) => (
            <li key={i.key} className="flex items-center gap-3 rounded-lg bg-surface p-2 text-fg">
              <ProductImage src={i.image} alt="" sizes="48px" wrapperClassName="size-12 shrink-0 rounded-md opacity-70" />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-body">{i.name}</span>
                <span className="text-caption text-warning-fg">
                  {reasons[i.reason]}
                  {i.detail ? ` · ${i.detail}` : ""}
                </span>
              </div>
            </li>
          ))}
        </ul>
        {blocking && (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="neutral" onClick={onRemoveAll}>
              Remove {items.length === 1 ? "item" : "items"}
            </Button>
            {onMoveToWishlist && (
              <Button size="sm" variant="secondary" onClick={onMoveToWishlist}>
                Move to wishlist
              </Button>
            )}
          </div>
        )}
      </section>
    </Inset>
  );
}
