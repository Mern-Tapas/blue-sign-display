/**
 * Demo data for the /admin back office. Everything here is illustrative (PRODUCT.md: honest proof only)
 * and generated deterministically from a fixed seed and a fixed "today", so server and client agree.
 */
import { categories, products } from "./products";

export const ADMIN_TODAY = new Date(2026, 8, 15); // 15 Sept 2026
export const ADMIN_DEMO_NOTE = "Demo data — illustrative figures, not real store performance.";

/* ---------------------------------------------------------------- seeded PRNG */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260915);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)]!;
const between = (min: number, max: number) => Math.round(min + rand() * (max - min));
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const daysAgo = (n: number, hour = 10, minute = 0) => new Date(ADMIN_TODAY.getFullYear(), ADMIN_TODAY.getMonth(), ADMIN_TODAY.getDate() - n, hour, minute);

/* ---------------------------------------------------------------- customers */

const firstNames = ["Aarav", "Diya", "Kabir", "Ananya", "Vihaan", "Ishita", "Arjun", "Meera", "Rohan", "Sara", "Aditya", "Nisha", "Karan", "Priya", "Dev", "Tanvi", "Neel", "Zoya", "Rahul", "Aisha", "Siddharth", "Riya", "Yash", "Pooja", "Farhan", "Kavya", "Manish", "Sneha", "Omar", "Lakshmi"];
const lastNames = ["Sharma", "Iyer", "Khan", "Reddy", "Patel", "Nair", "Singh", "Das", "Mehta", "Gupta", "Menon", "Joshi", "Ahmed", "Rao", "Bose", "Kulkarni", "Chatterjee", "Pillai"];
const cities: [string, string, string][] = [
  ["Bengaluru", "Karnataka", "560066"], ["Mumbai", "Maharashtra", "400001"], ["New Delhi", "Delhi", "110001"], ["Hyderabad", "Telangana", "500081"],
  ["Chennai", "Tamil Nadu", "600017"], ["Pune", "Maharashtra", "411001"], ["Kolkata", "West Bengal", "700016"], ["Ahmedabad", "Gujarat", "380009"],
  ["Jaipur", "Rajasthan", "302001"], ["Kochi", "Kerala", "682016"], ["Lucknow", "Uttar Pradesh", "226001"], ["Guwahati", "Assam", "781001"],
];

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  joinedAt: string;
  orders: number;
  lifetimeValue: number;
  lastOrderAt: string;
  segment: "new" | "repeat" | "vip" | "at-risk";
  marketingOptIn: boolean;
};

export const adminCustomers: AdminCustomer[] = Array.from({ length: 48 }, (_, i) => {
  const fn = firstNames[i % firstNames.length]!;
  const ln = pick(lastNames);
  const [city, state, pincode] = pick(cities);
  const orders = i % 9 === 0 ? between(9, 16) : i % 4 === 0 ? between(3, 8) : between(1, 2);
  const ltv = orders * between(1800, 9500);
  const lastDays = between(0, 160);
  return {
    id: `CUS-${String(4100 + i)}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.in`,
    phone: `9${between(100000000, 999999999)}`,
    city,
    state,
    pincode,
    joinedAt: isoDay(daysAgo(between(20, 700))),
    orders,
    lifetimeValue: ltv,
    lastOrderAt: isoDay(daysAgo(lastDays)),
    segment: orders >= 9 ? "vip" : lastDays > 120 ? "at-risk" : orders >= 3 ? "repeat" : "new",
    marketingOptIn: rand() > 0.35,
  };
});

/* ---------------------------------------------------------------- orders */

export type AdminOrderStatus = "pending" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled" | "rto" | "returned";
export type PaymentMode = "UPI" | "Card" | "COD" | "Net banking" | "Wallet" | "EMI";

export type AdminOrderLine = { productId: string; name: string; image: string; sku: string; size?: string; quantity: number; price: number };

