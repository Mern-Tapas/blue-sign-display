"use client";

import { MapPin } from "lucide-react";
import { Input, type InputProps } from "./input";

export const isValidPincode = (pin: string) => /^[1-9]\d{5}$/.test(pin);

export type PincodeInputProps = Omit<InputProps, "type" | "value" | "onChange" | "maxLength"> & {
  value: string;
  onValueChange: (digits: string) => void;
  /** Called when the 6th digit lands (auto-check). */
  onComplete?: (pin: string) => void;
  showIcon?: boolean;
};

/** 6-digit Indian PIN code field: digits only, numeric keypad, postal-code autocomplete. */
export function PincodeInput({ value, onValueChange, onComplete, showIcon = true, placeholder = "6-digit PIN code", className, ...props }: PincodeInputProps) {
  return (
    <Input
      type="text"
      inputMode="numeric"
      autoComplete="postal-code"
      pattern="[1-9][0-9]{5}"
      maxLength={6}
      placeholder={placeholder}
      value={value}
      startSlot={showIcon ? <MapPin aria-hidden /> : undefined}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
        onValueChange(digits);
        if (digits.length === 6 && digits !== value) onComplete?.(digits);
      }}
      className={["figures tracking-wider", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
