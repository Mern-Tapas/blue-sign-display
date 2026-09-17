// Local demo state for the returns queue: the dataset's returns plus a reconstructed history, pickup slot and
// refund details. Plain module (no React), safe to import from server and client code.

import { ADMIN_TODAY, adminOrders, type AdminReturn } from "@/lib/data/admin";
import { formatPrice } from "@/lib/format";

export type ReturnLogKind = "requested" | "approved" | "pickup" | "received" | "refunded" | "rejected";
export type ReturnLog = { id: string; kind: ReturnLogKind; actor: string; action: string; at: string };

export type RefundMethod = "source" | "store-credit";

export type ReturnRecord = AdminReturn & {
  pickupSlot?: string;
  rejectReason?: string;
  refund?: { amount: number; method: RefundMethod; at: string };
  log: ReturnLog[];
  customerNote: string;
  paymentMode: string;
};

const HOUR = 3600000;
const plus = (iso: string, hours: number) => new Date(new Date(iso).getTime() + hours * HOUR).toISOString();
const dayAt = (days: number, hour: number) => new Date(ADMIN_TODAY.getFullYear(), ADMIN_TODAY.getMonth(), ADMIN_TODAY.getDate() + days, hour);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Reverse-pickup slots offered by the courier for the next two days. */
export const pickupSlots = [1, 2].flatMap((d) => {
  const day = dayAt(d, 0);
  const label = `${d === 1 ? "Tomorrow" : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day.getDay()]}, ${day.getDate()} ${MONTHS[day.getMonth()]}`;
  return [
    { id: `d${d}-am`, day: label, time: "9 am – 1 pm" },
    { id: `d${d}-pm`, day: label, time: "2 pm – 6 pm" },
  ];
});

export const slotLabel = (id?: string) => {
  const s = pickupSlots.find((p) => p.id === id);
  return s ? `${s.day}, ${s.time}` : "Next available slot";
};

export const refundMethodLabel: Record<RefundMethod, string> = { source: "Original payment method", "store-credit": "BlueSigns store credit" };

export const rejectReasons = [
  "Item used, washed or damaged by the customer",
  "Brand tags or packaging missing",
  "Requested after the 7-day return window",
  "Product is not returnable (innerwear, beauty)",
  "Photos don’t show the reported problem",
] as const;

const notes: Record<AdminReturn["reason"], string> = {
  "Size too small": "I usually wear this size but it feels a size smaller across the shoulders.",
  "Size too large": "Too loose around the waist. Would like one size down.",
  "Damaged in transit": "The box was crushed and the product has a dent on one side.",
  "Different from picture": "The colour is much darker than in the product photos.",
  "Quality not as expected": "Stitching started coming loose after the first wear.",
  "Changed mind": "Found something I prefer. Unused, with tags.",
};

export function toReturnRecords(list: AdminReturn[]): ReturnRecord[] {
  return list.map((r) => {
    const s = r.status;
    const order = adminOrders.find((o) => o.id === r.orderId);
    const slot = s === "pickup-scheduled" || s === "received" || s === "refunded" ? pickupSlots[0]!.id : undefined;
    const refund = s === "refunded" ? { amount: r.amount, method: "source" as const, at: plus(r.requestedAt, 50) } : undefined;
    const entries: (ReturnLog | false)[] = [
      { id: "requested", kind: "requested", actor: r.customerName, action: `asked for ${r.resolution === "refund" ? "a refund" : "an exchange"}: ${r.reason.toLowerCase()}`, at: r.requestedAt },
      s !== "requested" && s !== "rejected" && { id: "approved", kind: "approved", actor: "Meera Iyer", action: "approved the return", at: plus(r.requestedAt, 3) },
      !!slot && { id: "pickup", kind: "pickup", actor: "Delhivery", action: `booked a reverse pickup for ${slotLabel(slot)}`, at: plus(r.requestedAt, 4) },
      (s === "received" || s === "refunded") && { id: "received", kind: "received", actor: "Warehouse", action: "received the item and passed quality check", at: plus(r.requestedAt, 48) },
      !!refund && { id: "refunded", kind: "refunded", actor: "Razorpay", action: `refunded ${formatPrice(r.amount)} to the original payment method`, at: refund.at },
      s === "rejected" && { id: "rejected", kind: "rejected", actor: "Meera Iyer", action: `rejected the return: ${rejectReasons[0].toLowerCase()}`, at: plus(r.requestedAt, 5) },
    ];
    return {
      ...r,
      pickupSlot: slot,
      rejectReason: s === "rejected" ? rejectReasons[0] : undefined,
      refund,
      customerNote: notes[r.reason],
      paymentMode: order?.payment ?? "UPI",
      log: entries.filter((e): e is ReturnLog => e !== false).sort((a, b) => b.at.localeCompare(a.at)),
    };
  });
}
