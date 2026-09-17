/* Client-side payment input helpers. They improve feedback only — the payment gateway remains the
   source of truth, and real card data must go through its hosted fields / SDK. */

export type CardBrand = "visa" | "mastercard" | "rupay" | "amex" | "unknown";

export function detectCardBrand(digits: string): CardBrand {
  if (/^3[47]/.test(digits)) return "amex";
  if (/^(508[5-9]|60|65|81|82)/.test(digits)) return "rupay";
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
  return "unknown";
}

export const cardBrandLabel: Record<CardBrand, string> = { visa: "Visa", mastercard: "Mastercard", rupay: "RuPay", amex: "American Express", unknown: "Card" };

export function cardLength(brand: CardBrand) {
  return brand === "amex" ? 15 : 16;
}

export function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "");
  const brand = detectCardBrand(digits);
  const d = digits.slice(0, cardLength(brand));
  if (brand === "amex") return [d.slice(0, 4), d.slice(4, 10), d.slice(10)].filter(Boolean).join(" ");
  return d.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function luhnValid(digits: string) {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    double = !double;
  }
  return digits.length >= 12 && sum % 10 === 0;
}

export function formatExpiry(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

/** "MM/YY" in the future (cards are valid through the end of the month). */
export function validateExpiry(value: string, now = new Date()) {
  const m = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!m) return "Enter expiry as MM/YY";
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return "Enter a valid month";
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);
  if (endOfMonth < now) return "This card has expired";
}

export function validateCardNumber(formatted: string) {
  const digits = formatted.replace(/\D/g, "");
  if (!digits) return "Enter your card number";
  const brand = detectCardBrand(digits);
  if (digits.length < cardLength(brand)) return "Card number is incomplete";
  if (!luhnValid(digits)) return "Check the card number — it doesn’t look right";
}

export function validateCvv(value: string, brand: CardBrand) {
  const len = brand === "amex" ? 4 : 3;
  if (!new RegExp(`^\\d{${len}}$`).test(value)) return `Enter the ${len}-digit CVV`;
}

/** name@handle, handles are letters only (okaxis, ybl, paytm). */
export function validateUpiId(value: string) {
  const v = value.trim();
  if (!v) return "Enter your UPI ID";
  if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(v)) return "Enter a UPI ID like name@okaxis";
}
