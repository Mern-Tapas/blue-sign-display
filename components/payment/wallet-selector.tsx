"use client";

import { useState } from "react";
import { Wallet as WalletIcon } from "lucide-react";
import { RadioCard, RadioCardGroup } from "@/components/ui/radio-card";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { Wallet } from "@/lib/data/types";
import { PayButton } from "./pay-button";

export type WalletSelectorProps = {
  wallets: Wallet[];
  amount: number;
  onPay: (details: { walletId: string }) => void | Promise<void>;
  className?: string;
};

/** Wallets with linked balances; a linked wallet short of the amount is disabled and says by how much. */
export function WalletSelector({ wallets, amount, onPay, className }: WalletSelectorProps) {
  const usable = (w: Wallet) => !w.linked || w.balance === undefined || w.balance >= amount;
  const [walletId, setWalletId] = useState(wallets.find(usable)?.id ?? "");
  const [paying, setPaying] = useState(false);
  const wallet = wallets.find((w) => w.id === walletId);

  return (
    <form
      noValidate
      data-slot="wallet-selector"
      className={cn("flex flex-col gap-4", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        if (!wallet) return;
        setPaying(true);
        try {
          await onPay({ walletId });
        } finally {
          setPaying(false);
        }
      }}
    >
      <RadioCardGroup aria-label="Wallet" value={walletId} onValueChange={setWalletId} className="gap-2">
        {wallets.map((w) => {
          const short = w.linked && w.balance !== undefined && w.balance < amount;
          return (
            <RadioCard
              key={w.id}
              value={w.id}
              disabled={short}
              size="sm"
              icon={<WalletIcon aria-hidden />}
              title={<span className={cn(short && "text-fg-muted")}>{w.name}</span>}
              description={
                <span className={cn("figures", short && "text-warning-fg")}>
                  {w.linked
                    ? short
                      ? `Balance ${formatPrice(w.balance!)} · ${formatPrice(amount - w.balance!)} short`
                      : `Balance ${formatPrice(w.balance ?? 0)}`
                    : "You’ll log in to link this wallet"}
                </span>
              }
            />
          );
        })}
      </RadioCardGroup>
      <PayButton amount={amount} loading={paying} disabled={!wallet} />
    </form>
  );
}
