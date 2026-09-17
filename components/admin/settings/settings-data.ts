// Server-safe settings defaults, validators and the extended audit log (demo data, no React).
import { ADMIN_TODAY, adminOrders, auditLog, permissionAreas, rolePermissions, type StaffMember } from "@/lib/data/admin";
import { COD_FEE, DELIVERY_FEE, EXPRESS_FEE, FREE_DELIVERY_THRESHOLD, pincodes } from "@/lib/data/india";
import { isMoney } from "@/lib/form/money";

export const settingsSections = [
  { id: "store-profile", label: "Store profile" },
  { id: "shipping", label: "Shipping" },
  { id: "payments", label: "Payments" },
  { id: "taxes", label: "Taxes" },
  { id: "notifications", label: "Notifications" },
  { id: "staff", label: "Staff & roles" },
  { id: "danger-zone", label: "Danger zone" },
] as const;

/* ---------------------------------------------------------------- validation */

export const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_PATTERN = /^[6-9]\d{9}$/;
export const PIN_PATTERN = /^[1-9]\d{5}$/;
export const HSN_PATTERN = /^(\d{4}|\d{6}|\d{8})$/;

/** Every 6-digit token in pasted text or a CSV, de-duplicated, plus whatever didn't parse. */
export function parsePins(text: string) {
  const tokens = text.split(/[\s,;]+/).map((t) => t.trim()).filter(Boolean);
  const valid = [...new Set(tokens.filter((t) => PIN_PATTERN.test(t)))];
  const invalid = [...new Set(tokens.filter((t) => !PIN_PATTERN.test(t) && !/^pin(code)?$/i.test(t)))];
  return { valid, invalid };
}

/* ---------------------------------------------------------------- defaults */

export type Role = StaffMember["role"];
export type Access = "none" | "view" | "edit";
export type PermissionArea = (typeof permissionAreas)[number];
export type NotificationChannel = "email" | "sms" | "whatsapp";

export const notificationEvents = [
  { id: "placed", label: "Order placed", note: "Confirmation with invoice" },
  { id: "cod-confirm", label: "COD order confirmation", note: "Asks the shopper to confirm before dispatch" },
  { id: "shipped", label: "Order shipped", note: "Courier name and AWB tracking link" },
  { id: "ofd", label: "Out for delivery", note: "Includes the delivery OTP" },
  { id: "delivered", label: "Delivered", note: "With a review request after 3 days" },
  { id: "return", label: "Return approved", note: "Pickup date and packing tips" },
  { id: "refund", label: "Refund processed", note: "Amount and where it was sent" },
] as const;

export type StoreSettings = {
  profile: { storeName: string; supportEmail: string; supportPhone: string; gstin: string; address: string; city: string; state: string; pincode: string };
  shipping: { freeThreshold: string; deliveryFee: string; express: boolean; expressFee: string; pins: string };
  payments: { upi: boolean; cards: boolean; netbanking: boolean; wallets: boolean; emi: boolean; cod: boolean; codLimit: string; codFee: string };
  taxes: { inclusive: boolean; hsn: string; gstRate: string };
  notifications: Record<string, Record<NotificationChannel, boolean>>;
  permissions: Record<Role, Record<PermissionArea, Access>>;
};

export const defaultSettings: StoreSettings = {
  profile: {
    storeName: "BlueSigns",
    supportEmail: "care@bluesigns.shop",
    supportPhone: "8041234567",
    gstin: "29AAECL4821K1Z6",
    address: "3rd floor, 42 Whitefield Main Road",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560066",
  },
  shipping: {
    freeThreshold: String(FREE_DELIVERY_THRESHOLD),
    deliveryFee: String(DELIVERY_FEE),
    express: true,
    expressFee: String(EXPRESS_FEE),
    pins: pincodes.filter((p) => p.serviceable).map((p) => p.pincode).join(", "),
  },
  payments: { upi: true, cards: true, netbanking: true, wallets: true, emi: true, cod: true, codLimit: "45000", codFee: String(COD_FEE) },
  taxes: { inclusive: true, hsn: "6109", gstRate: "12" },
  notifications: {
    placed: { email: true, sms: true, whatsapp: true },
    "cod-confirm": { email: false, sms: false, whatsapp: true },
    shipped: { email: true, sms: true, whatsapp: true },
    ofd: { email: false, sms: true, whatsapp: true },
    delivered: { email: true, sms: false, whatsapp: false },
    return: { email: true, sms: false, whatsapp: true },
    refund: { email: true, sms: true, whatsapp: false },
  },
  permissions: rolePermissions,
};

