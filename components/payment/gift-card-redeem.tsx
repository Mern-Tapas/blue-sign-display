"use client";

import { useId, useState } from "react";
import { Gift, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Inset } from "@/components/ui/inset";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

export type GiftCardApplied = { last4: string; amount: number };

export type GiftCardRedeemProps = {
  /** Order total the gift card can cover. */
  orderTotal: number;
  applied: GiftCardApplied | null;
  /** Returns the available balance or throws with a message. */
  checkBalance: (cardNumber: string, pin: string) => Promise<number>;
  onApply: (applied: GiftCardApplied | null) => void;
  className?: string;
};

/**
 * Gift card as a partial payment: card number + PIN, balance check, apply up to the order total,
 * then the rest is paid with another method.
 */
export function GiftCardRedeem({ orderTotal, applied, checkBalance, onApply, className }: GiftCardRedeemProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  if (applied) {
    return (
      <Inset tone="success" size="sm" data-slot="gift-card-redeem" className={cn("flex items-center gap-3", className)}>
        <Gift aria-hidden className="size-icon-lg shrink-0" />
        <p className="min-w-0 flex-1 text-body">
          Gift card •••• {applied.last4} applied · <span className="text-body-strong figures">{formatPrice(applied.amount)}</span>
          {applied.amount < orderTotal && <span className="block text-caption figures">Pay the remaining {formatPrice(orderTotal - applied.amount)} below</span>}
        </p>
        <button type="button" aria-label="Remove gift card" onClick={() => onApply(null)} className="state-layer hit-area relative flex size-control-sm items-center justify-center rounded-pill">
          <X aria-hidden className="size-icon-md" />
        </button>
      </Inset>
    );
  }

  return (
    <Card asChild variant="outline" padding="none" radius="lg" className={cn("gap-3 p-3", className)}>
      <section data-slot="gift-card-redeem" aria-label="Gift card">
        <button type="button" aria-expanded={open} aria-controls={`${id}-form`} onClick={() => setOpen((o) => !o)} className="flex items-center gap-3 rounded-lg text-left">
          <Gift aria-hidden className="size-icon-lg text-accent-fg" />
          <span className="flex-1 text-body-strong">Have a gift card?</span>
          <span className="text-label text-accent-fg">{open ? "Close" : "Redeem"}</span>
        </button>
        {open && (
          <form
            id={`${id}-form`}
            noValidate
            className="grid animate-fade-in gap-3 sm:grid-cols-[1fr_8rem_auto] sm:items-end"
            onSubmit={async (e) => {
              e.preventDefault();
              const digits = number.replace(/\D/g, "");
              if (digits.length !== 16) return setError("Enter the 16-digit gift card number");
              if (!/^\d{6}$/.test(pin)) return setError("Enter the 6-digit PIN");
              setBusy(true);
              try {
                const balance = await checkBalance(digits, pin);
                if (balance <= 0) throw new Error("This gift card has no balance left");
                onApply({ last4: digits.slice(-4), amount: Math.min(balance, orderTotal) });
                setError(undefined);
              } catch (err) {
                setError(err instanceof Error ? err.message : "We couldn’t check this gift card");
              } finally {
                setBusy(false);
              }
            }}
          >
            <Field id={`${id}-number`} label="Gift card number" error={error}>
              <Input inputMode="numeric" autoComplete="off" value={number} onChange={(e) => setNumber(e.target.value.replace(/[^\d ]/g, "").slice(0, 19))} placeholder="16 digits" className="figures" />
            </Field>
            <Field id={`${id}-pin`} label="PIN">
              <Input type="password" inputMode="numeric" autoComplete="off" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} placeholder="6 digits" className="figures" />
            </Field>
            <Button type="submit" variant="secondary" loading={busy}>
              Apply
            </Button>
          </form>
        )}
      </section>
    </Card>
  );
}
