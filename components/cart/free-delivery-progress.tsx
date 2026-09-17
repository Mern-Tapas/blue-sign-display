import { PartyPopper, Truck } from "lucide-react";
import { Inset } from "@/components/ui/inset";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/data/india";

export type FreeDeliveryProgressProps = {
  /** Selling-price subtotal of the bag. */
  subtotal: number;
  threshold?: number;
  fee?: number;
  /** bar — message + progress (drawer, bag); inline — one sentence (sticky bars). */
  variant?: "bar" | "inline";
  className?: string;
};

/** "Add ₹120 more for free delivery" with progress, turning into a confirmation once unlocked. Server-safe. */
export function FreeDeliveryProgress({ subtotal, threshold = FREE_DELIVERY_THRESHOLD, fee = DELIVERY_FEE, variant = "bar", className }: FreeDeliveryProgressProps) {
  const remaining = Math.max(0, threshold - subtotal);
  const unlocked = remaining === 0;
  const message = unlocked ? (
    <span>You’ve got free delivery on this order</span>
  ) : (
    <span>
      Add <span className="font-medium text-fg figures">{formatPrice(remaining)}</span> more to save the {formatPrice(fee)} delivery fee
    </span>
  );

  if (variant === "inline") {
    return (
      <p data-slot="free-delivery-progress" aria-live="polite" className={cn("flex items-center gap-1.5 text-caption text-fg-muted", unlocked && "text-success-fg", className)}>
        {unlocked ? <PartyPopper aria-hidden className="size-icon-sm" /> : <Truck aria-hidden className="size-icon-sm" />}
        {message}
      </p>
    );
  }

  return (
    <Inset size="sm" data-slot="free-delivery-progress" className={cn("flex flex-col gap-2", className)}>
      <p aria-live="polite" className={cn("flex items-center gap-2 text-label text-fg-muted", unlocked && "text-success-fg")}>
        {unlocked ? <PartyPopper aria-hidden className="size-icon-md shrink-0" /> : <Truck aria-hidden className="size-icon-md shrink-0 text-accent-fg" />}
        {message}
      </p>
      <Progress value={Math.min(subtotal, threshold)} max={threshold} size="sm" tone={unlocked ? "success" : "accent"} aria-label="Progress to free delivery" />
    </Inset>
  );
}