export type SettingsErrors = Partial<Record<string, string>>;

export function validateSettings(s: StoreSettings): SettingsErrors {
  const e: SettingsErrors = {};
  const money = (v: string) => isMoney(v, { minorUnits: 0 });
  if (!s.profile.storeName.trim()) e["profile.storeName"] = "Enter a store name. Shoppers see it on invoices and emails.";
  if (!EMAIL_PATTERN.test(s.profile.supportEmail)) e["profile.supportEmail"] = "Enter an email like care@yourstore.in.";
  if (!PHONE_PATTERN.test(s.profile.supportPhone)) e["profile.supportPhone"] = "Enter a 10-digit Indian number starting with 6, 7, 8 or 9.";
  if (s.profile.gstin.length !== 15) e["profile.gstin"] = `A GSTIN has 15 characters (${s.profile.gstin.length} entered).`;
  else if (!GSTIN_PATTERN.test(s.profile.gstin)) e["profile.gstin"] = "This isn’t a valid GSTIN. Check the state code, PAN and the Z in the 14th place.";
  if (!s.profile.address.trim()) e["profile.address"] = "Enter the registered business address.";
  if (!s.profile.city.trim()) e["profile.city"] = "Enter the city.";
  if (!PIN_PATTERN.test(s.profile.pincode)) e["profile.pincode"] = "Enter a 6-digit PIN code.";
  if (!money(s.shipping.freeThreshold)) e["shipping.freeThreshold"] = "Enter a whole rupee amount, or 0 for always free.";
  if (!money(s.shipping.deliveryFee)) e["shipping.deliveryFee"] = "Enter a whole rupee amount.";
  if (s.shipping.express && !money(s.shipping.expressFee)) e["shipping.expressFee"] = "Enter a whole rupee amount.";
  if (parsePins(s.shipping.pins).valid.length === 0) e["shipping.pins"] = "Add at least one 6-digit PIN code you deliver to.";
  if (![s.payments.upi, s.payments.cards, s.payments.netbanking, s.payments.wallets, s.payments.emi].some(Boolean)) e["payments.methods"] = "Keep at least one prepaid method on, so shoppers can pay online.";
  if (s.payments.cod && (!money(s.payments.codLimit) || Number(s.payments.codLimit) < 1000)) e["payments.codLimit"] = "Set a daily COD limit of ₹1,000 or more.";
  if (s.payments.cod && !money(s.payments.codFee)) e["payments.codFee"] = "Enter a whole rupee amount, or 0 for no fee.";
  if (!HSN_PATTERN.test(s.taxes.hsn)) e["taxes.hsn"] = "HSN codes are 4, 6 or 8 digits.";
  return e;
}

/** Cash on Delivery value placed today and not cancelled: what the store is exposed to if it isn't collected. */
export const todaysCodExposure = adminOrders
  .filter((o) => {
    const d = new Date(o.placedAt);
    return o.payment === "COD" && o.status !== "cancelled" && d.getFullYear() === ADMIN_TODAY.getFullYear() && d.getMonth() === ADMIN_TODAY.getMonth() && d.getDate() === ADMIN_TODAY.getDate();
  })
  .reduce((sum, o) => sum + o.total, 0);

/* ---------------------------------------------------------------- audit log */

export type AuditType = "orders" | "returns" | "catalog" | "payouts" | "marketing" | "settings";
export type AuditEntry = { id: string; actor: string; action: string; at: string; tone: "neutral" | "accent" | "success" | "warning" | "danger"; type: AuditType };

