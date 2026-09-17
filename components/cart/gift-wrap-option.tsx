"use client";

import { useId } from "react";
import { Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { IconTile } from "@/components/ui/icon-tile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { GIFT_WRAP_FEE } from "@/lib/data/india";

export type GiftWrap = { enabled: boolean; message: string; to: string; from: string };

export type GiftWrapOptionProps = {
  value: GiftWrap;
  onChange: (patch: Partial<GiftWrap>) => void;
  fee?: number;
  maxMessage?: number;
  className?: string;
};

/** Opt-in gift wrap with fee, recipient names and a card message. The invoice is left out of gifted parcels. */
export function GiftWrapOption({ value, onChange, fee = GIFT_WRAP_FEE, maxMessage = 150, className }: GiftWrapOptionProps) {
  const id = useId();
  return (
    <Card asChild variant="outline" padding="sm" className={cn("gap-4", className)}>
      <section data-slot="gift-wrap" aria-label="Gift wrap">
        <div className="flex items-start gap-3">
          <IconTile size="md" tone="accent">
            <Gift />
          </IconTile>
          <Checkbox
            className="flex-1"
            label={
              <span className="flex w-full items-center justify-between gap-2">
                <span className="text-body-strong">Gift wrap this order</span>
                <span className="text-fg-muted figures">+{formatPrice(fee)}</span>
              </span>
            }
            description="Wrapped with a handwritten-style card. Prices and invoice are not included in the parcel."
            checked={value.enabled}
            onCheckedChange={(v) => onChange({ enabled: v === true })}
          />
        </div>
        {value.enabled && (
          <div className="grid animate-fade-in gap-3 sm:grid-cols-2">
            <Field id={`${id}-to`} label="To">
              <Input size="sm" shape="rounded" autoComplete="off" placeholder="Recipient’s name" value={value.to} onChange={(e) => onChange({ to: e.target.value })} maxLength={40} />
            </Field>
            <Field id={`${id}-from`} label="From">
              <Input size="sm" shape="rounded" autoComplete="name" placeholder="Your name" value={value.from} onChange={(e) => onChange({ from: e.target.value })} maxLength={40} />
            </Field>
            <Field id={`${id}-msg`} label="Message" hint={`${value.message.length}/${maxMessage}`} className="sm:col-span-2">
              <Textarea rows={3} maxLength={maxMessage} placeholder="Happy birthday! Hope you love it." value={value.message} onChange={(e) => onChange({ message: e.target.value })} />
            </Field>
          </div>
        )}
      </section>
    </Card>
  );
}
