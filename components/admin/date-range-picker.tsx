"use client";

import { useState } from "react";
import { CalendarDays, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";
import { rangeLabel, rangePresets, resolveRange, type DateRangeValue } from "@/lib/date-range";

export type DateRangePickerProps = {
  value: DateRangeValue;
  onValueChange: (value: DateRangeValue) => void;
  /** Anchor date for presets (fixed in demos so server and client agree). */
  today: Date;
  /** Show the "Compare to previous period" switch. */
  comparable?: boolean;
  className?: string;
};

const toDate = (s: string) => new Date(`${s}T00:00:00`);
const toIso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * The filter every dashboard reader reaches for first: preset rows (check marks the choice),
 * a custom range tucked below a hairline, and an optional compare-to-previous switch.
 */
export function DateRangePicker({ value, onValueChange, today, comparable = true, className }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="secondary" leadingIcon={<CalendarDays aria-hidden />} trailingIcon={<ChevronDown aria-hidden />} className={className}>
          <span className="sr-only">Date range: </span>
          {rangeLabel(value)}
          {value.compare && <span className="text-fg-muted max-sm:hidden">· vs previous</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-1.5">
        <ul aria-label="Date range presets" className="flex flex-col">
          {rangePresets.map((p) => {
            const selected = value.preset === p.id;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    onValueChange({ ...resolveRange(p.id, today), compare: value.compare });
                    setOpen(false);
                  }}
                  className="state-layer focus-ring-row relative flex h-row-sm w-full items-center gap-2 rounded-md px-3 text-left text-body"
                >
                  <span className="flex size-icon-md items-center justify-center">{selected && <Check aria-hidden className="size-icon-md text-accent-fg" strokeWidth={2.5} />}</span>
                  <span className={cn("flex-1", selected && "text-body-strong")}>{p.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-1.5 flex flex-col gap-3 border-t border-border-subtle p-2 pt-3">
          <p className="text-caption text-fg-muted">Custom range</p>
          <div className="grid grid-cols-2 gap-2">
            <DatePicker
              aria-label="From"
              size="sm"
              value={toDate(value.from)}
              max={toDate(value.to)}
              onValueChange={(d) => onValueChange({ ...value, preset: "custom", from: toIso(d) })}
            />
            <DatePicker
              aria-label="To"
              size="sm"
              value={toDate(value.to)}
              min={toDate(value.from)}
              max={today}
              onValueChange={(d) => onValueChange({ ...value, preset: "custom", to: toIso(d) })}
            />
          </div>
          {comparable && (
            <Switch size="sm" label="Compare to previous period" checked={!!value.compare} onCheckedChange={(on) => onValueChange({ ...value, compare: on })} />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
