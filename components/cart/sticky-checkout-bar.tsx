"use client";

import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextButton } from "@/components/ui/text-button";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

export type StickyCheckoutBarProps = {
  total: number;
  savings?: number;
  /** id of the price details section to scroll to. */
  detailsId?: string;
  actionLabel?: string;
  /** Primary action: link (asChild) or button. */
  action?: React.ReactElement;
  onAction?: () => void;
  disabled?: boolean;
  loading?: boolean;
  /** Sit above the phone bottom nav (default) or at the very bottom (checkout, where the nav is hidden). */
  offset?: "bottom-nav" | "none";
  className?: string;
};

/** Phone bar with the payable total, a jump to price details and the next step (Place order / Continue). */
export function StickyCheckoutBar({ total, savings = 0, detailsId, actionLabel = "Place order", action, onAction, disabled, loading, offset = "bottom-nav", className }: StickyCheckoutBarProps) {
  return (
    <div
      data-slot="sticky-checkout-bar"
      className={cn(
        "fixed inset-x-0 z-(--z-sticky) border-t border-border-subtle bg-surface/95 px-4 py-2.5 backdrop-blur-md lg:hidden",
        offset === "bottom-nav" ? "bottom-[calc(4rem+env(safe-area-inset-bottom))]" : "bottom-0 pb-[max(0.625rem,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-heading-sm figures">{formatPrice(total)}</span>
          {detailsId ? (
            <TextButton
              size="sm"
              onClick={() => document.getElementById(detailsId)?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="gap-0.5 self-start"
            >
              View price details <ChevronUp aria-hidden />
            </TextButton>
          ) : (
            savings > 0 && <span className="text-caption text-success-fg figures">You save {formatPrice(savings)}</span>
          )}
        </div>
        {action ?? (
          <Button size="lg" className="min-w-40" disabled={disabled} loading={loading} onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