export type AdminOrder = {
  id: string;
  placedAt: string;
  customerId: string;
  customerName: string;
  city: string;
  state: string;
  pincode: string;
  lines: AdminOrderLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  payment: PaymentMode;
  paymentStatus: "paid" | "pending" | "refunded" | "failed";
  status: AdminOrderStatus;
  courier?: string;
  awb?: string;
  /** Dispatch SLA — ISO timestamp by which the order must ship. */
  shipBy: string;
  channel: "Web" | "App";
  coupon?: string;
  notes?: string;
};

export const orderStatusMeta: Record<AdminOrderStatus, { label: string; tone: "neutral" | "accent" | "success" | "warning" | "danger" | "info"; live?: boolean }> = {
  pending: { label: "Payment pending", tone: "warning" },
  confirmed: { label: "To pack", tone: "info" },
  packed: { label: "Ready to ship", tone: "accent" },
  shipped: { label: "Shipped", tone: "accent" },
  "out-for-delivery": { label: "Out for delivery", tone: "accent", live: true },
  delivered: { label: "Delivered", tone: "success" },
  cancelled: { label: "Cancelled", tone: "neutral" },
  rto: { label: "RTO", tone: "danger" },
  returned: { label: "Returned", tone: "neutral" },
};

const couriers = ["Delhivery", "Blue Dart", "Ekart", "Shadowfax", "XpressBees"];
const statusByAge = (days: number, cod: boolean): AdminOrderStatus => {
  const r = rand();
  if (days === 0) return r < 0.15 && !cod ? "pending" : r < 0.7 ? "confirmed" : "packed";
  if (days === 1) return r < 0.3 ? "packed" : r < 0.85 ? "shipped" : "cancelled";
  if (days <= 3) return r < 0.5 ? "shipped" : r < 0.8 ? "out-for-delivery" : r < 0.92 ? "delivered" : "cancelled";
  if (cod && r < 0.09) return "rto";
  if (r < 0.05) return "returned";
  if (r < 0.08) return "cancelled";
  return "delivered";
};

export const adminOrders: AdminOrder[] = Array.from({ length: 120 }, (_, i) => {
  const age = i < 14 ? 0 : i < 26 ? 1 : i < 44 ? between(2, 3) : between(4, 60);
  const placed = daysAgo(age, between(7, 23), between(0, 59));
  const cust = adminCustomers[between(0, adminCustomers.length - 1)]!;
  const count = rand() < 0.7 ? 1 : between(2, 3);
  const lines: AdminOrderLine[] = Array.from({ length: count }, () => {
    const p = pick(products);
    return {
      productId: p.id,
      name: p.name,
      image: p.images[0]!,
      sku: `LM-${p.category.slice(0, 3).toUpperCase()}-${p.id.toUpperCase()}${p.sizes?.length ? `-${p.sizes[0]}` : ""}`,
      size: p.sizes?.[between(0, p.sizes.length - 1)],
      quantity: rand() < 0.85 ? 1 : 2,
      price: p.price,
    };
  });
  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const coupon = rand() < 0.25 ? pick(["BLUESIGNS20", "FIRST10", "FESTIVE15"]) : undefined;
  const discount = coupon ? Math.round(subtotal * 0.1) : 0;
  const payment: PaymentMode = pick(["UPI", "UPI", "UPI", "Card", "COD", "COD", "Net banking", "Wallet", "EMI"] as const);
  const shipping = subtotal - discount >= 499 ? 0 : 49;
  const status = statusByAge(age, payment === "COD");
  const shipped = ["shipped", "out-for-delivery", "delivered", "rto", "returned"].includes(status);
  return {
    id: `LM-${200600 - i}`,
    placedAt: placed.toISOString(),
    customerId: cust.id,
    customerName: cust.name,
    city: cust.city,
    state: cust.state,
    pincode: cust.pincode,
    lines,
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping + (payment === "COD" ? 19 : 0),
    payment,
    paymentStatus: status === "pending" ? "pending" : status === "cancelled" && payment !== "COD" ? "refunded" : status === "returned" ? "refunded" : payment === "COD" && !["delivered"].includes(status) ? "pending" : "paid",
    status,
    courier: shipped ? pick(couriers) : undefined,
    awb: shipped ? `${between(1000, 9999)}${between(100000, 999999)}` : undefined,
    shipBy: new Date(placed.getTime() + 36 * 3600000).toISOString(),
    channel: rand() < 0.62 ? "App" : "Web",
    coupon,
    notes: i === 3 ? "Gift — no invoice in the box" : undefined,
  };
});

