"use client";

import { useId, useState } from "react";
import { Gift, Plus } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { IconTile } from "@/components/ui/icon-tile";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";
import { formatDate, formatPrice } from "@/lib/format";
import type { GiftCard } from "@/lib/data/account";

export type GiftCardsWalletProps = {
  cards: GiftCard[];
  /** yyyy-mm-dd, for "expires soon". */
  today: string;
  /** Adds a card to the account; returns it or throws with a message. */
  onAdd: (number: string, pin: string) => Promise<GiftCard>;
  className?: string;
};

/** Total gift card balance, each card's remaining value and expiry, and adding a card by number + PIN. */
export function GiftCardsWallet({ cards, today, onAdd, className }: GiftCardsWalletProps) {
  const id = useId();
  const [list, setList] = useState(cards);
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const total = list.reduce((n, c) => n + c.balance, 0);
  const soon = (iso: string) => {
    if (!today) return false;
    const days = (new Date(`${iso}T00:00:00`).getTime() - new Date(`${today}T00:00:00`).getTime()) / 86400000;
    return days >= 0 && days <= 30;
  };

  return (
    <section data-slot="gift-cards-wallet" aria-label="Gift cards" className={cn("flex flex-col gap-4", className)}>
      <Card variant="accent" className="flex-row flex-wrap items-center justify-between">
        <div>
          <p className="text-body text-fg-on-accent-muted">Gift card balance</p>
          <p className="text-figure-xl figures">{formatPrice(total)}</p>
          <p className="text-caption text-fg-on-accent-muted">Applied at checkout under “Have a gift card?”</p>
        </div>
        <Button variant="inverse" leadingIcon={<Plus aria-hidden />} onClick={() => setOpen(true)}>
          Add gift card
        </Button>
      </Card>
      <ul className="grid gap-3 md:grid-cols-2">
        {list.map((c) => (
          <Card key={c.id} asChild className="gap-3">
            <li>
              <div className="flex items-center gap-3">
                <IconTile size="md" tone="accent">
                  <Gift />
                </IconTile>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-body-strong figures">Gift card •••• {c.last4}</span>
                  <span className="text-caption text-fg-muted">{c.from ? `From ${c.from}` : "BlueSigns gift card"}</span>
                </div>
                {soon(c.expiresOn) && (
                  <Badge tone="warning" size="sm">
                    Expires soon
                  </Badge>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-label figures">
                  <span>{formatPrice(c.balance)} left</span>
                  <span className="text-fg-muted">of {formatPrice(c.original)}</span>
                </div>
                <Progress value={c.balance} max={c.original} size="sm" aria-label={`Gift card •••• ${c.last4} balance`} />
              </div>
              <p className="text-caption text-fg-muted">Valid till {formatDate(c.expiresOn)}</p>
            </li>
          </Card>
        ))}
      </ul>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setNumber(""); setPin(""); setError(undefined); } }}>
        <DialogContent size="sm">
          <form
            noValidate
            className="flex flex-col"
            onSubmit={async (e) => {
              e.preventDefault();
              const digits = number.replace(/\D/g, "");
              if (digits.length !== 16) return setError("Enter the 16-digit gift card number");
              if (!/^\d{6}$/.test(pin)) return setError("Enter the 6-digit PIN");
              setBusy(true);
              try {
                const card = await onAdd(digits, pin);
                setList((l) => [card, ...l]);
                setOpen(false);
                toast({ title: "Gift card added", description: `${formatPrice(card.balance)} added to your balance`, tone: "success" });
              } catch (err) {
                setError(err instanceof Error ? err.message : "We couldn’t add this gift card");
              } finally {
                setBusy(false);
              }
            }}
          >
            <DialogHeader title="Add a gift card" description="The balance is added to your account and used at checkout." />
            <DialogBody className="flex flex-col gap-4">
              <Field id={`${id}-number`} label="Gift card number" error={error}>
                <Input inputMode="numeric" autoComplete="off" value={number} onChange={(e) => setNumber(e.target.value.replace(/[^\d ]/g, "").slice(0, 19))} className="figures" />
              </Field>
              <Field id={`${id}-pin`} label="PIN" hint="Scratch the back of the card to reveal it">
                <Input type="password" inputMode="numeric" autoComplete="off" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} className="figures" />
              </Field>
            </DialogBody>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={busy}>
                Add to account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
