import type { Address, Bank, BankOffer, Coupon, EmiPlan, PincodeInfo, ProductQuestion, SavedCard, Seller, UpiApp, Wallet } from "./types";

/** All data in this file is illustrative demo content for the India storefront. */

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
] as const;

/** Commerce rules (demo). */
export const FREE_DELIVERY_THRESHOLD = 499;
export const DELIVERY_FEE = 49;
export const PLATFORM_FEE = 9;
export const COD_FEE = 19;
export const EXPRESS_FEE = 99;
export const RETURN_WINDOW_DAYS = 14;
export const GIFT_WRAP_FEE = 49;

export const pincodes: PincodeInfo[] = [
  { pincode: "560066", city: "Bengaluru", state: "Karnataka", etaDays: 2, cod: true, serviceable: true },
  { pincode: "560001", city: "Bengaluru", state: "Karnataka", etaDays: 2, cod: true, serviceable: true },
  { pincode: "400001", city: "Mumbai", state: "Maharashtra", etaDays: 3, cod: true, serviceable: true },
  { pincode: "110001", city: "New Delhi", state: "Delhi", etaDays: 3, cod: true, serviceable: true },
  { pincode: "600001", city: "Chennai", state: "Tamil Nadu", etaDays: 3, cod: false, serviceable: true },
  { pincode: "700001", city: "Kolkata", state: "West Bengal", etaDays: 4, cod: true, serviceable: true },
  { pincode: "500001", city: "Hyderabad", state: "Telangana", etaDays: 3, cod: true, serviceable: true },
  { pincode: "744101", city: "Port Blair", state: "Andaman and Nicobar Islands", etaDays: 9, cod: false, serviceable: false },
];

export function lookupPincode(pin: string): PincodeInfo | undefined {
  return pincodes.find((p) => p.pincode === pin);
}

export const addresses: Address[] = [
  {
    id: "addr-home",
    name: "Sujon Ahmed",
    mobile: "9876543210",
    pincode: "560066",
    house: "Flat 402, Prestige Lakeside",
    locality: "Varthur Road, Whitefield",
    landmark: "Near Phoenix Marketcity",
    city: "Bengaluru",
    state: "Karnataka",
    type: "home",
    isDefault: true,
  },
  {
    id: "addr-work",
    name: "Sujon Ahmed",
    mobile: "9876543210",
    pincode: "560001",
    house: "4th Floor, Embassy Golf Links",
    locality: "Intermediate Ring Road, Domlur",
    city: "Bengaluru",
    state: "Karnataka",
    type: "work",
  },
];

export const coupons: Coupon[] = [
  {
    code: "BLUESIGNS20",
    title: "20% off on your order",
    description: "Up to ₹1,500 off on orders above ₹2,999",
    discount: { type: "percent", percent: 20, maxAmount: 1500 },
    minOrder: 2999,
    expiresOn: "2026-10-31",
    terms: ["Valid once per account", "Not valid on gift cards"],
  },
  {
    code: "FIRST500",
    title: "Flat ₹500 off",
    description: "On your first order above ₹1,999",
    discount: { type: "flat", amount: 500 },
    minOrder: 1999,
    expiresOn: "2026-12-31",
    terms: ["New customers only"],
  },
  {
    code: "AUDIO10",
    title: "10% off audio",
    description: "Up to ₹800 off on headphones and speakers",
    discount: { type: "percent", percent: 10, maxAmount: 800 },
    minOrder: 4999,
    expiresOn: "2026-09-30",
  },
  {
    code: "FESTIVE250",
    title: "Flat ₹250 off",
    description: "On orders above ₹999",
    discount: { type: "flat", amount: 250 },
    minOrder: 999,
    expiresOn: "2026-08-31",
  },
];

export function couponSavings(coupon: Coupon, subtotal: number) {
  if (subtotal < coupon.minOrder) return 0;
  return coupon.discount.type === "flat"
    ? coupon.discount.amount
    : Math.min(Math.floor((subtotal * coupon.discount.percent) / 100), coupon.discount.maxAmount);
}

export const bankOffers: BankOffer[] = [
  {
    id: "o1",
    bank: "HDFC Bank",
    kind: "bank",
    title: "10% instant discount on HDFC Bank credit cards",
    detail: "Up to ₹1,250 on orders of ₹5,000 and above",
    terms: ["Valid on credit card EMI and full swipe", "Once per card per month"],
  },
  {
    id: "o2",
    bank: "ICICI Bank",
    kind: "emi",
    title: "No-cost EMI on ICICI Bank credit cards",
    detail: "3 and 6 month plans on orders above ₹3,000",
    terms: ["Interest refunded as instant discount"],
  },
  {
    id: "o3",
    bank: "UPI",
    kind: "upi",
    title: "Flat ₹50 cashback on UPI payments",
    detail: "On orders above ₹999 paid via any UPI app",
    terms: ["Cashback credited within 48 hours"],
  },
  {
    id: "o4",
    bank: "Axis Bank",
    kind: "partner",
    title: "5% unlimited cashback with BlueSigns Axis Bank card",
    detail: "Credited as statement cashback",
    terms: ["Card issued subject to eligibility"],
  },
];

