// Server-safe coupon helpers shared by the coupons list, the builder and the "Send coupon" dialog.
import { adminDateShort } from "@/lib/admin-format";
import { ADMIN_TODAY, type AdminCoupon } from "@/lib/data/admin";
import { formatNumber, formatPrice } from "@/lib/format";
import type { CustomerSegment } from "./customer-data";

export type CouponEligibility = "all" | "new" | "segment";

/** A coupon as the admin edits it: the demo record plus the builder's extra rules. */
export type CouponRecord = AdminCoupon & {
  perCustomerLimit?: number;
  eligibility: CouponEligibility;
  segment?: Exclude<CustomerSegment, "new">;
  stackable: boolean;
};

export type CouponStatus = AdminCoupon["status"];

export const couponStatusMeta: Record<CouponStatus, { label: string; tone: "success" | "info" | "neutral" | "warning" }> = {
  active: { label: "Active", tone: "success" },
  scheduled: { label: "Scheduled", tone: "info" },
  expired: { label: "Expired", tone: "neutral" },
  paused: { label: "Paused", tone: "warning" },
};

export const couponStatusOrder: CouponStatus[] = ["active", "scheduled", "expired", "paused"];

export const eligibleSegments: { value: Exclude<CustomerSegment, "new">; label: string }[] = [
  { value: "repeat", label: "Repeat customers" },
  { value: "vip", label: "VIP customers" },
  { value: "at-risk", label: "At-risk customers" },
];

export function toCouponRecord(c: AdminCoupon): CouponRecord {
  return {
    ...c,
    perCustomerLimit: 1,
    eligibility: c.newCustomersOnly ? "new" : c.code === "WINBACK" ? "segment" : "all",
    segment: c.code === "WINBACK" ? "at-risk" : undefined,
    stackable: false,
  };
}

const rupees = (n: number) => formatPrice(n);

/** Table wording: "20% up to ₹1,500", "₹500 off", "Free delivery". */
export function describeDiscount(c: Pick<AdminCoupon, "type" | "value" | "maxDiscount">) {
  if (c.type === "free-shipping") return "Free delivery";
  if (c.type === "flat") return `${rupees(c.value)} off`;
  return c.maxDiscount ? `${c.value}% up to ${rupees(c.maxDiscount)}` : `${c.value}% off`;
}

/** Shopper-facing headline: "Save ₹300 on orders above ₹1,999". */
export function shopperHeadline(c: Pick<AdminCoupon, "type" | "value" | "maxDiscount" | "minOrder">) {
  const min = c.minOrder > 0 ? ` on orders above ${rupees(c.minOrder)}` : "";
  if (c.type === "free-shipping") return `Free delivery${min || " on every order"}`;
  if (c.type === "flat") return `Save ${rupees(c.value)}${min}`;
  return `Get ${c.value}% off${c.maxDiscount ? ` up to ${rupees(c.maxDiscount)}` : ""}${min}`;
}

export function validityRange(c: Pick<AdminCoupon, "startsAt" | "endsAt">) {
  return `${adminDateShort(c.startsAt)} – ${adminDateShort(c.endsAt)}`;
}

export function usageLabel(c: Pick<AdminCoupon, "used" | "usageLimit">) {
  return c.usageLimit ? `${formatNumber(c.used)} / ${formatNumber(c.usageLimit)}` : `used ${formatNumber(c.used)} · no limit`;
}

export function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** The status a coupon earns from its dates (paused is a manual state, kept by the caller). */
export function statusFromDates(startsAt: string, endsAt: string): CouponStatus {
  const today = isoDate(ADMIN_TODAY);
  if (endsAt < today) return "expired";
  if (startsAt > today) return "scheduled";
  return "active";
}

export const COUPON_CODE_PATTERN = /^[A-Z0-9][A-Z0-9-]{3,14}$/;
