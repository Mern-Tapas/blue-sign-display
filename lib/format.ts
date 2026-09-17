/**
 * Formatting helpers pinned to a fixed locale + time zone so server and
 * client output is identical (prevents hydration mismatches).
 *
 * Market: India — en-IN locale (lakh/crore grouping: ₹1,24,999), INR, IST.
 */
export const LOCALE = "en-IN";
export const DEFAULT_CURRENCY = "INR";
export const TIME_ZONE = "Asia/Kolkata";

const currencyFormatters = new Map<string, Intl.NumberFormat>();

function currencyFormatter(currency: string, fractionDigits: 0 | 2) {
  const key = `${currency}:${fractionDigits}`;
  let f = currencyFormatters.get(key);
  if (!f) {
    f = new Intl.NumberFormat(LOCALE, {
      style: "currency",
      currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
    currencyFormatters.set(key, f);
  }
  return f;
}

/** Whole rupee amounts drop the paise (₹2,499); fractional amounts keep two decimals (₹2,499.50). */
function digitsFor(amount: number): 0 | 2 {
  return Number.isInteger(Math.round(amount * 100) / 100) ? 0 : 2;
}

export function formatPrice(amount: number, currency = DEFAULT_CURRENCY) {
  return currencyFormatter(currency, digitsFor(amount)).format(amount);
}

/** Splits a price into symbol / whole / decimal parts for styled display. `fraction` is "" for whole amounts. */
export function priceParts(amount: number, currency = DEFAULT_CURRENCY) {
  const parts = currencyFormatter(currency, digitsFor(amount)).formatToParts(amount);
  let symbol = "";
  let whole = "";
  let fraction = "";
  for (const p of parts) {
    if (p.type === "currency") symbol = p.value;
    else if (p.type === "integer" || p.type === "group" || p.type === "minusSign") whole += p.value;
    else if (p.type === "fraction") fraction = p.value;
  }
  return { symbol, whole, fraction };
}

/** Percentage saved against MRP, rounded down so the claim is never overstated. */
export function discountPercent(price: number, mrp?: number) {
  if (!mrp || mrp <= price) return 0;
  return Math.floor(((mrp - price) / mrp) * 100);
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(LOCALE, options).format(value);
}

/** Compact counts in the Indian system: 950 · 1.2K · 3.4L · 1.1Cr. */
export function formatCompact(value: number) {
  const trim = (n: number) => (n >= 10 ? Math.round(n).toString() : (Math.round(n * 10) / 10).toString());
  if (value >= 1_00_00_000) return `${trim(value / 1_00_00_000)}Cr`;
  if (value >= 1_00_000) return `${trim(value / 1_00_000)}L`;
  if (value >= 1_000) return `${trim(value / 1_000)}K`;
  return String(value);
}

export function formatPercent(value: number, digits = 1) {
  return `${value > 0 ? "+" : ""}${value.toFixed(digits)}%`;
}

export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" },
) {
  return new Intl.DateTimeFormat(LOCALE, { timeZone: TIME_ZONE, ...options }).format(new Date(date));
}

/** Indian mobile display: +91 98765 43210 */
export function formatPhone(digits: string) {
  const d = digits.replace(/\D/g, "").slice(-10);
  return d.length === 10 ? `+91 ${d.slice(0, 5)} ${d.slice(5)}` : digits;
}