/* ---------------------------------------------------------------- catalog & inventory */

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  sku: string;
  hsn: string;
  gstRate: 5 | 12 | 18;
  mrp: number;
  price: number;
  stock: number;
  reorderPoint: number;
  status: "active" | "draft" | "archived";
  sold30d: number;
  revenue30d: number;
  variants: { sku: string; label: string; stock: number }[];
  updatedAt: string;
};

const hsnByCategory: Record<string, [string, 5 | 12 | 18]> = {
  audio: ["8518", 18], watches: ["9102", 18], footwear: ["6404", 12], apparel: ["6109", 5], beauty: ["3304", 18], home: ["9405", 12],
};

export const adminProducts: AdminProduct[] = products.map((p, i) => {
  const [hsn, gstRate] = hsnByCategory[p.category] ?? ["9999", 18];
  const sold = between(4, 180);
  const variants = (p.sizes?.length ? p.sizes : p.colors?.map((c) => c.name) ?? ["Default"]).map((label) => ({
    sku: `LM-${p.category.slice(0, 3).toUpperCase()}-${p.id.toUpperCase()}-${label.replace(/\s+/g, "").toUpperCase()}`,
    label,
    stock: p.stock === 0 ? 0 : between(0, Math.max(2, Math.round(p.stock / 2))),
  }));
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: categories.find((c) => c.slug === p.category)?.name ?? p.category,
    image: p.images[0]!,
    sku: `LM-${p.category.slice(0, 3).toUpperCase()}-${p.id.toUpperCase()}`,
    hsn,
    gstRate,
    mrp: p.compareAt ?? p.price,
    price: p.price,
    stock: variants.reduce((s, v) => s + v.stock, 0),
    reorderPoint: 10,
    status: i === 13 ? "draft" : i === 15 ? "archived" : "active",
    sold30d: sold,
    revenue30d: sold * p.price,
    variants,
    updatedAt: isoDay(daysAgo(between(0, 40))),
  };
});

/* ---------------------------------------------------------------- returns */

export type AdminReturn = {
  id: string;
  orderId: string;
  customerName: string;
  productName: string;
  image: string;
  reason: "Size too small" | "Size too large" | "Damaged in transit" | "Different from picture" | "Quality not as expected" | "Changed mind";
  resolution: "refund" | "exchange";
  amount: number;
  requestedAt: string;
  status: "requested" | "approved" | "pickup-scheduled" | "received" | "refunded" | "rejected";
  photos: number;
};

export const adminReturns: AdminReturn[] = adminOrders
  .filter((o) => o.status === "delivered")
  .slice(0, 14)
  .map((o, i) => ({
    id: `RT-${7000 + i}`,
    orderId: o.id,
    customerName: o.customerName,
    productName: o.lines[0]!.name,
    image: o.lines[0]!.image,
    reason: pick(["Size too small", "Size too large", "Damaged in transit", "Different from picture", "Quality not as expected", "Changed mind"] as const),
    resolution: rand() < 0.3 ? "exchange" : "refund",
    amount: o.lines[0]!.price,
    requestedAt: daysAgo(between(0, 9), between(9, 21)).toISOString(),
    status: (["requested", "requested", "requested", "approved", "pickup-scheduled", "received", "refunded", "rejected"] as const)[i % 8]!,
    photos: rand() < 0.5 ? between(1, 3) : 0,
  }));

/* ---------------------------------------------------------------- coupons */

export type AdminCoupon = {
  code: string;
  description: string;
  type: "percent" | "flat" | "free-shipping";
  value: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit?: number;
  used: number;
  startsAt: string;
  endsAt: string;
  status: "active" | "scheduled" | "expired" | "paused";
  newCustomersOnly?: boolean;
};

