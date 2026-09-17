"use client";

import { useState } from "react";
import { Banknote, CircleAlert, Smartphone } from "lucide-react";
import { Inset } from "@/components/ui/inset";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { COD_FEE } from "@/lib/data/india";
import { PayButton } from "./pay-button";

export type CodOptionProps = {
  /** Order total before the COD fee. */
  amount: number;
  /** PIN supports COD. */
  pinEligible: boolean;
  /** Upper limit for COD orders. */
  maxAmount?: number;
  fee?: number;
  pincode?: string;
  onConfirm: () => void | Promise<void>;
  className?: string;
};

/**
 * Cash on Delivery: the fee is shown before confirming, paying by UPI at the door is mentioned,
 * and when COD isn't possible the reason is specific (PIN code or order value).
 */
export function CodOption({ amount, pinEligible, maxAmount = 50000, fee = COD_FEE, pincode, onConfirm, className }: CodOptionProps) {
  const [busy, setBusy] = useState(false);
  const reason = !pinEligible
    ? `Cash on Delivery isn’t available for PIN code ${pincode ?? "this address"}.`
    : amount > maxAmount
      ? `Cash on Delivery is available on orders up to ${formatPrice(maxAmount)}.`
      : null;

  if (reason) {
    return (
      <Inset asChild className={cn("flex items-start gap-2 text-body text-fg-muted", className)}>
        <p role="status" data-slot="cod-option">
          <CircleAlert aria-hidden className="mt-0.5 size-icon-md shrink-0" />
          {reason} Choose UPI or a card to continue.
        </p>
      </Inset>
    );
  }

  return (
    <form
      noValidate
      data-slot="cod-option"
      className={cn("flex flex-col gap-4", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          await onConfirm();
        } finally {
          setBusy(false);
        }
      }}
    >
      <Inset asChild className="flex flex-col gap-3 text-body">
        <ul>
          <li className="flex items-start gap-3">
            <Banknote aria-hidden className="mt-0.5 size-icon-md shrink-0 text-fg-muted" />
            <span>
              Pay <span className="text-body-strong figures">{formatPrice(amount + fee)}</span> in cash when your order arrives
              <span className="block text-caption text-fg-muted figures">Includes a {formatPrice(fee)} Cash on Delivery fee</span>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Smartphone aria-hidden className="mt-0.5 size-icon-md shrink-0 text-fg-muted" />
            <span>You can also pay by UPI to the delivery partner. Keep exact change if paying cash.</span>
          </li>
        </ul>
      </Inset>
      <p className="text-caption text-fg-muted">Tip: pay online now and skip the {formatPrice(fee)} fee.</p>
      <PayButton amount={amount + fee} loading={busy} label={`Place order · ${formatPrice(amount + fee)}`} />
    </form>
  );
}
