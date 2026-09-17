"use client";

import { useId, useState } from "react";
import { CircleHelp, CreditCard, ShieldCheck } from "lucide-react";
import { PaymentCardVisual } from "@/components/commerce/payment-card-visual";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";
import { cardBrandLabel, detectCardBrand, formatCardNumber, formatExpiry, validateCardNumber, validateCvv, validateExpiry, type CardBrand } from "@/lib/payment";
import { PayButton } from "./pay-button";

export type CardDetails = { last4: string; brand: CardBrand; expiry: string; name: string; save: boolean };

export type CardPaymentFormProps = {
  amount: number;
  /** Receives non-sensitive details only; the real PAN/CVV go to the gateway's hosted fields. */
  onPay: (details: CardDetails) => void | Promise<void>;
  submitLabel?: string;
  showVisual?: boolean;
  className?: string;
};

/**
 * Card entry with brand detection (Visa, Mastercard, RuPay, Amex), Luhn check, expiry and CVV
 * validation on blur and submit, and an RBI-tokenisation save option. Demo fields — production
 * must use the payment gateway's hosted inputs.
 */
export function CardPaymentForm({ amount, onPay, submitLabel, showVisual = true, className }: CardPaymentFormProps) {
  const id = useId();
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [save, setSave] = useState(true);
  const [errors, setErrors] = useState<{ number?: string; expiry?: string; cvv?: string; name?: string }>({});
  const [paying, setPaying] = useState(false);

  const digits = number.replace(/\D/g, "");
  const brand = detectCardBrand(digits);

  function validate() {
    const next = {
      number: validateCardNumber(number),
      expiry: validateExpiry(expiry),
      cvv: validateCvv(cvv, brand),
      name: name.trim().length < 2 ? "Enter the name on the card" : undefined,
    };
    setErrors(next);
    return next;
  }

  return (
    <form
      noValidate
      data-slot="card-payment-form"
      className={cn("flex flex-col gap-5", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        const next = validate();
        const first = (Object.keys(next) as (keyof typeof next)[]).find((k) => next[k]);
        if (first) return requestAnimationFrame(() => document.getElementById(`${id}-${first}`)?.focus());
        setPaying(true);
        try {
          await onPay({ last4: digits.slice(-4), brand, expiry, name: name.trim(), save });
        } finally {
          setPaying(false);
        }
      }}
    >
      <div className={cn("grid gap-5", showVisual && "md:grid-cols-[1fr_auto]")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id={`${id}-number`} label="Card number" error={errors.number} className="sm:col-span-2">
            <Input
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              value={number}
              onChange={(e) => {
                setNumber(formatCardNumber(e.target.value));
                if (errors.number) setErrors((er) => ({ ...er, number: undefined }));
              }}
              onBlur={() => number && setErrors((er) => ({ ...er, number: validateCardNumber(number) }))}
              startSlot={<CreditCard aria-hidden />}
              endSlot={brand !== "unknown" ? <span className="shrink-0 text-caption-strong text-fg-muted">{cardBrandLabel[brand]}</span> : undefined}
              className="figures tracking-wide"
            />
          </Field>
          <Field id={`${id}-expiry`} label="Expiry (MM/YY)" error={errors.expiry}>
            <Input
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => {
                setExpiry(formatExpiry(e.target.value));
                if (errors.expiry) setErrors((er) => ({ ...er, expiry: undefined }));
              }}
              onBlur={() => expiry && setErrors((er) => ({ ...er, expiry: validateExpiry(expiry) }))}
              className="figures"
            />
          </Field>
          <Field
            id={`${id}-cvv`}
            label="CVV"
            error={errors.cvv}
            labelAction={
              <Tooltip content={brand === "amex" ? "4 digits on the front of the card" : "3 digits on the back of the card"}>
                <button type="button" aria-label="What is CVV?" className="hit-area relative rounded-pill text-fg-muted hover:text-fg">
                  <CircleHelp aria-hidden className="size-icon-md" />
                </button>
              </Tooltip>
            }
          >
            <Input
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder={brand === "amex" ? "••••" : "•••"}
              maxLength={brand === "amex" ? 4 : 3}
              value={cvv}
              onChange={(e) => {
                setCvv(e.target.value.replace(/\D/g, ""));
                if (errors.cvv) setErrors((er) => ({ ...er, cvv: undefined }));
              }}
              className="figures"
            />
          </Field>
          <Field id={`${id}-name`} label="Name on card" error={errors.name} className="sm:col-span-2">
            <Input autoComplete="cc-name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
        </div>
        {showVisual && (
          <PaymentCardVisual
            brand={brand}
            last4={digits.length >= 4 ? digits.slice(-4) : "••••"}
            expiry={expiry || "MM/YY"}
            holder={name || undefined}
            variant="accent"
            className="hidden w-72 self-center md:flex"
          />
        )}
      </div>
      <Checkbox
        label="Save this card for faster checkout"
        description="Saved as a secure token as per RBI guidelines. We never store your card number or CVV."
        checked={save}
        onCheckedChange={(v) => setSave(v === true)}
      />
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-1.5 text-caption text-fg-muted">
          <ShieldCheck aria-hidden className="size-icon-sm" /> Your bank may ask for an OTP to confirm.
        </p>
        <PayButton amount={amount} loading={paying} label={submitLabel} />
      </div>
    </form>
  );
}
