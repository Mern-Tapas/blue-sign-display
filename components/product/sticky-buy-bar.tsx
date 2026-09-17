"use client";

import { useEffect, useState } from "react";
import { PriceDisplay } from "@/components/commerce/price-display";
import { cn } from "@/lib/cn";

export type StickyBuyBarProps = {
  /** id of the main actions block; the bar appears once it scrolls out of view. */
  watchId: string;
  price: number;
  compareAt?: number;
  /** Compact action buttons (e.g. ProductActions layout="row"). */
  children: React.ReactNode;
  className?: string;
};

/**
 * Phone-only price + actions bar that slides in above the bottom nav when the product's own
 * buttons are off screen, so buying is always one tap away. Hidden again when they return.
 */
export function StickyBuyBar({ watchId, price, compareAt, children, className }: StickyBuyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById(watchId);
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      // Show only after the actions have scrolled above the viewport, not before reaching them
      setVisible(!entry!.isIntersecting && entry!.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [watchId]);

  return (
    <div
      data-slot="sticky-buy-bar"
      aria-hidden={!visible || undefined}
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-(--z-sticky) border-t border-border-subtle bg-surface/95 px-3 py-2.5 backdrop-blur-md lg:hidden",
        "transition-[translate,opacity] duration-(--dur-base) ease-out",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
        className,
      )}
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <PriceDisplay amount={price} compareAt={compareAt} size="md" showDiscount className="min-w-0 flex-col gap-y-0" />
        <div className="ml-auto flex min-w-0 flex-1 justify-end [&_[data-slot=product-actions]]:w-full [&_button]:h-control-lg [&_button]:px-3">{children}</div>
      </div>
    </div>
  );
}
