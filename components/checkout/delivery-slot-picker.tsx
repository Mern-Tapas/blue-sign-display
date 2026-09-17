"use client";

import { RadioGroup } from "radix-ui";
import { Moon, Sun, Sunrise } from "lucide-react";
import { RadioCard, RadioCardGroup, selectableCardClass } from "@/components/ui/radio-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { formatPrice, LOCALE } from "@/lib/format";
import { useHydrated } from "@/lib/use-hydrated";

export type DeliverySlot = { id: string; label: string; time: string; fee?: number; /** Fully booked. */ full?: boolean };

export type DeliverySlotValue = { date: string; slot: string } | null;

export type DeliverySlotPickerProps = {
  value: DeliverySlotValue;
  onValueChange: (value: { date: string; slot: string }) => void;
  /** First deliverable day offset from today. */
  startInDays?: number;
  days?: number;
  slots?: DeliverySlot[];
  /** Mark slots full for a date (yyyy-mm-dd) — from inventory in production. */
  isFull?: (date: string, slotId: string) => boolean;
  className?: string;
};

const defaultSlots: DeliverySlot[] = [
  { id: "morning", label: "Morning", time: "9 AM – 12 PM" },
  { id: "afternoon", label: "Afternoon", time: "12 – 4 PM" },
  { id: "evening", label: "Evening", time: "4 – 9 PM", fee: 29 },
];

const slotIcons: Record<string, React.ReactNode> = { morning: <Sunrise />, afternoon: <Sun />, evening: <Moon /> };

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * Scheduled delivery: date chips for the next few days (dates computed on the client, so the
 * list is never stale), then time slots with any fee and fully booked slots disabled.
 */
export function DeliverySlotPicker({ value, onValueChange, startInDays = 1, days = 5, slots = defaultSlots, isFull, className }: DeliverySlotPickerProps) {
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div aria-hidden className={cn("flex flex-col gap-3", className)}>
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    );
  }

  const today = new Date();
  const dates = Array.from({ length: days }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + startInDays + i);
    return {
      key: iso(d),
      weekday: i === 0 && startInDays === 1 ? "Tomorrow" : new Intl.DateTimeFormat(LOCALE, { weekday: "short" }).format(d),
      day: d.getDate(),
      month: new Intl.DateTimeFormat(LOCALE, { month: "short" }).format(d),
      long: new Intl.DateTimeFormat(LOCALE, { weekday: "long", day: "numeric", month: "long" }).format(d),
    };
  });
  const date = value?.date ?? dates[0]!.key;

  return (
    <div data-slot="delivery-slot-picker" className={cn("flex flex-col gap-4", className)}>
      <RadioGroup.Root
        aria-label="Delivery date"
        orientation="horizontal"
        value={date}
        onValueChange={(d) => {
          const firstOpen = slots.find((s) => !s.full && !isFull?.(d, s.id));
          onValueChange({ date: d, slot: value?.slot && !isFull?.(d, value.slot) ? value.slot : (firstOpen?.id ?? slots[0]!.id) });
        }}
        className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 py-1"
      >
        {dates.map((d) => (
          <RadioGroup.Item
            key={d.key}
            value={d.key}
            aria-label={d.long}
            className={cn(
              selectableCardClass,
              "press w-auto min-w-16 shrink-0 flex-col items-center gap-0.5 px-3 py-2 text-center text-fg transition-[border-color,background-color,box-shadow,transform]",
              "data-[state=checked]:text-accent-soft-fg",
            )}
          >
            <span className="text-caption">{d.weekday}</span>
            <span className="text-heading-sm figures">{d.day}</span>
            <span className="text-caption">{d.month}</span>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>

      <RadioCardGroup
        aria-label="Delivery time"
        value={value?.date === date ? value.slot : ""}
        onValueChange={(slot) => onValueChange({ date, slot })}
        className="gap-2 sm:grid-cols-3"
      >
        {slots.map((s) => {
          const full = s.full || Boolean(isFull?.(date, s.id));
          return (
            <RadioCard
              key={s.id}
              value={s.id}
              disabled={full}
              size="sm"
              indicator={false}
              icon={<span aria-hidden className="contents">{slotIcons[s.id] ?? <Sun />}</span>}
              title={s.label}
              description={<span className="figures">{full ? "Fully booked" : s.time}</span>}
              aside={s.fee ? `+${formatPrice(s.fee)}` : <span className="text-success-fg">Free</span>}
            />
          );
        })}
      </RadioCardGroup>
    </div>
  );
}
