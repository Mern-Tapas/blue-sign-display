"use client";

import { useState } from "react";
import { RadioGroup } from "radix-ui";
import { Landmark } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { Field } from "@/components/ui/field";
import { IconTile } from "@/components/ui/icon-tile";
import { selectableCardClass } from "@/components/ui/radio-card";
import { cn } from "@/lib/cn";
import type { Bank } from "@/lib/data/types";
import { PayButton } from "./pay-button";

export type NetBankingSelectorProps = {
  banks: Bank[];
  amount: number;
  onPay: (details: { bankId: string }) => void | Promise<void>;
  className?: string;
};

/** Popular banks as tiles plus a searchable list of every other bank; paying redirects to the bank's site. */
export function NetBankingSelector({ banks, amount, onPay, className }: NetBankingSelectorProps) {
  const [bankId, setBankId] = useState<string | null>(null);
  const [error, setError] = useState<string>();
  const [paying, setPaying] = useState(false);
  const popular = banks.filter((b) => b.popular);
  const bank = banks.find((b) => b.id === bankId);

  return (
    <form
      noValidate
      data-slot="net-banking"
      className={cn("flex flex-col gap-5", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        if (!bankId) return setError("Choose your bank to continue");
        setPaying(true);
        try {
          await onPay({ bankId });
        } finally {
          setPaying(false);
        }
      }}
    >
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-label">Popular banks</legend>
        <RadioGroup.Root
          aria-label="Popular banks"
          value={popular.some((b) => b.id === bankId) ? bankId! : ""}
          onValueChange={(v) => {
            setBankId(v);
            setError(undefined);
          }}
          className="grid grid-cols-2 gap-2 sm:grid-cols-3"
        >
          {popular.map((b) => (
            <RadioGroup.Item
              key={b.id}
              value={b.id}
              className={cn(selectableCardClass, "flex-col items-center gap-1.5 p-3 text-center")}
            >
              <IconTile size="sm" tone="muted" className="group-data-[state=checked]:bg-surface">
                <Landmark />
              </IconTile>
              <span className="text-label">{b.short}</span>
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </fieldset>
      <Field label="All other banks" error={error}>
        <Combobox
          options={banks.map((b) => ({ value: b.id, label: b.name, keywords: [b.short] }))}
          value={bankId}
          onValueChange={(v) => {
            setBankId(v);
            setError(undefined);
          }}
          placeholder="Select your bank"
          searchPlaceholder="Search banks"
        />
      </Field>
      <p className="text-caption text-fg-muted">You’ll be taken to {bank ? bank.name : "your bank"}’s secure page to log in and approve the payment.</p>
      <PayButton amount={amount} loading={paying} />
    </form>
  );
}