export const auditTypeLabels: Record<AuditType, string> = {
  orders: "Orders",
  returns: "Returns & refunds",
  catalog: "Catalog",
  payouts: "Payouts & GST",
  marketing: "Coupons",
  settings: "Settings & staff",
};

const at = (days: number, h: number, m: number) => new Date(ADMIN_TODAY.getFullYear(), ADMIN_TODAY.getMonth(), ADMIN_TODAY.getDate() - days, h, m).toISOString();
const baseTypes: Record<string, AuditType> = { a1: "orders", a2: "catalog", a3: "returns", a4: "payouts", a5: "catalog", a6: "orders", a7: "marketing" };

export const fullAuditLog: AuditEntry[] = ([
  ...auditLog.map((a): AuditEntry => ({ ...a, type: baseTypes[a.id] ?? "settings" })),
  { id: "b1", actor: "Rohan Mehta", action: "downloaded the GSTR-1 summary for August 2026", at: at(0, 10, 20), tone: "neutral", type: "payouts" },
  { id: "b2", actor: "Sujon Ahmed", action: "reminded Kabir Singh to turn on two-factor authentication", at: at(0, 9, 50), tone: "warning", type: "settings" },
  { id: "b3", actor: "Priya Nair", action: "scheduled a Blue Dart pickup for 12 orders", at: at(0, 8, 15), tone: "accent", type: "orders" },
  { id: "b4", actor: "System", action: "turned off COD for PIN 744101 after repeated RTOs", at: at(1, 21, 5), tone: "warning", type: "settings" },
  { id: "b5", actor: "Meera Iyer", action: "rejected return RT-7007: product shows signs of use", at: at(1, 13, 30), tone: "danger", type: "returns" },
  { id: "b6", actor: "Rohan Mehta", action: "exported settlements for August 2026", at: at(2, 11, 45), tone: "neutral", type: "payouts" },
  { id: "b7", actor: "Kabir Singh", action: "published 3 products in Footwear", at: at(2, 16, 20), tone: "success", type: "catalog" },
  { id: "b8", actor: "Sujon Ahmed", action: "raised the free delivery threshold from ₹399 to ₹499", at: at(3, 10, 5), tone: "neutral", type: "settings" },
  { id: "b9", actor: "Razorpay", action: "settled ₹6,17,912 for STL-2605 to HDFC Bank •• 7781", at: at(4, 17, 0), tone: "success", type: "payouts" },
  { id: "b10", actor: "Priya Nair", action: "cancelled LM-200512 at the customer’s request", at: at(4, 12, 40), tone: "neutral", type: "orders" },
  { id: "b11", actor: "Sujon Ahmed", action: "invited rohan@bluesigns.shop as Finance", at: at(5, 9, 30), tone: "accent", type: "settings" },
  { id: "b12", actor: "Meera Iyer", action: "refunded ₹2,499 to UPI for RT-7002", at: at(5, 15, 10), tone: "success", type: "returns" },
  { id: "b13", actor: "System", action: "sent a reminder: STL-2606 is on hold until the bank account is verified", at: at(6, 18, 0), tone: "warning", type: "payouts" },
  { id: "b14", actor: "Sujon Ahmed", action: "paused coupon WINBACK", at: at(7, 11, 0), tone: "neutral", type: "marketing" },
  { id: "b15", actor: "Kabir Singh", action: "set HSN 3304 on 9 Beauty products", at: at(8, 14, 25), tone: "neutral", type: "catalog" },
] satisfies AuditEntry[]).sort((a, b) => (a.at < b.at ? 1 : -1));

/* ---------------------------------------------------------------- section contract */

export type SettingsSectionFormProps = {
  draft: StoreSettings;
  /** Immutable update of the draft. */
  update: (fn: (d: StoreSettings) => StoreSettings) => void;
  /** Visible error for a field path ("profile.gstin"), once touched or after a save attempt. */
  error: (path: string) => string | undefined;
  touch: (path: string) => void;
};
