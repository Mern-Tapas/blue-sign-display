/* Money as typed into a text field. Pure, so the same rule runs on the server and in the
   browser, and so "are paise allowed?" has one answer per field instead of one per screen. */

export type MoneyOptions = {
  /** 2 allows paise ("199.50"), 0 accepts whole rupees only. Default 2. */
  minorUnits?: 0 | 2;
  /**
   * Accept en-IN grouping ("1,00,000"). Off by default: a caller that validates with
   * `isMoney` and then reaches for `Number()` would get NaN from a grouped string, so
   * grouping is only allowed where `parseMoney` does the reading.
   */
  allowGrouping?: boolean;
};

/** Remove en-IN grouping ("1,00,000") and spaces before any arithmetic. */
export function stripGrouping(value: string) {
  return value.replace(/[\s,]/g, "");
}

/** True when the string is a plain positive amount at the allowed precision. */
export function isMoney(value: string, { minorUnits = 2, allowGrouping = false }: MoneyOptions = {}) {
  const raw = (allowGrouping ? stripGrouping(value) : value).trim();
  if (raw === "") return false;
  return minorUnits === 0 ? /^\d+$/.test(raw) : /^\d+(\.\d{1,2})?$/.test(raw);
}

/** The number behind the text, or NaN when it isn't an amount. Never throws. */
export function parseMoney(value: string, options: MoneyOptions = {}) {
  if (!isMoney(value, { ...options, allowGrouping: options.allowGrouping ?? true })) return NaN;
  return Number(stripGrouping(value));
}

/**
 * What a money field should hold while it is being typed: digits, at most one dot, and
 * no more decimals than the field allows. Does not group — grouping a value under the
 * cursor moves the caret, which is worse than reading "100000" for a moment.
 */
export function formatMoneyInput(value: string, { minorUnits = 2 }: MoneyOptions = {}) {
  const cleaned = stripGrouping(value).replace(/[^\d.]/g, "");
  if (minorUnits === 0) return cleaned.replace(/\./g, "");
  const [whole, ...rest] = cleaned.split(".");
  if (rest.length === 0) return whole ?? "";
  return `${whole}.${rest.join("").slice(0, 2)}`;
}