export const banks: Bank[] = [
  { id: "hdfc", name: "HDFC Bank", short: "HDFC", popular: true },
  { id: "icici", name: "ICICI Bank", short: "ICICI", popular: true },
  { id: "sbi", name: "State Bank of India", short: "SBI", popular: true },
  { id: "axis", name: "Axis Bank", short: "Axis", popular: true },
  { id: "kotak", name: "Kotak Mahindra Bank", short: "Kotak", popular: true },
  { id: "yes", name: "Yes Bank", short: "Yes" },
  { id: "bob", name: "Bank of Baroda", short: "BoB" },
  { id: "pnb", name: "Punjab National Bank", short: "PNB" },
  { id: "idfc", name: "IDFC FIRST Bank", short: "IDFC" },
  { id: "indusind", name: "IndusInd Bank", short: "IndusInd" },
  { id: "canara", name: "Canara Bank", short: "Canara" },
  { id: "union", name: "Union Bank of India", short: "Union" },
];

export const upiApps: UpiApp[] = [
  { id: "gpay", name: "Google Pay" },
  { id: "phonepe", name: "PhonePe" },
  { id: "paytm", name: "Paytm" },
  { id: "bhim", name: "BHIM" },
];

export const wallets: Wallet[] = [
  { id: "paytm", name: "Paytm Wallet", balance: 1240, linked: true },
  { id: "phonepe", name: "PhonePe Wallet" },
  { id: "amazonpay", name: "Amazon Pay Balance" },
  { id: "mobikwik", name: "MobiKwik" },
];

export const emiPlans: Record<string, EmiPlan[]> = {
  hdfc: [
    { months: 3, interestRate: 0, noCost: true },
    { months: 6, interestRate: 0, noCost: true },
    { months: 9, interestRate: 15 },
    { months: 12, interestRate: 15 },
  ],
  icici: [
    { months: 3, interestRate: 0, noCost: true },
    { months: 6, interestRate: 14 },
    { months: 12, interestRate: 14 },
  ],
  axis: [
    { months: 3, interestRate: 14 },
    { months: 6, interestRate: 14 },
    { months: 12, interestRate: 15 },
  ],
};

/** Monthly instalment for an amount at an annual interest rate (reducing balance). */
export function emiAmount(amount: number, months: number, annualRate: number) {
  if (annualRate === 0) return Math.ceil(amount / months);
  const r = annualRate / 12 / 100;
  return Math.ceil((amount * r * (1 + r) ** months) / ((1 + r) ** months - 1));
}

export const savedCards: SavedCard[] = [
  { id: "card-1", brand: "visa", last4: "4242", expiry: "09/29", bank: "HDFC Bank", nickname: "Personal" },
  { id: "card-2", brand: "rupay", last4: "8210", expiry: "02/28", bank: "State Bank of India" },
];

export const savedUpiIds = ["sujon@okaxis", "9876543210@ybl"];

export const sellers: Record<string, Seller> = {
  default: { name: "BlueSigns Retail Pvt. Ltd.", rating: 4.6, since: "2021", returnDays: RETURN_WINDOW_DAYS, fulfilledBy: "BlueSigns Assured" },
};

export const productQuestions: ProductQuestion[] = [
  {
    id: "q1",
    question: "Does it support calls on two devices at the same time?",
    answer: "Yes — multipoint lets you stay connected to a laptop and a phone and switches automatically when a call comes in.",
    answeredBy: "BlueSigns support",
    date: "2026-08-12",
    helpful: 32,
  },
  {
    id: "q2",
    question: "Is there a warranty in India?",
    answer: "One year manufacturer warranty, serviced at authorised centres across India.",
    answeredBy: "Verified buyer",
    date: "2026-07-30",
    helpful: 18,
  },
  { id: "q3", question: "Can I use it while it's charging?", date: "2026-09-02", helpful: 3 },
];

export const trendingSearches = ["Noise cancelling headphones", "Running shoes", "Oversized tees", "Smart watch", "Perfume gift set", "Hoodies"];

export const sizeChart = {
  apparel: {
    columns: ["Size", "Chest", "Length", "Shoulder"],
    rows: [
      ["XS", 36, 26, 16.5],
      ["S", 38, 27, 17],
      ["M", 40, 28, 17.5],
      ["L", 42, 29, 18],
      ["XL", 44, 30, 18.5],
      ["XXL", 46, 31, 19],
    ],
  },
  footwear: {
    columns: ["EU", "UK / IND", "US", "Foot length"],
    rows: [
      ["38", "5", "6", 24.1],
      ["39", "6", "7", 24.8],
      ["40", "6.5", "7.5", 25.4],
      ["41", "7", "8", 26],
      ["42", "8", "9", 26.7],
      ["43", "9", "10", 27.3],
      ["44", "9.5", "10.5", 27.9],
      ["45", "10.5", "11.5", 28.6],
    ],
  },
} as const;
