/* Field-shaped validators that say what to do, not just what's wrong. Pure and composable:
   each returns a message or undefined, so a form's validate() reads as a list of rules.

   Domain validators (email, Indian mobile, password strength) stay in lib/validation.ts.
   These are the shape-level rules any form needs. */

import { isMoney, type MoneyOptions } from "./money";
import type { FieldErrors, FieldPath } from "./types";

export type Rule = (value: string) => string | undefined;

export function required(message = "This field is required"): Rule {
  return (value) => (value.trim() === "" ? message : undefined);
}

export function minLength(min: number, message?: string): Rule {
  return (value) => (value.trim().length < min ? (message ?? `Use at least ${min} characters`) : undefined);
}

export function maxLength(max: number, message?: string): Rule {
  return (value) => (value.length > max ? (message ?? `Keep it under ${max} characters`) : undefined);
}

export function pattern(re: RegExp, message: string): Rule {
  return (value) => (re.test(value.trim()) ? undefined : message);
}

export function money(options: MoneyOptions = {}, message?: string): Rule {
  const fallback = options.minorUnits === 0 ? "Enter a whole rupee amount" : "Enter an amount like 1499 or 1499.50";
  return (value) => (isMoney(value, options) ? undefined : (message ?? fallback));
}

export function numberInRange(min: number, max: number, message?: string): Rule {
  return (value) => {
    const n = Number(value.trim());
    if (value.trim() === "" || Number.isNaN(n)) return message ?? `Enter a number between ${min} and ${max}`;
    return n < min || n > max ? (message ?? `Enter a number between ${min} and ${max}`) : undefined;
  };
}

/** First failing rule wins, so a field never shows two complaints at once. */
export function firstError(value: string, rules: Rule[]) {
  for (const rule of rules) {
    const message = rule(value);
    if (message) return message;
  }
  return undefined;
}

/**
 * Collect rules into an error map, preserving declaration order (which is focus order).
 * Skips fields that pass, so `{}` means valid.
 */
export function collect(entries: [FieldPath, string, Rule[]][]): FieldErrors {
  const errors: FieldErrors = {};
  for (const [path, value, rules] of entries) {
    const message = firstError(value, rules);
    if (message) errors[path] = message;
  }
  return errors;
}
