"use client";

import { Alert } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { formatPrice } from "@/lib/format";
import { SettingsSection } from "../admin-display";
import { Meter } from "../metrics";
import { todaysCodExposure, type SettingsSectionFormProps, type StoreSettings } from "./settings-data";

type PaymentKey = keyof StoreSettings["payments"];

const methods: { key: PaymentKey; label: string; description: string }[] = [
  { key: "upi", label: "UPI", description: "GPay, PhonePe, Paytm and any UPI ID" },
  { key: "cards", label: "Credit and debit cards", description: "Visa, Mastercard, RuPay, Amex" },
  { key: "netbanking", label: "Net banking", description: "58 banks" },
  { key: "wallets", label: "Wallets", description: "Paytm, Amazon Pay, Mobikwik" },
  { key: "emi", label: "EMI", description: "Card and cardless EMI above ₹3,000" },
];

const rupee = <span className="text-body text-fg-muted">₹</span>;

/** Which payment methods checkout offers, and how much Cash on Delivery risk the store accepts per day. */
export function PaymentsSection({ draft, update, error, touch }: SettingsSectionFormProps) {
  const p = draft.payments;
  const set = <K extends PaymentKey>(key: K, value: StoreSettings["payments"][K]) => update((d) => ({ ...d, payments: { ...d.payments, [key]: value } }));
  const limit = Number(p.codLimit) || 0;
  const methodsError = error("payments.methods");

  return (
    <SettingsSection title="Payments" description="Prepaid methods settle through Razorpay. Cash on Delivery orders are collected by the courier and remitted with the weekly settlement.">
      <fieldset className="@container flex flex-col gap-4">
        <legend className="mb-4 text-body-strong">Prepaid methods</legend>
        <div className="grid gap-x-8 gap-y-4 @lg:grid-cols-2">
          {methods.map((m) => (
            <Switch key={m.key} label={m.label} description={m.description} checked={p[m.key] as boolean} onCheckedChange={(on) => set(m.key, on)} />
          ))}
        </div>
        {methodsError && (
          <Alert tone="danger" size="sm" role="alert">
            {methodsError}
          </Alert>
        )}
      </fieldset>

      <div className="flex flex-col gap-4 border-t border-border-subtle pt-5">
        <Switch label="Cash on Delivery" description="Shoppers pay the courier in cash or UPI at the door" checked={p.cod} onCheckedChange={(on) => set("cod", on)} />
        {p.cod ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Daily COD limit" required error={error("payments.codLimit")} hint="COD turns off for the day once reached">
                <Input name="payments.codLimit" inputMode="numeric" value={p.codLimit} onChange={(e) => set("codLimit", e.target.value.replace(/\D/g, ""))} onBlur={() => touch("payments.codLimit")} startSlot={rupee} className="figures" />
              </Field>
              <Field label="COD fee" required error={error("payments.codFee")} hint="Added to every COD order">
                <Input name="payments.codFee" inputMode="numeric" value={p.codFee} onChange={(e) => set("codFee", e.target.value.replace(/\D/g, ""))} onBlur={() => touch("payments.codFee")} startSlot={rupee} className="figures" />
              </Field>
            </div>
            {limit > 0 && (
              <Meter
                label="Today’s COD exposure"
                value={todaysCodExposure}
                max={limit}
                valueLabel={`${formatPrice(todaysCodExposure)} of ${formatPrice(limit)}`}
              />
            )}
          </>
        ) : (
          <p className="text-caption text-fg-muted">COD is off. Shoppers who only pay in cash can’t check out; about a quarter of orders used COD last month.</p>
        )}
      </div>
    </SettingsSection>
  );
}
