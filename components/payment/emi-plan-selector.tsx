"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Inset } from "@/components/ui/inset";
import { RadioCard, RadioCardGroup } from "@/components/ui/radio-card";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { emiAmount } from "@/lib/data/india";
import type { EmiBank } from "@/lib/emi";
import { PayButton } from "./pay-button";

export type EmiPlanSelectorProps = {
  banks: EmiBank[];
  amount: number;
  /** Minimum order value for EMI. */
  minAmount?: number;
  onContinue: (details: { bankId: string; months: number }) => void | Promise<void>;
  className?: string;
};

/**
 * Credit card EMI: choose a bank, compare tenures (monthly amount, interest, total, no-cost
 * badge), then continue to card details. Orders under the minimum explain why EMI is off.
 */
export function EmiPlanSelector({ banks, amount, minAmount = 3000, onContinue, className }: EmiPlanSelectorProps) {
  const [bankId, setBankId] = useState(banks[0]?.id ?? "");
  const [months, setMonths] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const bank = banks.find((b) => b.id === bankId);

  if (amount < minAmount) {
    return (
      <Inset asChild className={cn("text-body text-fg-muted", className)}>
        <p>EMI is available on orders of {formatPrice(minAmount)} and above.</p>
      </Inset>
    );
  }

  return (
    <form
      noValidate
      data-slot="emi-plan-selector"
      className={cn("flex flex-col gap-4", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        if (!months) return;
        setBusy(true);
        try {
          await onContinue({ bankId, months: Number(months) });
        } finally {
          setBusy(false);
        }
      }}
    >
      <Select
        aria-label="Card issuing bank"
        prefix="Bank:"
        value={bankId}
        onValueChange={(v) => {
          setBankId(v);
          setMonths("");
        }}
        options={banks.map((b) => ({ value: b.id, label: b.name }))}
        className="sm:max-w-80"
      />
      <RadioCardGroup aria-label={`${bank?.name ?? "Bank"} EMI plans`} value={months} onValueChange={setMonths} className="gap-2">
        {bank?.plans.map((p) => {
          const monthly = emiAmount(amount, p.months, p.interestRate);
          const total = p.noCost ? amount : monthly * p.months;
          return (
            <RadioCard
              key={p.months}
              value={String(p.months)}
              size="sm"
              title={
                <span className="flex items-center gap-2 figures">
                  {formatPrice(monthly)} × {p.months} months
                  {p.noCost && (
                    <Badge tone="success" size="sm">
                      No cost
                    </Badge>
                  )}
                </span>
              }
              description={<span className="figures">{p.noCost ? "Interest refunded as instant discount" : `${p.interestRate}% p.a. · interest ${formatPrice(total - amount)}`}</span>}
              aside={<span className="text-label">{formatPrice(total)}</span>}
            />
          );
        })}
      </RadioCardGroup>
      <p className="text-caption text-fg-muted">Your card needs an EMI limit of at least {formatPrice(amount)}. Banks may add a processing fee and GST on interest.</p>
      <PayButton amount={amount} loading={busy} disabled={!months} label={months ? `Continue with ${bank?.name ?? "bank"} card` : "Choose a plan"} />
    </form>
  );
}
