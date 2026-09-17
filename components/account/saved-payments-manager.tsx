"use client";

import { useId, useState } from "react";
import { AtSign, CreditCard, Link2, Plus, ShieldCheck, Trash2, Wallet as WalletIcon } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { SavedCard, Wallet } from "@/lib/data/types";
import { cardBrandLabel, validateUpiId } from "@/lib/payment";

export type SavedPaymentsManagerProps = {
  cards: SavedCard[];
  upiIds: string[];
  wallets: Wallet[];
  onCardsChange: (cards: SavedCard[]) => void;
  onUpiChange: (ids: string[]) => void;
  onWalletsChange: (wallets: Wallet[]) => void;
  className?: string;
};

function Row({ children }: { children: React.ReactNode }) {
  return (
    <Card variant="outline" padding="sm" radius="xl" className="flex-row items-center">
      {children}
    </Card>
  );
}

/** Manage tokenised cards, UPI IDs and linked wallets. Removal always confirms; nothing sensitive is shown beyond the last 4 digits. */
export function SavedPaymentsManager({ cards, upiIds, wallets, onCardsChange, onUpiChange, onWalletsChange, className }: SavedPaymentsManagerProps) {
  const id = useId();
  const [newUpi, setNewUpi] = useState("");
  const [upiError, setUpiError] = useState<string>();

  return (
    <Tabs defaultValue="cards" data-slot="saved-payments" className={cn(className)}>
      <TabsList>
        <TabsTrigger value="cards" count={cards.length}>
          Cards
        </TabsTrigger>
        <TabsTrigger value="upi" count={upiIds.length}>
          UPI IDs
        </TabsTrigger>
        <TabsTrigger value="wallets" count={wallets.filter((w) => w.linked).length}>
          Wallets
        </TabsTrigger>
      </TabsList>

      <TabsContent value="cards" className="flex flex-col gap-3">
        {cards.length === 0 && <p className="text-body text-fg-muted">No saved cards. Tick “Save this card” at checkout to add one.</p>}
        {cards.map((c) => (
          <Row key={c.id}>
            <span aria-hidden className="flex h-9 w-14 shrink-0 items-center justify-center rounded-sm bg-surface-contrast text-caption-strong text-fg-on-contrast italic">
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
            <ConfirmDialog
              trigger={
                <Button variant="ghost" size="sm" leadingIcon={<Trash2 aria-hidden />} aria-label={`Remove card ending ${c.last4}`}>
                  <span className="max-sm:sr-only">Remove</span>
                </Button>
              }
              tone="danger"
              title={`Remove card •••• ${c.last4}?`}
              description="The saved token is deleted. You can add the card again at checkout."
              confirmLabel="Remove card"
              onConfirm={() => {
                onCardsChange(cards.filter((x) => x.id !== c.id));
                toast({ title: "Card removed", tone: "info" });
              }}
            />
          </Row>
        ))}
        <p className="flex items-center gap-2 text-caption text-fg-muted">
          <ShieldCheck aria-hidden className="size-icon-sm text-success-fg" /> Cards are stored as secure tokens as per RBI guidelines. We never store the full number or CVV.
        </p>
      </TabsContent>

      <TabsContent value="upi" className="flex flex-col gap-3">
        {upiIds.map((u) => (
          <Row key={u}>
            <AtSign aria-hidden className="size-icon-lg text-fg-muted" />
            <span className="flex-1 text-body-strong figures">{u}</span>
            <ConfirmDialog
              trigger={
                <Button variant="ghost" size="sm" leadingIcon={<Trash2 aria-hidden />} aria-label={`Remove ${u}`}>
                  <span className="max-sm:sr-only">Remove</span>
                </Button>
              }
              tone="danger"
              title="Remove this UPI ID?"
              description={u}
              confirmLabel="Remove"
              onConfirm={() => onUpiChange(upiIds.filter((x) => x !== u))}
            />
          </Row>
        ))}
        <form
          noValidate
          className="flex flex-col gap-2 sm:flex-row sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            const err = validateUpiId(newUpi) ?? (upiIds.includes(newUpi.trim()) ? "This UPI ID is already saved" : undefined);
            if (err) return setUpiError(err);
            onUpiChange([...upiIds, newUpi.trim()]);
            setNewUpi("");
            toast({ title: "UPI ID saved", tone: "success" });
          }}
        >
          <Field id={`${id}-upi`} label="Add a UPI ID" error={upiError} className="flex-1">
            <Input
              value={newUpi}
              autoCapitalize="none"
              spellCheck={false}
              placeholder="name@bank"
              onChange={(e) => {
                setNewUpi(e.target.value);
                setUpiError(undefined);
              }}
            />
          </Field>
          <Button type="submit" variant="secondary" leadingIcon={<Plus aria-hidden />}>
            Save
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="wallets" className="flex flex-col gap-3">
        {wallets.map((w) => (
          <Row key={w.id}>
            <WalletIcon aria-hidden className="size-icon-lg text-fg-muted" />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-body-strong">{w.name}</span>
              <span className="text-caption text-fg-muted figures">{w.linked ? `Linked · balance ${formatPrice(w.balance ?? 0)}` : "Not linked"}</span>
            </span>
            {w.linked ? (
              <>
                <Badge tone="success" size="sm">
                  Linked
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => onWalletsChange(wallets.map((x) => (x.id === w.id ? { ...x, linked: false, balance: undefined } : x)))}>
                  Unlink
                </Button>
              </>
            ) : (
              <Button variant="secondary" size="sm" leadingIcon={<Link2 aria-hidden />} onClick={() => toast({ title: `Demo: you’d log in to ${w.name} to link it` })}>
                Link
              </Button>
            )}
          </Row>
        ))}
        <p className="flex items-center gap-2 text-caption text-fg-muted">
          <CreditCard aria-hidden className="size-icon-sm" /> Linked wallets pay without leaving checkout when the balance covers the order.
        </p>
      </TabsContent>
    </Tabs>
  );
}
