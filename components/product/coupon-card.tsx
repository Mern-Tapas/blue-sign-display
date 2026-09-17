"use client";

import { Check, Clock, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/cn";
import { formatDate, formatPrice } from "@/lib/format";
import type { Coupon } from "@/lib/data/types";

export type CouponStatus = "available" | "applied" | "locked" | "expired";

export type CouponCardProps = {
  coupon: Coupon;
  /** Order or product value used to compute savings and eligibility. */
  subtotal?: number;
  /** Today's date as yyyy-mm-dd, passed from the server so expiry never flips during hydration. */
  today?: string;
  applied?: boolean;
  onApply?: (code: string) => void;
  onRemove?: (code: string) => void;
  /** Selectable row inside a coupon sheet. */
  selectable?: boolean;
  className?: string;
};

export function couponStatus(coupon: Coupon, subtotal: number | undefined, today: string | undefined, applied: boolean): CouponStatus {
  if (applied) return "applied";
  if (today && coupon.expiresOn < today) return "expired";
  if (subtotal !== undefined && subtotal < coupon.minOrder) return "locked";
  return "available";
}

function savingsFor(coupon: Coupon, subtotal: number) {
  return coupon.discount.type === "flat" ? coupon.discount.amount : Math.min(Math.floor((subtotal * coupon.discount.percent) / 100), coupon.discount.maxAmount);
}

/**
 * Ticket-style coupon: code, what it gives, exact savings on this order, minimum spend gap
 * ("Add ₹500 more"), expiry, and copy or apply actions. Expired and locked coupons stay visible
 * but can't be applied.
 */
export function CouponCard({ coupon, subtotal, today, applied = false, onApply, onRemove, className }: CouponCardProps) {
  const status = couponStatus(coupon, subtotal, today, applied);
  const savings = subtotal !== undefined && status !== "expired" && status !== "locked" ? savingsFor(coupon, subtotal) : null;
  const gap = subtotal !== undefined ? coupon.minOrder - subtotal : 0;

  return (
    <article
      data-slot="coupon-card"
      data-status={status}
      className={cn(
        "relative flex overflow-hidden rounded-xl border bg-surface",
        status === "applied" ? "border-success" : "border-border",
        (status === "expired" || status === "locked") && "bg-surface-sunken",
        className,
      )}
    >
      {/* Ticket stub with punched edge */}
      <div
        className={cn(
          "relative flex w-12 shrink-0 items-center justify-center border-r border-dashed",
          status === "applied" ? "border-success bg-success-soft text-success-fg" : status === "available" ? "border-border bg-accent-soft text-accent-soft-fg" : "border-border bg-disabled text-disabled-fg",
        )}
      >
        <Ticket aria-hidden className="size-icon-lg -rotate-45" />
        <span aria-hidden className="absolute -top-2 -right-2 size-4 rounded-pill border border-border bg-canvas" />
        <span aria-hidden className="absolute -right-2 -bottom-2 size-4 rounded-pill border border-border bg-canvas" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={cn("rounded-xs border border-dashed px-2 py-0.5 text-code", status === "expired" ? "border-border text-fg-muted line-through" : "border-current text-accent-fg")}>
            {coupon.code}
          </p>
          {status === "applied" ? (
            <span className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-label text-success-fg">
                <Check aria-hidden className="size-icon-sm" strokeWidth={3} /> Applied
              </span>
              {onRemove && (
                <Button variant="link" size="sm" onClick={() => onRemove(coupon.code)}>
                  Remove
                </Button>
              )}
            </span>
          ) : status === "available" ? (
            onApply ? (
              <Button size="sm" variant="secondary" onClick={() => onApply(coupon.code)}>
                Apply
              </Button>
            ) : (
              <CopyButton value={coupon.code} appearance="inline" label="Copy code" />
            )
          ) : null}
        </div>
        <div className="flex flex-col gap-0.5">
          <p className={cn("text-title", status === "expired" && "text-fg-muted")}>{coupon.title}</p>
          <p className="text-body text-fg-muted">{coupon.description}</p>
        </div>
        {savings !== null && savings > 0 && <p className="text-label text-success-fg figures">You save {formatPrice(savings)} on this order</p>}
        {status === "locked" && gap > 0 && <p className="text-label text-warning-fg figures">Add {formatPrice(gap)} more to use this coupon</p>}
        <p className="flex items-center gap-1 text-caption text-fg-muted">
          <Clock aria-hidden className="size-icon-sm" />
          {status === "expired" ? `Expired on ${formatDate(coupon.expiresOn)}` : `Valid till ${formatDate(coupon.expiresOn)}`}
        </p>
        {coupon.terms && coupon.terms.length > 0 && (
          <details className="group text-caption text-fg-muted">
            <summary className="w-fit cursor-pointer list-none rounded-xs underline-offset-4 hover:underline [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">View terms</span>
              <span className="hidden group-open:inline">Hide terms</span>
            </summary>
            <ul className="mt-1.5 list-disc pl-4">
              {coupon.terms.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </article>
  );
}
