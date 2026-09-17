"use client";

import { useId, useState } from "react";
import { RadioGroup } from "radix-ui";
import { CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioIndicator, selectableCardClass } from "@/components/ui/radio-card";
import { TextButton } from "@/components/ui/text-button";
import { cn } from "@/lib/cn";
import type { SavedCard } from "@/lib/data/types";
import { cardBrandLabel, validateCvv } from "@/lib/payment";
import { PayButton } from "./pay-button";

export type SavedCardsListProps = {
  cards: SavedCard[];
  amount: number;
  onPay: (details: { cardId: string }) => void | Promise<void>;
  /** "Use a new card" row content switch. */
  onUseNewCard?: () => void;
  /** Today as yyyy-mm for "expires soon" (passed in to avoid hydration drift). */
  thisMonth?: string;
  className?: string;
};

function expiresSoon(expiry: string, thisMonth?: string) {
  if (!thisMonth) return false;
  const [mm, yy] = expiry.split("/");
  const [y, m] = thisMonth.split("-").map(Number);
  const months = (2000 + Number(yy) - y!) * 12 + (Number(mm) - m!);
  return months >= 0 && months <= 2;
}

/**
 * Tokenised saved cards: pick one and enter only its CVV (never stored). Expiring-soon cards
 * are flagged so the shopper isn't surprised by a decline.
 */
export function SavedCardsList({ cards, amount, onPay, onUseNewCard, thisMonth, className }: SavedCardsListProps) {
  const id = useId();
  const [selected, setSelected] = useState(cards[0]?.id ?? "");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState<string>();
  const [paying, setPaying] = useState(false);
  const card = cards.find((c) => c.id === selected);

  return (
    <form
      noValidate
      data-slot="saved-cards"
      className={cn("flex flex-col gap-4", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        if (!card) return;
        const err = validateCvv(cvv, card.brand);
        if (err) {
          setError(err);
          return requestAnimationFrame(() => document.getElementById(`${id}-cvv`)?.focus());
        }
        setPaying(true);
        try {
          await onPay({ cardId: card.id });
        } finally {
          setPaying(false);
        }
      }}
    >
      <RadioGroup.Root
        aria-label="Saved cards"
        value={selected}
        onValueChange={(v) => {
          setSelected(v);
          setCvv("");
          setError(undefined);
        }}
        className="flex flex-col gap-2"
      >
        {cards.map((c) => (
          <div key={c.id} className={cn(selectableCardClass, "flex-col gap-0", selected === c.id && "selected border-transparent")}>
            <RadioGroup.Item value={c.id} className="group flex w-full items-center gap-3 rounded-xl p-3 text-left">
              <RadioIndicator />
              <span aria-hidden className="flex h-8 w-12 shrink-0 items-center justify-center rounded-sm bg-surface-contrast text-caption-strong text-fg-on-contrast italic">
                {c.brand === "mastercard" ? "MC" : c.brand === "rupay" ? "RuPay" : c.brand.toUpperCase()}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-body-strong figures">
                  {c.bank} •••• {c.last4}
                </span>
                <span className="text-caption text-fg-muted figures">
                  {cardBrandLabel[c.brand]} · expires {c.expiry}
                  {c.nickname ? ` · ${c.nickname}` : ""}
                </span>
              </span>
              {expiresSoon(c.expiry, thisMonth) && (
                <Badge tone="warning" size="sm">
                  Expires soon
                </Badge>
              )}
            </RadioGroup.Item>
            {selected === c.id && (
              <div className="flex animate-fade-in flex-wrap items-end gap-3 px-3 pb-3 pl-11">
                <Field id={`${id}-cvv`} label="CVV" error={error} className="w-32">
                  <Input
                    type="password"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    maxLength={c.brand === "amex" ? 4 : 3}
                    placeholder={c.brand === "amex" ? "••••" : "•••"}
                    value={cvv}
                    onChange={(e) => {
                      setCvv(e.target.value.replace(/\D/g, ""));
                      setError(undefined);
                    }}
                    size="sm"
                    className="figures"
                  />
                </Field>
                <p className="pb-2 text-caption text-fg-muted">CVV is never saved.</p>
              </div>
            )}
          </div>
        ))}
      </RadioGroup.Root>
      {onUseNewCard && (
        <TextButton onClick={onUseNewCard} className="gap-2 self-start">
          <CreditCard aria-hidden /> Use a new card
        </TextButton>
      )}
      <PayButton amount={amount} loading={paying} disabled={!card} />
    </form>
  );
}