export const adminCoupons: AdminCoupon[] = [
  { code: "BLUESIGNS20", description: "20% off sitewide", type: "percent", value: 20, minOrder: 1499, maxDiscount: 1500, usageLimit: 5000, used: 3184, startsAt: "2026-09-01", endsAt: "2026-09-30", status: "active" },
  { code: "FIRST10", description: "10% off the first order", type: "percent", value: 10, minOrder: 0, maxDiscount: 500, used: 912, startsAt: "2026-01-01", endsAt: "2026-12-31", status: "active", newCustomersOnly: true },
  { code: "FREESHIP", description: "Free delivery under ₹499", type: "free-shipping", value: 49, minOrder: 0, used: 2230, startsAt: "2026-08-15", endsAt: "2026-09-20", status: "active" },
  { code: "FESTIVE15", description: "Festive sale — 15% off", type: "percent", value: 15, minOrder: 2999, maxDiscount: 2000, usageLimit: 10000, used: 0, startsAt: "2026-10-01", endsAt: "2026-10-25", status: "scheduled" },
  { code: "AUDIO500", description: "₹500 off audio above ₹5,000", type: "flat", value: 500, minOrder: 5000, usageLimit: 800, used: 800, startsAt: "2026-07-01", endsAt: "2026-08-31", status: "expired" },
  { code: "WINBACK", description: "₹300 off for lapsed customers", type: "flat", value: 300, minOrder: 1999, usageLimit: 1000, used: 146, startsAt: "2026-09-05", endsAt: "2026-10-05", status: "paused" },
];

/* ---------------------------------------------------------------- finance */

export type Settlement = {
  id: string;
  periodFrom: string;
  periodTo: string;
  orders: number;
  gross: number;
  gatewayFees: number;
  shippingCharges: number;
  tcs: number;
  tds: number;
  refunds: number;
  net: number;
  status: "paid" | "processing" | "on-hold";
  utr?: string;
  paidOn?: string;
};

export const settlements: Settlement[] = Array.from({ length: 8 }, (_, i) => {
  const to = daysAgo(i * 7 + 1);
  const from = daysAgo(i * 7 + 7);
  const gross = between(420000, 980000);
  const gatewayFees = Math.round(gross * 0.018);
  const shippingCharges = Math.round(gross * 0.045);
  const tcs = Math.round(gross * 0.005);
  const tds = Math.round(gross * 0.001);
  const refunds = between(8000, 42000);
  return {
    id: `STL-${2609 - i}`,
    periodFrom: isoDay(from),
    periodTo: isoDay(to),
    orders: between(260, 640),
    gross,
    gatewayFees,
    shippingCharges,
    tcs,
    tds,
    refunds,
    net: gross - gatewayFees - shippingCharges - tcs - tds - refunds,
    status: i === 0 ? "processing" : i === 3 ? "on-hold" : "paid",
    utr: i === 0 || i === 3 ? undefined : `UTIB${between(100000000, 999999999)}`,
    paidOn: i === 0 || i === 3 ? undefined : isoDay(daysAgo(i * 7 - 2)),
  };
});

/* ---------------------------------------------------------------- analytics series */

/** Daily revenue and orders for the last 90 days (index 89 = today). */
export const dailySales = Array.from({ length: 90 }, (_, i) => {
  const d = daysAgo(89 - i);
  const weekend = d.getDay() === 0 || d.getDay() === 6;
  const growth = 1 + i / 260;
  const orders = Math.round((weekend ? 118 : 92) * growth + between(-14, 14));
  const aov = between(2350, 2900);
  return { date: isoDay(d), label: `${d.getDate()} ${MONTHS[d.getMonth()]}`, orders, revenue: orders * aov, visitors: Math.round(orders * between(32, 40)) };
});

export const paymentMix = [
  { id: "upi", label: "UPI", value: 0.46, slot: 0 },
  { id: "card", label: "Cards", value: 0.19, slot: 1 },
  { id: "cod", label: "Cash on Delivery", value: 0.24, slot: 2 },
  { id: "netbanking", label: "Net banking", value: 0.05, slot: 3 },
  { id: "other", label: "Wallets & EMI", value: 0.06, slot: 4 },
];

