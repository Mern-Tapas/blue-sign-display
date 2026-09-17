"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { useFieldControl } from "./field";
import { IconButton } from "./icon-button";
import { controlShellVariants } from "./input";

export type NumberInputProps = Omit<React.ComponentProps<"input">, "size" | "value" | "defaultValue" | "onChange" | "prefix"> &
  VariantProps<typeof controlShellVariants> & {
    /** null means empty — distinct from 0, which is a real answer. */
    value?: number | null;
    defaultValue?: number | null;
    onValueChange?: (value: number | null) => void;
    min?: number;
    max?: number;
    step?: number;
    /** Decimal places kept on blur. 0 for counts, 2 for money. */
    precision?: number;
    /** Inside the shell, before and after the number: ₹, %, kg. */
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    /** Inline − / + buttons. Only then is this a spinbutton. */
    stepper?: "none" | "inline";
    wrapperClassName?: string;
  };

const clamp = (n: number, min?: number, max?: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
const round = (n: number, precision: number) => Number(n.toFixed(precision));

/**
 * A number typed as text, with the keyboard behaviour people expect from a spinbutton:
 * ↑ ↓ by a step, Shift for ten of them, PageUp / PageDown likewise, and Home / End for the
 * bounds. Clamping happens on blur, not on keystroke, so typing "1" on the way to "15"
 * inside a min of 10 doesn't fight back.
 */
export function NumberInput({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  min,
  max,
  step = 1,
  precision = 0,
  prefix,
  suffix,
  stepper = "none",
  variant,
  size,
  shape,
  className,
  wrapperClassName,
  id,
  required,
  disabled,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  "aria-label": ariaLabel,
  onBlur,
  ...props
}: NumberInputProps) {
  const control = useFieldControl({ id, required, "aria-describedby": describedBy, "aria-invalid": invalid });
  const [inner, setInner] = useState<number | null>(defaultValue);
  const current = valueProp !== undefined ? valueProp : inner;

  // While focused the raw text wins, so "1." and "-" survive mid-typing; when it isn't, the
  // display is derived from the number. No syncing effect, and an outside update still lands.
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState("");
  const display = focused ? text : current === null ? "" : String(current);

  const commit = (next: number | null) => {
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  };

  const nudge = (delta: number) => {
    const base = current ?? min ?? 0;
    const next = round(clamp(base + delta, min, max), precision);
    setText(String(next));
    commit(next);
  };

  const spin = stepper !== "none";

  return (
    <div
      data-slot="number-input"
      className={cn(controlShellVariants({ variant, size, shape }), "gap-1.5", disabled && "cursor-not-allowed", wrapperClassName)}
    >
      {stepper === "inline" && (
        <IconButton
          label="Decrease"
          variant="ghost"
          size="xs"
          tabIndex={-1}
          disabled={disabled || (min !== undefined && (current ?? min) <= min)}
          onClick={() => nudge(-step)}
        >
          <Minus aria-hidden />
        </IconButton>
      )}
      {prefix && <span className="shrink-0 text-fg-muted">{prefix}</span>}
      <input
        type="text"
        inputMode={precision > 0 ? "decimal" : "numeric"}
        autoComplete="off"
        disabled={disabled}
        // A spinbutton promises stepper semantics; without the buttons it is just a text field.
        role={spin ? "spinbutton" : undefined}
        aria-valuenow={spin && current !== null ? current : undefined}
        aria-valuemin={spin ? min : undefined}
        aria-valuemax={spin ? max : undefined}
        aria-label={ariaLabel}
        value={display}
        onChange={(e) => {
          const raw = e.target.value.replace(precision > 0 ? /[^\d.-]/g : /[^\d-]/g, "");
          setText(raw);
          if (raw === "" || raw === "-") return commit(null);
          const parsed = Number(raw);
          if (!Number.isNaN(parsed)) commit(parsed);
        }}
        onFocus={(e) => {
          setFocused(true);
          setText(current === null ? "" : String(current));
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          if (current !== null) {
            const settled = round(clamp(current, min, max), precision);
            setText(String(settled));
            if (settled !== current) commit(settled);
          }
          onBlur?.(e);
        }}
        onKeyDown={(e) => {
          const multiplier = e.shiftKey ? 10 : 1;
          if (e.key === "ArrowUp") nudge(step * multiplier);
          else if (e.key === "ArrowDown") nudge(-step * multiplier);
          else if (e.key === "PageUp") nudge(step * 10);
          else if (e.key === "PageDown") nudge(-step * 10);
          else if (e.key === "Home" && min !== undefined) nudge(min - (current ?? min));
          else if (e.key === "End" && max !== undefined) nudge(max - (current ?? max));
          else return;
          e.preventDefault();
        }}
        className={cn("h-full w-0 min-w-0 flex-1 bg-transparent text-right outline-none figures placeholder:text-fg-placeholder disabled:cursor-not-allowed", className)}
        {...control}
        {...props}
      />
      {suffix && <span className="shrink-0 text-fg-muted">{suffix}</span>}
      {stepper === "inline" && (
        <IconButton
          label="Increase"
          variant="ghost"
          size="xs"
          tabIndex={-1}
          disabled={disabled || (max !== undefined && (current ?? max) >= max)}
          onClick={() => nudge(step)}
        >
          <Plus aria-hidden />
        </IconButton>
      )}
    </div>
  );
}
