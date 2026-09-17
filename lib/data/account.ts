/* Demo account data: profile details, devices, gift cards, rewards and notification settings. */

export const profile = {
  name: "Sujon Ahmed",
  email: "sujon@bluesigns.shop",
  emailVerified: true,
  mobile: "9876543210",
  mobileVerified: true,
  alternateMobile: "",
  gender: "male" as "female" | "male" | "other" | "undisclosed",
  dateOfBirth: "1995-06-14",
  memberSince: "2023-02-11",
};

export type Device = {
  id: string;
  kind: "phone" | "desktop" | "tablet";
  name: string;
  location: string;
  lastActive: string;
  current?: boolean;
};

export const devices: Device[] = [
  { id: "d1", kind: "desktop", name: "Chrome on Windows", location: "Bengaluru, Karnataka", lastActive: "2026-09-15T04:10:00Z", current: true },
  { id: "d2", kind: "phone", name: "BlueSigns app on Android", location: "Bengaluru, Karnataka", lastActive: "2026-09-14T18:22:00Z" },
  { id: "d3", kind: "tablet", name: "Safari on iPad", location: "Mumbai, Maharashtra", lastActive: "2026-08-30T09:05:00Z" },
];

export type GiftCard = { id: string; last4: string; balance: number; original: number; expiresOn: string; from?: string };

export const giftCards: GiftCard[] = [
  { id: "g1", last4: "8842", balance: 1000, original: 2000, expiresOn: "2027-03-31", from: "Ananya" },
  { id: "g2", last4: "1307", balance: 500, original: 500, expiresOn: "2026-10-05" },
];

export const rewards = {
  points: 1840,
  /** ₹ value of one point. */
  pointValue: 0.1,
  tier: "Gold",
  nextTier: "Platinum",
  nextTierAt: 2500,
  expiringPoints: 220,
  expiringOn: "2026-10-31",
};

export type NotificationChannel = "sms" | "email" | "whatsapp" | "push";

export type NotificationCategory = {
  id: string;
  label: string;
  description: string;
  /** Channels that can't be turned off (e.g. order OTPs by SMS). */
  locked?: NotificationChannel[];
};

export const notificationCategories: NotificationCategory[] = [
  { id: "orders", label: "Order and delivery updates", description: "Confirmations, shipping, delivery OTP, returns and refunds", locked: ["sms"] },
  { id: "account", label: "Account and security", description: "Sign-ins, password changes and account alerts", locked: ["email"] },
  { id: "price", label: "Price drops and back in stock", description: "For items in your wishlist and bag" },
  { id: "offers", label: "Offers and sales", description: "Coupons, festive sales and member early access" },
  { id: "reviews", label: "Review reminders", description: "A reminder to rate items after delivery" },
];

export const defaultNotificationPrefs: Record<string, Record<NotificationChannel, boolean>> = {
  orders: { sms: true, email: true, whatsapp: true, push: true },
  account: { sms: true, email: true, whatsapp: false, push: true },
  price: { sms: false, email: true, whatsapp: false, push: true },
  offers: { sms: false, email: false, whatsapp: false, push: false },
  reviews: { sms: false, email: true, whatsapp: false, push: false },
};
