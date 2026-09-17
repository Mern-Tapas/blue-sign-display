"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Input, type InputProps } from "./input";

/** Indian mobile numbers: 10 digits starting 6–9. */
export function isValidIndianMobile(digits: string) {
  return /^[6-9]\d{9}$/.test(digits);
}

/** Keeps digits only and drops a pasted +91 / 0 trunk prefix. */
export function normalizeIndianMobile(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

export type PhoneInputProps = Omit<InputProps, "type" | "value" | "defaultValue" | "onChange" | "startSlot"> & {
  /** 10-digit national number (no +91). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (digits: string) => void;
  countryCode?: string;
};

/**
 * Mobile number field with a fixed +91 prefix. Stores bare digits, strips pasted
 * "+91 98765-43210" formatting, and opens the numeric keypad on phones.
 */
export function PhoneInput({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  countryCode = "+91",
  placeholder = "10-digit mobile number",
  size,
  className,
  ...props
}: PhoneInputProps) {
  const [valueState, setValueState] = useState(() => normalizeIndianMobile(defaultValue));
  const value = valueProp ?? valueState;

  function update(raw: string) {
    const digits = normalizeIndianMobile(raw);
    if (valueProp === undefined) setValueState(digits);
    onValueChange?.(digits);
  }

  return (
    <Input
      type="tel"
      inputMode="numeric"
      autoComplete="tel-national"
      maxLength={16}
      size={size}
      placeholder={placeholder}
      value={value}
      onChange={(e) => update(e.target.value)}
      className={cn("figures tracking-wide", className)}
      startSlot={
        <span data-slot="phone-country" className="-ml-0.5 flex h-5 shrink-0 items-center gap-2 border-r border-border pr-2.5 text-fg-muted figures">
          <span className="sr-only">Country code </span>
          {countryCode}
        </span>
      }
      {...props}
    />
  );
}