export const categorySales = categories.map((c, i) => ({ id: c.slug, label: c.name, revenue: [3120000, 2240000, 2860000, 1980000, 760000, 910000][i] ?? 500000, lastPeriod: [2810000, 2390000, 2410000, 1760000, 690000, 980000][i] ?? 450000 }));

export const conversionFunnel = [
  { id: "sessions", label: "Sessions", value: 318400 },
  { id: "pdp", label: "Viewed a product", value: 142900 },
  { id: "bag", label: "Added to bag", value: 31260 },
  { id: "checkout", label: "Reached checkout", value: 14820 },
  { id: "paid", label: "Placed order", value: 9140 },
];

export const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const hours = Array.from({ length: 24 }, (_, h) => (h === 0 ? "12a" : h < 12 ? `${h}a` : h === 12 ? "12p" : `${h - 12}p`));
/** Orders by weekday × hour (IST), last 30 days. */
export const ordersHeatmap = weekdays.map((_, d) =>
  hours.map((__, h) => {
    const evening = h >= 19 && h <= 23 ? 2.4 : h >= 12 && h <= 14 ? 1.5 : h >= 9 && h <= 18 ? 1.1 : h <= 6 ? 0.15 : 0.6;
    const weekend = d >= 5 ? 1.35 : 1;
    return Math.round(evening * weekend * between(18, 26));
  }),
);

export const returnReasons = [
  { id: "small", label: "Size too small", value: 138 },
  { id: "large", label: "Size too large", value: 96 },
  { id: "quality", label: "Quality not as expected", value: 61 },
  { id: "picture", label: "Different from picture", value: 44 },
  { id: "damaged", label: "Damaged in transit", value: 27 },
];

/* ---------------------------------------------------------------- team & audit */

export type StaffMember = { id: string; name: string; email: string; role: "Owner" | "Admin" | "Operations" | "Catalog" | "Support" | "Finance"; lastActive: string; twoFactor: boolean };

export const staff: StaffMember[] = [
  { id: "u1", name: "Sujon Ahmed", email: "sujon@bluesigns.shop", role: "Owner", lastActive: daysAgo(0, 9, 40).toISOString(), twoFactor: true },
  { id: "u2", name: "Priya Nair", email: "priya@bluesigns.shop", role: "Operations", lastActive: daysAgo(0, 11, 5).toISOString(), twoFactor: true },
  { id: "u3", name: "Kabir Singh", email: "kabir@bluesigns.shop", role: "Catalog", lastActive: daysAgo(1, 18, 20).toISOString(), twoFactor: false },
  { id: "u4", name: "Meera Iyer", email: "meera@bluesigns.shop", role: "Support", lastActive: daysAgo(0, 10, 12).toISOString(), twoFactor: true },
  { id: "u5", name: "Rohan Mehta", email: "rohan@bluesigns.shop", role: "Finance", lastActive: daysAgo(3, 16, 0).toISOString(), twoFactor: true },
];

export const permissionAreas = ["Orders", "Returns & refunds", "Products & inventory", "Customers", "Coupons", "Payouts & GST", "Reports", "Settings & staff"] as const;
export const rolePermissions: Record<StaffMember["role"], Record<(typeof permissionAreas)[number], "none" | "view" | "edit">> = {
  Owner: { Orders: "edit", "Returns & refunds": "edit", "Products & inventory": "edit", Customers: "edit", Coupons: "edit", "Payouts & GST": "edit", Reports: "edit", "Settings & staff": "edit" },
  Admin: { Orders: "edit", "Returns & refunds": "edit", "Products & inventory": "edit", Customers: "edit", Coupons: "edit", "Payouts & GST": "view", Reports: "view", "Settings & staff": "view" },
  Operations: { Orders: "edit", "Returns & refunds": "edit", "Products & inventory": "view", Customers: "view", Coupons: "none", "Payouts & GST": "none", Reports: "view", "Settings & staff": "none" },
  Catalog: { Orders: "view", "Returns & refunds": "none", "Products & inventory": "edit", Customers: "none", Coupons: "view", "Payouts & GST": "none", Reports: "view", "Settings & staff": "none" },
  Support: { Orders: "view", "Returns & refunds": "edit", "Products & inventory": "view", Customers: "edit", Coupons: "view", "Payouts & GST": "none", Reports: "none", "Settings & staff": "none" },
  Finance: { Orders: "view", "Returns & refunds": "view", "Products & inventory": "none", Customers: "none", Coupons: "view", "Payouts & GST": "edit", Reports: "edit", "Settings & staff": "none" },
};

