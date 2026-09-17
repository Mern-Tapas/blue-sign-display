"use client";

import { NumberInput, type NumberInputProps } from "./number-input";

export type MoneyInputProps = Omit<NumberInputProps, "precision" | "prefix" | "inputMode"> & {
  /** ISO code. The symbol comes from Intl, so this stays brand- and market-agnostic. */
  currency?: string;
  locale?: string;
  /** Whole units only (₹1,499 with no paise). */
  wholeUnits?: boolean;
};

/** The symbol Intl uses for a currency in a locale — "₹" for INR in en-IN. */
function currencySymbol(currency: string, locale: string) {
  const parts = new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).formatToParts(0);
  return parts.find((p) => p.type === "currency")?.value ?? currency;
}

/**
 * An amount. Same behaviour as NumberInput, with the currency symbol inside the shell and
 * the right number of decimals — so "is this field in rupees or paise" is answered by the
 * component instead of by each screen.
 */
export function MoneyInput({ currency = "INR", locale = "en-IN", wholeUnits = false, min = 0, step = wholeUnits ? 1 : 0.5, ...props }: MoneyInputProps) {
  return <NumberInput data-slot="money-input" prefix={currencySymbol(currency, locale)} precision={wholeUnits ? 0 : 2} min={min} step={step} {...props} />;
}
