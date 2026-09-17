// Server-safe derived figures and demo records for Payouts & GST (no React, no "use client").
import { ADMIN_TODAY, settlements, type Settlement } from "@/lib/data/admin";

const dayMs = 86400000;
const startOfToday = new Date(ADMIN_TODAY.getFullYear(), ADMIN_TODAY.getMonth(), ADMIN_TODAY.getDate()).getTime();
const ageInDays = (isoDay: string) => Math.round((startOfToday - new Date(`${isoDay}T00:00:00`).getTime()) / dayMs);
const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export type SettlementStatus = Settlement["status"];

export const settlementStatusMeta: Record<SettlementStatus, { label: string; tone: "success" | "info" | "warning"; live?: boolean }> = {
  paid: { label: "Paid", tone: "success" },
  processing: { label: "Processing", tone: "info", live: true },
  "on-hold": { label: "On hold", tone: "warning" },
};

export const settlementFees = (s: Settlement) => s.gatewayFees + s.shippingCharges;
export const settlementTaxes = (s: Settlement) => s.tcs + s.tds;
export const settlementDeductions = (s: Settlement) => s.gross - s.net;

/** Expected credit date for the settlement that is processing (T+2 on the demo "today"). */
export const nextPayoutDate = isoDay(new Date(ADMIN_TODAY.getFullYear(), ADMIN_TODAY.getMonth(), ADMIN_TODAY.getDate() + 2));

/** Headline payout figures for the KPI row. Windows are the last 30 days and the 30 before that. */
export function payoutSummary(rows: Settlement[] = settlements) {
  const paidIn = (from: number, to: number) => rows.filter((s) => s.status === "paid" && s.paidOn && ageInDays(s.paidOn) >= from && ageInDays(s.paidOn) < to);
  const recent = paidIn(0, 30);
  const before = paidIn(30, 60);
  const cycles = rows.filter((s) => ageInDays(s.periodTo) < 30);
  const sum = (list: Settlement[], pick: (s: Settlement) => number) => list.reduce((t, s) => t + pick(s), 0);
  const paid = sum(recent, (s) => s.net);
  const paidBefore = sum(before, (s) => s.net);
  return {
    next: rows.find((s) => s.status === "processing"),
    paid,
    paidCount: recent.length,
    paidDelta: paidBefore ? ((paid - paidBefore) / paidBefore) * 100 : 0,
    gateway: sum(cycles, (s) => s.gatewayFees),
    shipping: sum(cycles, (s) => s.shippingCharges),
    tcs: sum(cycles, (s) => s.tcs),
    tds: sum(cycles, (s) => s.tds),
    cycleCount: cycles.length,
  };
}

/* ---------------------------------------------------------------- GST returns (demo) */

export type GstReturn = {
  id: string;
  month: string;
  /** Last day of the tax period (ISO). */
  periodEnd: string;
  invoices: number;
  taxable: number;
  igst: number;
  cgst: number;
  sgst: number;
  status: "filed" | "ready" | "open";
  filedOn?: string;
  due: string;
};

/** Monthly GSTR-1 style outward-supply summaries. Illustrative figures only. */
export const gstReturns: GstReturn[] = [
  { id: "gstr1-2026-09", month: "September 2026", periodEnd: "2026-09-30", invoices: 1284, taxable: 2961400, igst: 318200, cgst: 104650, sgst: 104650, status: "open", due: "2026-10-11" },
  { id: "gstr1-2026-08", month: "August 2026", periodEnd: "2026-08-31", invoices: 2718, taxable: 6384900, igst: 689300, cgst: 227400, sgst: 227400, status: "filed", filedOn: "2026-09-10", due: "2026-09-11" },
  { id: "gstr1-2026-07", month: "July 2026", periodEnd: "2026-07-31", invoices: 2531, taxable: 5912300, igst: 640100, cgst: 209800, sgst: 209800, status: "filed", filedOn: "2026-08-10", due: "2026-08-11" },
  { id: "gstr1-2026-06", month: "June 2026", periodEnd: "2026-06-30", invoices: 2296, taxable: 5378600, igst: 579900, cgst: 191200, sgst: 191200, status: "filed", filedOn: "2026-07-09", due: "2026-07-11" },
  { id: "gstr1-2026-05", month: "May 2026", periodEnd: "2026-05-31", invoices: 2410, taxable: 5604100, igst: 604700, cgst: 199300, sgst: 199300, status: "filed", filedOn: "2026-06-11", due: "2026-06-11" },
];

export const gstStatusMeta: Record<GstReturn["status"], { label: string; tone: "success" | "warning" | "neutral" }> = {
  filed: { label: "Filed", tone: "success" },
  ready: { label: "Ready to file", tone: "warning" },
  open: { label: "Period open", tone: "neutral" },
};

/** IFSC: 4 letters (bank), a literal 0, then 6 alphanumerics (branch). */
export const IFSC_PATTERN = /^[A-Z]{4}0[A-Z0-9]{6}$/;
