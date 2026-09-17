"use client";

import { useState } from "react";
import { RadioGroup } from "radix-ui";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/** Perceived luminance check for #rrggbb colors — picks a legible check-mark color. */
export function isLightColor(hex: string) {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
  if (!m) return false;
  const [r, g, b] = [m[1], m[2], m[3]].map((h) => Number.parseInt(h!, 16));
  return 0.299 * r! + 0.587 * g! + 0.114 * b! > 160;
}

export type SwatchOption = {
  value: string;
  label?: string;
  /** CSS color for color swatches. */
  color?: string;
  disabled?: boolean;
};

export type SwatchGroupProps = Omit<React.ComponentProps<typeof RadioGroup.Root>, "children"> & {
  type: "color" | "size";
  options: SwatchOption[];
  label?: string;
  /** Show the selected value next to the label ("Color: Violet"). */
  showSelected?: boolean;
  size?: "sm" | "md";
  labelAction?: React.ReactNode;
};

/** Color or size picker — radio semantics, arrow-key navigation, unavailable options struck through. */
export function SwatchGroup({
  type,
  options,
  label,
  showSelected = true,
  size = "md",
  value,
  defaultValue,
  onValueChange,
  labelAction,
  className,
  ...props
}: SwatchGroupProps) {
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const selected = options.find((o) => o.value === current);
  return (
    <div data-slot="swatch-group" className={cn("flex flex-col gap-3", className)}>
      {label && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-label">
            {label}
            {showSelected && selected && <span className="ml-1.5 font-normal text-fg-muted">{selected.label ?? selected.value}</span>}
          </p>
          {labelAction}
        </div>
      )}
      <RadioGroup.Root
        aria-label={label}
        value={current}
        onValueChange={(v) => {
          if (value === undefined) setInner(v);
          onValueChange?.(v);
        }}
        orientation="horizontal"
        className="flex flex-wrap gap-2"
        {...props}
      >
        {options.map((o) =>
          type === "color" ? (
            <RadioGroup.Item
              key={o.value}
              value={o.value}
              disabled={o.disabled}
              aria-label={o.label ?? o.value}
              title={o.label ?? o.value}
              className={cn(
                "group relative flex items-center justify-center rounded-pill ring-1 ring-border-strong ring-offset-2 ring-offset-surface transition-[box-shadow] duration-(--dur-fast)",
                "data-[state=checked]:ring-2 data-[state=checked]:ring-fg disabled:cursor-not-allowed disabled:opacity-40",
                size === "sm" ? "hit-area size-6" : "size-9",
              )}
              style={{ background: o.color }}
            >
              <RadioGroup.Indicator
                className={cn("flex items-center justify-center", o.color && isLightColor(o.color) ? "text-black" : "text-white")}
              >
                <Check aria-hidden className={size === "sm" ? "size-3" : "size-icon-md"} strokeWidth={3} />
              </RadioGroup.Indicator>
              {o.disabled && <span aria-hidden className="absolute h-px w-[140%] rotate-45 bg-fg" />}
            </RadioGroup.Item>
          ) : (
            <RadioGroup.Item
              key={o.value}
              value={o.value}
              disabled={o.disabled}
              className={cn(
                "press relative flex items-center justify-center overflow-hidden rounded-pill border border-border bg-surface text-fg transition-[color,background-color,border-color,transform] duration-(--dur-fast) figures",
                "hover:border-border-strong data-[state=checked]:border-surface-inverse data-[state=checked]:bg-surface-inverse data-[state=checked]:text-fg-inverse",
                "disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-disabled disabled:text-disabled-fg disabled:line-through",
                size === "sm" ? "hit-area h-control-sm min-w-10 px-3 text-caption-strong" : "h-control-md min-w-14 px-4 text-label",
              )}
            >
              {o.label ?? o.value}
            </RadioGroup.Item>
          ),
        )}
      </RadioGroup.Root>
    </div>
  );
}