export const auditLog = [
  { id: "a1", actor: "Priya Nair", action: `marked ${adminOrders[20]!.id} as shipped with Delhivery`, at: daysAgo(0, 11, 2).toISOString(), tone: "accent" as const },
  { id: "a2", actor: "System", action: "flagged Pulse Smart Watch as low stock (3 left)", at: daysAgo(0, 9, 30).toISOString(), tone: "warning" as const },
  { id: "a3", actor: "Meera Iyer", action: `approved return ${adminReturns[3]?.id ?? "RT-7003"}`, at: daysAgo(0, 8, 55).toISOString(), tone: "success" as const },
  { id: "a4", actor: "Razorpay", action: "settled ₹6,84,210 to HDFC Bank •• 7781", at: daysAgo(1, 17, 0).toISOString(), tone: "success" as const },
  { id: "a5", actor: "Kabir Singh", action: "changed the price of Field Jacket to ₹8,499", at: daysAgo(1, 15, 42).toISOString(), tone: "neutral" as const },
  { id: "a6", actor: "System", action: `marked ${adminOrders[60]!.id} as RTO after 3 failed delivery attempts`, at: daysAgo(2, 19, 10).toISOString(), tone: "danger" as const },
  { id: "a7", actor: "Sujon Ahmed", action: "scheduled coupon FESTIVE15 for 1 Oct", at: daysAgo(3, 12, 0).toISOString(), tone: "accent" as const },
];

/* ---------------------------------------------------------------- derived helpers */

export function salesTotals(days: number) {
  const now = dailySales.slice(-days);
  const prev = dailySales.slice(-days * 2, -days);
  const sum = (rows: typeof dailySales, k: "orders" | "revenue" | "visitors") => rows.reduce((s, r) => s + r[k], 0);
  const cur = { revenue: sum(now, "revenue"), orders: sum(now, "orders"), visitors: sum(now, "visitors") };
  const old = { revenue: sum(prev, "revenue"), orders: sum(prev, "orders"), visitors: sum(prev, "visitors") };
  const pct = (a: number, b: number) => (b ? ((a - b) / b) * 100 : 0);
  return {
    revenue: cur.revenue,
    orders: cur.orders,
    aov: Math.round(cur.revenue / Math.max(1, cur.orders)),
    conversion: (cur.orders / Math.max(1, cur.visitors)) * 100,
    delta: {
      revenue: pct(cur.revenue, old.revenue),
      orders: pct(cur.orders, old.orders),
      aov: pct(cur.revenue / cur.orders, old.revenue / Math.max(1, old.orders)),
      conversion: pct(cur.orders / cur.visitors, old.orders / Math.max(1, old.visitors)),
    },
  };
}

export const pendingWork = {
  toPack: adminOrders.filter((o) => o.status === "confirmed").length,
  toShip: adminOrders.filter((o) => o.status === "packed").length,
  paymentPending: adminOrders.filter((o) => o.status === "pending").length,
  returnsToReview: adminReturns.filter((r) => r.status === "requested").length,
  lowStock: adminProducts.filter((p) => p.status === "active" && p.stock <= p.reorderPoint).length,
  breachingSla: adminOrders.filter((o) => ["confirmed", "packed"].includes(o.status) && new Date(o.shipBy) < new Date(ADMIN_TODAY.getTime() + 24 * 3600000)).length,
};

/** "₹12.4L" / "₹1.2Cr" — Indian compact currency for KPI tiles. */
export function inrCompact(v: number) {
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(v >= 1e8 ? 0 : 2)}Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(v >= 1e6 ? 1 : 2)}L`;
  if (v >= 1e3) return `₹${(v / 1e3).toFixed(1)}K`;
  return `₹${v}`;
}
