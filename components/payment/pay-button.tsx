"use client";

import { Lock } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

/** Shared primary action for every payment method: "Pay ₹21,596" with a lock, full width on phones. */
export function PayButton({ amount, label, ...props }: Omit<ButtonProps, "children"> & { amount: number; label?: string }) {
  return (
    <Button type="submit" size="lg" leadingIcon={<Lock aria-hidden />} className="w-full sm:w-auto sm:min-w-56" {...props}>
      {label ?? `Pay ${formatPrice(amount)}`}
    </Button>
  );
}
