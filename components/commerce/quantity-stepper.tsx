"use client";

import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type QuantityStepperProps = {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  /** Show a trash icon instead of minus at the minimum (cart line items). */
  removeAtMin?: boolean;
  onRemove?: () => void;
  label?: string;
  className?: string;
  disabled?: boolean;
};

export function QuantityStepper({
  value,
  defaultValue = 1,
  onValueChange,
  min = 1,
  max = 99,
  size = "md",
  removeAtMin = false,
  onRemove,
  label = "Quantity",
  className,
  disabled,
}: QuantityStepperProps) {
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;

  const commit = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next));
    if (value === undefined) setInner(clamped);
    onValueChange?.(clamped);
  };

  const atMin = current <= min;
  const showRemove = removeAtMin && atMin && onRemove;
  const btn = cn(
    "state-layer press hit-area relative flex shrink-0 items-center justify-center rounded-pill text-fg transition-[color,transform] duration-(--dur-fast) disabled:pointer-events-none disabled:text-disabled-fg",
    size === "sm" ? "size-6 [&_svg]:size-icon-sm" : "size-control-sm [&_svg]:size-icon-md",
  );

  return (
    <div
      data-slot="quantity-stepper"
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-pill bg-surface p-1 shadow-[inset_0_0_0_1px_var(--border)] has-[input:focus-visible]:shadow-[inset_0_0_0_2px_var(--focus-ring)]",
        disabled && "bg-disabled text-disabled-fg",
        className,
      )}
    >
      <button
        type="button"
        className={btn}
        onClick={() => (showRemove ? onRemove() : commit(current - 1))}
        disabled={disabled || (atMin && !showRemove)}
        aria-label={showRemove ? "Remove item" : "Decrease quantity"}
      >
        {showRemove ? <Trash2 aria-hidden /> : <Minus aria-hidden />}
      </button>
      <input
        type="text"
        inputMode="numeric"
        aria-label={label}
        value={current}
        disabled={disabled}
        onChange={(e) => {
          const n = Number.parseInt(e.target.value.replace(/\D/g, ""), 10);
          if (!Number.isNaN(n)) commit(n);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") { e.preventDefault(); commit(current + 1); }
          if (e.key === "ArrowDown") { e.preventDefault(); commit(current - 1); }
        }}
        className={cn(
          "bg-transparent text-center font-medium text-fg outline-none figures",
          size === "sm" ? "w-7 text-label" : "w-10 text-body",
        )}
      />
      <button
        type="button"
        className={btn}
        onClick={() => commit(current + 1)}
        disabled={disabled || current >= max}
        aria-label="Increase quantity"
      >
        <Plus aria-hidden />
      </button>
    </div>
  );
}
