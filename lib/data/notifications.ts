import { unsplash } from "./images";
import type { AppNotification } from "./types";

/** Demo notifications for the notification center. */
export const notifications: AppNotification[] = [
  {
    id: "n1",
    type: "order",
    title: "Out for delivery",
    body: "Order LM-100482 arrives today by 9 PM. Keep the delivery OTP handy.",
    date: "2026-09-15T02:15:00Z",
    read: false,
    href: "/account/orders/LM-100482",
    image: unsplash("1505740420928-5e560c06d30e", 120),
  },
  {
    id: "n2",
    type: "price-drop",
    title: "Price dropped on your wishlist",
    body: "Pulse Smart Watch is now ₹15,999 (was ₹19,999).",
    date: "2026-09-14T11:00:00Z",
    read: false,
    href: "/products/pulse-smart-watch",
    image: unsplash("1546868871-7041f2a55e12", 120),
  },
  {
    id: "n3",
    type: "offer",
    title: "Festive sale starts in 2 days",
    body: "Early access for members: extra 10% off with HDFC Bank cards.",
    date: "2026-09-13T04:30:00Z",
    read: true,
    href: "/shop?sale=1",
  },
  {
    id: "n4",
    type: "back-in-stock",
    title: "Back in stock",
    body: "Trail Hiker in size 42 is available again.",
    date: "2026-09-10T07:20:00Z",
    read: true,
    href: "/products/trail-hiker-sneaker",
    image: unsplash("1606107557195-0e29a4b5b4aa", 120),
  },
  {
    id: "n5",
    type: "account",
    title: "New sign-in from Chrome on Windows",
    body: "If this wasn't you, change your password and sign out of other devices.",
    date: "2026-09-08T16:45:00Z",
    read: true,
    href: "/account/security",
  },
  {
    id: "n6",
    type: "order",
    title: "Refund processed",
    body: "₹2,999 refunded to your PhonePe wallet for order LM-100118.",
    date: "2026-07-14T08:00:00Z",
    read: true,
    href: "/account/orders/LM-100118",
  },
];
