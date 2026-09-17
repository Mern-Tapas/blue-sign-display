import { avatars, unsplash } from "./images";
import type { Order, Review } from "./types";

/** Illustrative reviews — rendered with a "Demo review" label (PRODUCT.md: honest proof only). */
export const reviews: Review[] = [
  {
    id: "r1",
    productId: "p1",
    author: "Ananya Iyer",
    avatar: avatars.maria,
    rating: 5,
    title: "Quiet, comfy, and the battery is unreal",
    body: "I wear these through full workdays and forget they're on. Noise cancelling handles the metro commute easily and I charge them maybe once a week.",
    date: "2026-08-21",
    verified: true,
    helpful: 48,
    media: [unsplash("1505740420928-5e560c06d30e", 400), unsplash("1583394838336-acd977736f90", 400)],
    demo: true,
  },
  {
    id: "r2",
    productId: "p1",
    author: "Rohan Mehta",
    avatar: avatars.james,
    rating: 4,
    title: "Great sound, case could be smaller",
    body: "Balanced, detailed sound without the boomy bass. Only gripe is the carrying case is a bit bulky for my office bag.",
    date: "2026-08-03",
    verified: true,
    helpful: 21,
    demo: true,
  },
  {
    id: "r3",
    productId: "p1",
    author: "Aisha Khan",
    avatar: avatars.aisha,
    rating: 5,
    title: "Multipoint just works",
    body: "Switching between laptop and phone is seamless. The violet colour looks even better in person.",
    date: "2026-07-18",
    verified: false,
    helpful: 9,
    demo: true,
  },
  {
    id: "r4",
    productId: "p1",
    author: "Vikram Nair",
    avatar: avatars.leo,
    rating: 3,
    title: "Good, but tight at first",
    body: "Clamping force was strong for the first week. Loosened up nicely after that.",
    date: "2026-06-30",
    verified: true,
    helpful: 4,
    demo: true,
  },
];

/** Rating distribution for the histogram, 5★ → 1★ (demo). */
export const ratingBreakdown = [
  { stars: 5, count: 842 },
  { stars: 4, count: 301 },
  { stars: 3, count: 88 },
  { stars: 2, count: 31 },
  { stars: 1, count: 22 },
];

/** Aspect ratings for the demo product, 0–5. */
export const aspectRatings = [
  { label: "Sound quality", value: 4.6 },
  { label: "Comfort", value: 4.4 },
  { label: "Battery life", value: 4.8 },
  { label: "Value for money", value: 4.1 },
];

const HOME = "Flat 402, Prestige Lakeside, Varthur Road, Whitefield, Bengaluru, Karnataka 560066";

export const orders: Order[] = [
  {
    id: "LM-100482",
    date: "2026-09-12",
    status: "out-for-delivery",
    total: 21596,
    address: HOME,
    paymentMethod: "UPI · sujon@okaxis",
    courier: "Delhivery",
    awb: "DL8821347790IN",
    expectedBy: "2026-09-15",
    items: [
      { productId: "p1", quantity: 1, price: 12999, color: "Violet" },
      { productId: "p9", quantity: 2, price: 1299, size: "M", color: "Black" },
      { productId: "p15", quantity: 1, price: 5999, color: "Chalk" },
    ],
    timeline: [
      { status: "Order placed", description: "We've received your order.", date: "2026-09-12T09:24:00Z", done: true, location: "Online" },
      { status: "Packed", description: "Your items are packed and ready.", date: "2026-09-12T16:10:00Z", done: true, location: "Bhiwandi warehouse" },
      { status: "Shipped", description: "Handed to Delhivery · AWB DL8821347790IN", date: "2026-09-13T08:02:00Z", done: true, location: "Mumbai hub" },
      { status: "Out for delivery", description: "Arriving today by 9 PM.", date: "2026-09-15T02:15:00Z", done: true, location: "Whitefield delivery centre" },
      { status: "Delivered", description: "Share OTP with the delivery partner.", done: false },
    ],
  },
  {
    id: "LM-100377",
    date: "2026-09-06",
    status: "delivered",
    total: 6999,
    address: HOME,
    paymentMethod: "HDFC Bank Credit Card •• 4242",
    courier: "Ekart",
    awb: "EK5530917724",
    deliveredOn: "2026-09-09",
    items: [{ productId: "p5", quantity: 1, price: 6999, size: "42", color: "Crimson" }],
    timeline: [
      { status: "Order placed", description: "", date: "2026-09-06T12:00:00Z", done: true, location: "Online" },
      { status: "Shipped", description: "", date: "2026-09-07T10:00:00Z", done: true, location: "Bengaluru hub" },
      { status: "Delivered", description: "Handed to resident.", date: "2026-09-09T09:52:00Z", done: true, location: "Whitefield" },
    ],
  },
  {
    id: "LM-100251",
    date: "2026-08-02",
    status: "processing",
    total: 3499,
    address: HOME,
    paymentMethod: "Cash on Delivery",
    items: [{ productId: "p13", quantity: 1, price: 3499, size: "50ml" }],
    timeline: [
      { status: "Order placed", description: "", date: "2026-08-02T13:10:00Z", done: true, location: "Online" },
      { status: "Packed", description: "", done: false },
    ],
  },
  {
    id: "LM-100118",
    date: "2026-07-14",
    status: "cancelled",
    total: 2999,
    address: HOME,
    paymentMethod: "PhonePe wallet",
    items: [{ productId: "p10", quantity: 1, price: 2999, size: "L", color: "Graphite" }],
    timeline: [
      { status: "Order placed", description: "", date: "2026-07-14T05:30:00Z", done: true, location: "Online" },
      { status: "Cancelled", description: "Refunded ₹2,999 to PhonePe wallet", date: "2026-07-14T08:00:00Z", done: true },
    ],
    refund: { amount: 2999, destination: "PhonePe wallet", status: "credited", initiatedOn: "2026-07-14", expectedBy: "2026-07-15", creditedOn: "2026-07-14", reference: "PPW7713920041" },
  },
  {
    id: "LM-100066",
    date: "2026-08-18",
    status: "returned",
    total: 4499,
    address: HOME,
    paymentMethod: "Axis Bank Debit Card •• 7781",
    courier: "Delhivery",
    awb: "DL7719032211IN",
    deliveredOn: "2026-08-21",
    items: [{ productId: "p11", quantity: 1, price: 4499, size: "M", color: "Olive" }],
    timeline: [
      { status: "Order placed", description: "", date: "2026-08-18T06:30:00Z", done: true, location: "Online" },
      { status: "Delivered", description: "", date: "2026-08-21T11:20:00Z", done: true, location: "Whitefield" },
      { status: "Return picked up", description: "Reason: size too small", date: "2026-09-11T07:45:00Z", done: true, location: "Whitefield" },
      { status: "Refund initiated", description: "Quality check passed", date: "2026-09-13T10:00:00Z", done: true, location: "Bhiwandi returns centre" },
    ],
    refund: { amount: 4499, destination: "Axis Bank Debit Card •• 7781", status: "processing", initiatedOn: "2026-09-13", expectedBy: "2026-09-20" },
  },
];
