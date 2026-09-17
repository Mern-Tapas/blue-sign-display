import { COD_FEE, FREE_DELIVERY_THRESHOLD, RETURN_WINDOW_DAYS } from "./india";

export type FaqCategoryId = "orders" | "returns" | "payments" | "delivery" | "account";

export type Faq = { id: string; category: FaqCategoryId; question: string; answer: string; href?: { label: string; url: string } };

export const faqCategories: { id: FaqCategoryId; label: string }[] = [
  { id: "orders", label: "Orders" },
  { id: "delivery", label: "Delivery" },
  { id: "returns", label: "Returns & refunds" },
  { id: "payments", label: "Payments" },
  { id: "account", label: "Account" },
];

/** Demo help-center answers. Figures come from lib/data/india so they match the checkout. */
export const faqs: Faq[] = [
  { id: "track", category: "orders", question: "Where is my order?", answer: "Open Orders to see the live status, courier and tracking number. You also get SMS and WhatsApp updates at every step.", href: { label: "Go to orders", url: "/account/orders" } },
  { id: "cancel", category: "orders", question: "Can I cancel my order?", answer: "Yes, until it is out for delivery. Open the order and choose Cancel order. Prepaid orders are refunded to the original payment method within 5–7 working days." },
  { id: "change-address", category: "orders", question: "Can I change the delivery address after ordering?", answer: "You can change it before the order is shipped, to another address in the same city. After shipping, cancel and reorder instead." },
  { id: "delivery-fee", category: "delivery", question: "How much is delivery?", answer: `Delivery is free on orders of ₹${FREE_DELIVERY_THRESHOLD} and above. Below that a small delivery fee applies, shown in Price details before you pay.` },
  { id: "pincode", category: "delivery", question: "Do you deliver to my PIN code?", answer: "Enter your PIN code on any product page to see the delivery date, whether Cash on Delivery is available and the return window for that item." },
  { id: "express", category: "delivery", question: "What is express delivery?", answer: "Next-day delivery in select metro PIN codes for an extra fee. If it isn't available for your PIN code, the option is hidden at checkout." },
  { id: "return-window", category: "returns", question: "How do returns work?", answer: `Most items can be returned or exchanged within ${RETURN_WINDOW_DAYS} days of delivery. Choose Return or exchange on the order, pick a reason and a pickup slot, and keep the item unused with tags on.` },
  { id: "refund-time", category: "returns", question: "When will I get my refund?", answer: "Refunds start once the pickup passes a quality check, usually within 48 hours. UPI and wallets take 1–2 days; cards and net banking take 5–7 working days." },
  { id: "non-returnable", category: "returns", question: "Which items can't be returned?", answer: "Innerwear, personal care, and items marked Non-returnable on the product page. Damaged or wrong items can always be reported within 48 hours of delivery." },
  { id: "cod", category: "payments", question: "Is Cash on Delivery available?", answer: `Yes, for most PIN codes on orders up to ₹50,000, with a ₹${COD_FEE} handling fee. You can pay the delivery partner by cash or UPI.` },
  { id: "payment-failed", category: "payments", question: "Money was deducted but the order failed", answer: "No action needed. The bank reverses failed payments automatically within 5–7 working days. If it hasn't arrived after that, contact us with the UPI reference number." },
  { id: "emi", category: "payments", question: "Can I pay in EMI?", answer: "Credit card EMI is available from ₹3,000 with most major banks. No-cost EMI offers are shown on the product page when available." },
  { id: "otp", category: "account", question: "I'm not getting the OTP", answer: "Check the number and network signal, and wait for the resend timer. OTPs can be delayed if DND is on; you can also sign in with email and password." },
  { id: "delete", category: "account", question: "How do I delete my account?", answer: "Go to Login & security and choose Delete account. You'll need to finish open orders and returns first, and you can download your data before deleting.", href: { label: "Login & security", url: "/account/security" } },
];

export const supportIssueTypes = [
  { value: "where", label: "Where is my order?" },
  { value: "damaged", label: "Damaged, defective or wrong item" },
  { value: "return", label: "Return, exchange or refund" },
  { value: "payment", label: "Payment or coupon issue" },
  { value: "account", label: "Account or sign-in" },
  { value: "other", label: "Something else" },
];
