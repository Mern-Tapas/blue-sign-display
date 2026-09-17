/* Shared client-side validators. Each returns an error message or undefined.
   Messages say what to do, not just what's wrong. */

import { isValidIndianMobile } from "@/components/ui/phone-input";
import { scorePassword } from "@/components/ui/password-strength-meter";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(value: string) {
  return EMAIL.test(value.trim());
}

export function validateEmail(value: string) {
  if (!value.trim()) return "Enter your email address";
  if (!isEmail(value)) return "Enter an email address like name@example.com";
}

export function validateMobile(digits: string) {
  if (!digits) return "Enter your 10-digit mobile number";
  if (!isValidIndianMobile(digits)) return "Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9";
}

/** Email or Indian mobile in one field ("Email or mobile number"). */
export function parseIdentifier(value: string): { kind: "email" | "mobile"; value: string } | null {
  const v = value.trim();
  if (isEmail(v)) return { kind: "email", value: v };
  const digits = v.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  if (isValidIndianMobile(digits)) return { kind: "mobile", value: digits };
  return null;
}

export function validateName(value: string) {
  const v = value.trim();
  if (!v) return "Enter your full name";
  if (v.length < 2) return "Name must be at least 2 characters";
  if (/\d/.test(v)) return "Name can’t contain numbers";
}

export function validateNewPassword(value: string) {
  if (!value) return "Create a password";
  if (value.length < 8) return "Use at least 8 characters";
  if (scorePassword(value) < 2) return "Add upper and lower case letters, a number or a symbol";
}

export type FocusFirstInvalidOptions = {
  /** Bring it into view as well — worth it in a long form where the error is off-screen. */
  scroll?: boolean;
  /** Used when nothing is marked invalid, e.g. a form-level error summary to focus instead. */
  fallbackSelector?: string;
};

/** Focus the first invalid control after React has rendered the error state. */
export function focusFirstInvalid(form: HTMLFormElement | null, options: FocusFirstInvalidOptions = {}) {
  requestAnimationFrame(() => {
    const target =
      form?.querySelector<HTMLElement>('[aria-invalid="true"]') ??
      (options.fallbackSelector ? form?.querySelector<HTMLElement>(options.fallbackSelector) : null);
    if (!target) return;
    target.focus();
    if (options.scroll) target.scrollIntoView({ block: "center", behavior: "smooth" });
  });
}
