"use client";

import { CalendarClock, Store, Truck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RadioCard, RadioCardGroup } from "@/components/ui/radio-card";
import { formatPrice } from "@/lib/format";
import { DELIVERY_FEE, EXPRESS_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/data/india";

export type ShippingOption = {
  id: string;
  label: string;
  eta: string;
  price: number;
  icon?: "standard" | "express" | "pickup" | "scheduled";
  recommended?: boolean;
  /** Why the option can't be chosen (e.g. "Not available for this PIN code"). */
  unavailableReason?: string;
};

export const defaultShippingOptions: ShippingOption[] = [
  { id: "standard", label: "Standard delivery", eta: "Delivered in 3–5 days", price: 0, icon: "standard" },
  { id: "express", label: "Express delivery", eta: "Tomorrow by 9 PM", price: EXPRESS_FEE, icon: "express", recommended: true },
  { id: "scheduled", label: "Scheduled delivery", eta: "Pick a date and time slot", price: 0, icon: "scheduled" },
];

/** Builds options for a bag: standard is free above the threshold, otherwise the delivery fee applies. */
export function shippingOptionsFor(subtotal: number, { etaDays = 4, expressAvailable = true }: { etaDays?: number; expressAvailable?: boolean } = {}): ShippingOption[] {
  const free = subtotal >= FREE_DELIVERY_THRESHOLD;
  return [
    { id: "standard", label: "Standard delivery", eta: `Delivered in ${etaDays}–${etaDays + 2} days`, price: free ? 0 : DELIVERY_FEE, icon: "standard" },
    {
      id: "express",
      label: "Express delivery",
      eta: "Tomorrow by 9 PM",
      price: EXPRESS_FEE,
      icon: "express",
      recommended: expressAvailable,
      unavailableReason: expressAvailable ? undefined : "Not available for this PIN code",
    },
    { id: "scheduled", label: "Scheduled delivery", eta: "Pick a date and time slot", price: free ? 0 : DELIVERY_FEE, icon: "scheduled" },
  ];
}

const icons = { standard: Truck, express: Zap, pickup: Store, scheduled: CalendarClock };

export type ShippingMethodProps = {
  options?: ShippingOption[];
  value: string;
  onValueChange: (id: string) => void;
  className?: string;
};

/** Delivery speed choice in INR, with unavailable options disabled and explained. */
export function ShippingMethod({ options = defaultShippingOptions, value, onValueChange, className }: ShippingMethodProps) {
  return (
    <RadioCardGroup aria-label="Delivery method" value={value} onValueChange={onValueChange} className={className}>
      {options.map((o) => {
        const Icon = icons[o.icon ?? "standard"];
        return (
          <RadioCard
            key={o.id}
            value={o.id}
            disabled={Boolean(o.unavailableReason)}
            icon={<Icon aria-hidden />}
            title={
              <span className="flex items-center gap-2">
                {o.label}
                {o.recommended && !o.unavailableReason && (
                  <Badge size="sm" tone="accent">
                    Fastest
                  </Badge>
                )}
              </span>
            }
            description={o.unavailableReason ?? o.eta}
            aside={o.price === 0 ? <span className="text-success-fg">Free</span> : formatPrice(o.price)}
          />
        );
      })}
    </RadioCardGroup>
  );
}
