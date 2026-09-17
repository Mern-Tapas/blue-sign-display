"use client";

import { Banknote, CreditCard, Smartphone } from "lucide-react";
import { RadioCard, RadioCardGroup } from "@/components/ui/radio-card";
import { cn } from "@/lib/cn";

export type PaymentMethodValue = "upi" | "card" | "cod";

export type PaymentMethodProps = {
  value: PaymentMethodValue;
  onValueChange: (v: PaymentMethodValue) => void;
  /** Hide COD when the PIN or order value doesn't allow it. */
  codAvailable?: boolean;
  className?: string;
};

/**
 * Compact method picker for tight spaces (quick checkout, retry screens). The full checkout uses
 * PaymentOptionsList with each method's form.
 */
export function PaymentMethod({ value, onValueChange, codAvailable = true, className }: PaymentMethodProps) {
  return (
    <RadioCardGroup aria-label="Payment method" value={value} onValueChange={(v) => onValueChange(v as PaymentMethodValue)} className={cn("sm:grid-cols-3", className)}>
      <RadioCard value="upi" icon={<Smartphone aria-hidden />} title="UPI" description="Google Pay, PhonePe, any UPI ID" />
      <RadioCard value="card" icon={<CreditCard aria-hidden />} title="Card" description="Credit, debit, RuPay" />
      <RadioCard value="cod" icon={<Banknote aria-hidden />} title="Cash on Delivery" description={codAvailable ? "₹19 fee" : "Not available here"} disabled={!codAvailable} />
    </RadioCardGroup>
  );
}
