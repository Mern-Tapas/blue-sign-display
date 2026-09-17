"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useFieldControl } from "./field";

export type OtpInputProps = {
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (code: string) => void;
  /** Fires once every cell is filled (auto-submit). */
  onComplete?: (code: string) => void;
  status?: "default" | "error" | "success";
  disabled?: boolean;
  autoFocus?: boolean;
  size?: "md" | "lg";
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  className?: string;
};

/**
 * Segmented one-time-code field. One real input sits over the cells, so SMS autofill
 * (`autocomplete="one-time-code"`), paste, backspace and screen readers behave like a
 * normal text field; the cells are presentation only.
 */
export function OtpInput({
  length = 6,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onComplete,
  status = "default",
  disabled = false,
  autoFocus,
  size = "lg",
  id,
  name,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
  className,
}: OtpInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [valueState, setValueState] = useState(() => defaultValue.replace(/\D/g, "").slice(0, length));
  const [focused, setFocused] = useState(false);
  const value = valueProp ?? valueState;
  const control = useFieldControl({ id, "aria-describedby": describedBy, "aria-invalid": status === "error" || undefined });
  const invalid = control["aria-invalid"] === true || status === "error";

  function update(raw: string) {
    const code = raw.replace(/\D/g, "").slice(0, length);
    if (code === value) return;
    if (valueProp === undefined) setValueState(code);
    onValueChange?.(code);
    if (code.length === length) onComplete?.(code);
  }

  // Keep the caret at the end so typing always fills the next empty cell
  function pinCaret(e: React.SyntheticEvent<HTMLInputElement>) {
    const el = e.currentTarget;
    const end = el.value.length;
    if (el.selectionStart !== end || el.selectionEnd !== end) el.setSelectionRange(end, end);
  }

  const activeIndex = Math.min(value.length, length - 1);

  return (
    <div
      data-slot="otp-input"
      data-status={status}
      className={cn("relative inline-flex w-fit max-w-full", disabled && "cursor-not-allowed", className)}
      onClick={() => inputRef.current?.focus()}
    >
      <div aria-hidden className={cn("flex", size === "lg" ? "gap-2 sm:gap-3" : "gap-2")}>
        {Array.from({ length }, (_, i) => {
          const char = value[i];
          const active = focused && i === activeIndex && !disabled;
          return (
            <span
              key={i}
              className={cn(
                "relative flex items-center justify-center rounded-md border bg-surface text-fg figures",
                "transition-[border-color,background-color,outline-color] duration-(--dur-fast) ease-out",
                size === "lg" ? "size-12 text-heading-md sm:size-13" : "size-control-md text-body-lg",
                char ? "border-border-strong" : "border-border",
                active && "outline-2 -outline-offset-1 outline-focus-ring",
                invalid && "border-danger [--focus-ring:var(--danger)]",
                status === "success" && "border-success bg-success-soft text-success-fg",
                disabled && "border-transparent bg-disabled text-disabled-fg",
              )}
            >
              {char}
              {active && !char && (
                <span className="h-5 w-px bg-fg motion-safe:animate-caret-blink" />
              )}
            </span>
          );
        })}
      </div>
      <input
        ref={inputRef}
        {...control}
        name={name}
        aria-label={ariaLabel ?? (control.id ? undefined : `${length}-digit code`)}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern={`\\d{${length}}`}
        maxLength={length}
        spellCheck={false}
        autoFocus={autoFocus}
        disabled={disabled}
        value={value}
        onChange={(e) => update(e.target.value)}
        onFocus={(e) => {
          setFocused(true);
          pinCaret(e);
        }}
        onBlur={() => setFocused(false)}
        onSelect={pinCaret}
        className="absolute inset-0 h-full w-full cursor-text bg-transparent text-transparent caret-transparent outline-none selection:bg-transparent disabled:cursor-not-allowed"
      />
    </div>
  );
}
