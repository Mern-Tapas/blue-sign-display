"use client";

import { useState } from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { type VariantProps } from "class-variance-authority";
import { CalendarDays, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { LOCALE } from "@/lib/format";
import { Calendar, type CalendarProps } from "./calendar";
import { useFieldControl } from "./field";
import { controlShellVariants } from "./input";

export type DatePickerProps = Omit<CalendarProps, "autoFocus" | "className" | "aria-label"> &
  VariantProps<typeof controlShellVariants> & {
    placeholder?: string;
    /** Intl options for the trigger text. */
    format?: Intl.DateTimeFormatOptions;
    clearable?: boolean;
    onClear?: () => void;
    disabled?: boolean;
    required?: boolean;
    id?: string;
    /** Adds a hidden input with the ISO date (yyyy-mm-dd). */
    name?: string;
    "aria-label"?: string;
    className?: string;
  };

function toIsoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Field-shell trigger that opens a Calendar in a popover and closes on pick. */
export function DatePicker({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  placeholder = "Select date",
  format = { day: "numeric", month: "short", year: "numeric" },
  clearable = false,
  onClear,
  disabled,
  required,
  id,
  name,
  variant,
  size,
  shape,
  "aria-label": ariaLabel,
  className,
  ...calendarProps
}: DatePickerProps) {
  const control = useFieldControl({ id, required });
  const [open, setOpen] = useState(false);
  const [valueState, setValueState] = useState<Date | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : valueState;

  // Local calendar date — no time-zone conversion, so the picked day never shifts
  const text = value ? new Intl.DateTimeFormat(LOCALE, format).format(value) : null;
  const showClear = clearable && value && !disabled;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <div data-slot="date-picker" className="relative w-full">
        <PopoverPrimitive.Trigger
          id={control.id}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-label={ariaLabel ? `${ariaLabel}${text ? `, ${text}` : ""}` : undefined}
          aria-describedby={control["aria-describedby"]}
          aria-invalid={control["aria-invalid"]}
          aria-required={control.required || undefined}
          className={cn(
            controlShellVariants({ variant, size, shape }),
            "justify-start text-left outline-none",
            className,
          )}
        >
          <CalendarDays aria-hidden />
          <span className={cn("min-w-0 flex-1 truncate figures", !text && "text-fg-placeholder")}>{text ?? placeholder}</span>
          {showClear && <span aria-hidden className="w-6 shrink-0" />}
        </PopoverPrimitive.Trigger>
        {showClear && (
          <button
            type="button"
            aria-label="Clear date"
            onClick={() => {
              if (valueProp === undefined) setValueState(null);
              onClear?.();
            }}
            className="state-layer hit-area absolute top-1/2 right-3 flex size-6 -translate-y-1/2 items-center justify-center rounded-pill text-fg-muted hover:text-fg"
          >
            <X aria-hidden className="size-3.5" />
          </button>
        )}
      </div>
      {name && <input type="hidden" name={name} value={value ? toIsoDate(value) : ""} />}
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="date-picker-content"
          aria-label="Choose date"
          sideOffset={6}
          align="start"
          collisionPadding={16}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "z-(--z-popover) rounded-xl bg-surface-raised p-3 text-fg shadow-popover outline-none",
            "origin-(--radix-popover-content-transform-origin) data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out",
          )}
        >
          <Calendar
            {...calendarProps}
            autoFocus
            value={value}
            onValueChange={(d) => {
              if (valueProp === undefined) setValueState(d);
              onValueChange?.(d);
              setOpen(false);
            }}
          />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
