// Server-safe order and return helpers (no React, no "use client") shared by the /admin orders and returns
// routes. Everything is computed against the fixed demo "today" so server and browser agree.

import { ADMIN_TODAY, type AdminOrder, type AdminOrderStatus, type AdminReturn, type PaymentMode } from "@/lib/data/admin";

/* ---------------------------------------------------------------- order tabs */

export type OrderTab = "all" | "pending" | "to-pack" | "ready" | "shipped" | "delivered" | "closed";

export const orderTabs: { id: OrderTab; label: string; statuses: AdminOrderStatus[] | null }[] = [
  { id: "all", label: "All", statuses: null },
  { id: "pending", label: "Payment pending", statuses: ["pending"] },
  { id: "to-pack", label: "To pack", statuses: ["confirmed"] },
  { id: "ready", label: "Ready to ship", statuses: ["packed"] },
  { id: "shipped", label: "Shipped", statuses: ["shipped", "out-for-delivery"] },
  { id: "delivered", label: "Delivered", statuses: ["delivered"] },
  { id: "closed", label: "Cancelled & RTO", statuses: ["cancelled", "rto", "returned"] },
];

const tabIds = new Set<string>(orderTabs.map((t) => t.id));

/**
 * Reads `?status=` from the URL. Accepts tab ids ("to-pack") and raw order statuses ("confirmed"), which is
 * what the overview's "Needs attention" links use.
 */
export function parseOrderTab(value: string | string[] | undefined): OrderTab {
  const v = Array.isArray(value) ? value[0] : value;
  if (!v) return "all";
  if (tabIds.has(v)) return v as OrderTab;
  return orderTabs.find((t) => t.statuses?.includes(v as AdminOrderStatus))?.id ?? "all";
}

export function orderInTab(order: Pick<AdminOrder, "status">, tab: OrderTab) {
  const statuses = orderTabs.find((t) => t.id === tab)?.statuses;
  return !statuses || statuses.includes(order.status);
}

/* ---------------------------------------------------------------- dispatch SLA */

const HOUR = 3600000;
const UNSHIPPED: AdminOrderStatus[] = ["pending", "confirmed", "packed"];

export const isUnshipped = (status: AdminOrderStatus) => UNSHIPPED.includes(status);
export const isCancellable = (status: AdminOrderStatus) => UNSHIPPED.includes(status);

/** Hours left until the ship-by deadline, measured from the demo "now". Negative when overdue. */
export function shipByHoursLeft(order: Pick<AdminOrder, "shipBy">, now: Date = ADMIN_TODAY) {
  return Math.round((new Date(order.shipBy).getTime() - now.getTime()) / HOUR);
}

/** Not yet shipped and the ship-by deadline is within 24 hours (or already missed). */
export function isShipByAtRisk(order: Pick<AdminOrder, "shipBy" | "status">, now: Date = ADMIN_TODAY) {
  return isUnshipped(order.status) && shipByHoursLeft(order, now) < 24;
}

/* ---------------------------------------------------------------- payment */

export type PaymentBadge = { label: string; tone: "success" | "warning" | "danger" | "neutral" };

export function paymentBadge(order: Pick<AdminOrder, "payment" | "paymentStatus">): PaymentBadge {
  if (order.paymentStatus === "paid") return { label: "Paid", tone: "success" };
  if (order.paymentStatus === "refunded") return { label: "Refunded", tone: "neutral" };
  if (order.paymentStatus === "failed") return { label: "Failed", tone: "danger" };
  return order.payment === "COD" ? { label: "COD to collect", tone: "warning" } : { label: "Awaiting payment", tone: "warning" };
}

export const COD_FEE = 19;
export const isPrepaid = (mode: PaymentMode) => mode !== "COD";

/* ---------------------------------------------------------------- fulfilment */

export const fulfilmentSteps = ["Placed", "Confirmed", "Packed", "Shipped", "Delivered"] as const;

/** Index of the current step in `fulfilmentSteps` (length = everything done). */
export function fulfilmentIndex(status: AdminOrderStatus) {
  switch (status) {
    case "pending":
      return 1;
    case "confirmed":
      return 2;
    case "packed":
      return 3;
    case "shipped":
    case "out-for-delivery":
    case "rto":
      return 4;
    case "cancelled":
      return 1;
    case "delivered":
    case "returned":
      return 5;
  }
}

export const couriers = ["Delhivery", "Blue Dart", "Ekart", "Shadowfax", "XpressBees"] as const;

/** AWB numbers are 8–16 letters or digits; couriers reject anything else at pickup. */
export function validateAwb(value: string) {
  const v = value.trim();
  if (!v) return "Enter the AWB number from the courier label.";
  if (!/^[A-Za-z0-9]+$/.test(v)) return "Use letters and digits only, no spaces or dashes.";
  if (v.length < 8 || v.length > 16) return "AWB numbers are 8 to 16 characters long.";
  return undefined;
}

/* ---------------------------------------------------------------- returns */

export type ReturnStatus = AdminReturn["status"];

export const returnStatusMeta: Record<ReturnStatus, { label: string; tone: "neutral" | "accent" | "success" | "warning" | "danger" | "info" }> = {
  requested: { label: "To review", tone: "warning" },
  approved: { label: "Approved", tone: "info" },
  "pickup-scheduled": { label: "Pickup scheduled", tone: "accent" },
  received: { label: "Received", tone: "accent" },
  refunded: { label: "Refunded", tone: "success" },
  rejected: { label: "Rejected", tone: "neutral" },
};

export type ReturnTab = "all" | ReturnStatus;

export const returnTabs: { id: ReturnTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "requested", label: "To review" },
  { id: "approved", label: "Approved" },
  { id: "pickup-scheduled", label: "Pickup scheduled" },
  { id: "received", label: "Received" },
  { id: "refunded", label: "Refunded" },
  { id: "rejected", label: "Rejected" },
];

export function parseReturnTab(value: string | string[] | undefined): ReturnTab {
  const v = Array.isArray(value) ? value[0] : value;
  return returnTabs.some((t) => t.id === v) ? (v as ReturnTab) : "all";
}
