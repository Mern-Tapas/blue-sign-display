// Server-safe helpers for the customer screens (no "use client": pages and client islands both import these).
import { ADMIN_TODAY, orderStatusMeta, type AdminCustomer, type AdminOrder } from "@/lib/data/admin";

export type CustomerSegment = AdminCustomer["segment"];

export const segmentMeta: Record<CustomerSegment, { label: string; tone: "info" | "neutral" | "accent" | "warning"; hint: string }> = {
  new: { label: "New", tone: "info", hint: "1–2 orders" },
  repeat: { label: "Repeat", tone: "neutral", hint: "3–8 orders" },
  vip: { label: "VIP", tone: "accent", hint: "9 or more orders" },
  "at-risk": { label: "At risk", tone: "warning", hint: "No order in 120+ days" },
};

export const segmentOrder: CustomerSegment[] = ["new", "repeat", "vip", "at-risk"];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY = 86400000;

/** Local-midnight Date for a yyyy-mm-dd or full ISO string. */
export function toDate(iso: string) {
  return new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
}

/** Whole days between a date and the demo "today" (0 = today). */
export function daysBeforeToday(iso: string) {
  const d = toDate(iso);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.max(0, Math.round((ADMIN_TODAY.getTime() - start) / DAY));
}

export function daysAgoLabel(iso: string) {
  const n = daysBeforeToday(iso);
  return n === 0 ? "today" : n === 1 ? "yesterday" : `${n} days ago`;
}

/**
 * Headline numbers for a profile. The demo order list only covers the last 60 days, so lifetime
 * figures take whichever is larger: the customer record or what the recent orders add up to.
 */
/** Orders that count as spend: not cancelled, returned or sent back to origin. */
export const countsAsSpend = (o: AdminOrder) => o.status !== "cancelled" && o.status !== "returned" && o.status !== "rto";

export function customerStats(customer: AdminCustomer, orders: AdminOrder[]) {
  const recentSpend = orders.filter(countsAsSpend).reduce((s, o) => s + o.total, 0);
  const count = Math.max(customer.orders, orders.length);
  const lifetimeValue = Math.max(customer.lifetimeValue, recentSpend);
  const latestOrder = orders.reduce<string | null>((latest, o) => (!latest || o.placedAt > latest ? o.placedAt : latest), null);
  const lastOrderAt = latestOrder && toDate(latestOrder) > toDate(customer.lastOrderAt) ? latestOrder : customer.lastOrderAt;
  return { count, lifetimeValue, aov: Math.round(lifetimeValue / Math.max(1, count)), lastOrderAt };
}

/** Spend per calendar month from the first to the last month with an order (gaps included as ₹0). */
export function monthlySpend(orders: AdminOrder[]) {
  const counted = orders.filter(countsAsSpend);
  if (counted.length === 0) return [];
  const keyOf = (d: Date) => d.getFullYear() * 12 + d.getMonth();
  const keys = counted.map((o) => keyOf(new Date(o.placedAt)));
  const first = Math.min(...keys);
  const last = Math.max(...keys);
  return Array.from({ length: last - first + 1 }, (_, i) => {
    const k = first + i;
    const inMonth = counted.filter((o) => keyOf(new Date(o.placedAt)) === k);
    return {
      key: String(k),
      label: `${MONTHS[k % 12]} ${Math.floor(k / 12)}`,
      short: MONTHS[k % 12]!,
      value: inMonth.reduce((s, o) => s + o.total, 0),
      orders: inMonth.length,
    };
  });
}

/** Starting tags inferred from behaviour, so the demo profile isn't blank. */
export function initialTags(customer: AdminCustomer, orders: AdminOrder[]) {
  const tags: string[] = [];
  if (customer.segment === "vip") tags.push("VIP");
  if (customer.segment === "at-risk") tags.push("Win-back");
  if (orders.some((o) => o.payment === "COD")) tags.push("Prefers COD");
  if (orders.some((o) => o.coupon)) tags.push("Uses coupons");
  if (orders.some((o) => o.status === "rto")) tags.push("RTO history");
  return tags;
}

export function orderStatusLabel(o: AdminOrder) {
  return orderStatusMeta[o.status].label;
}
