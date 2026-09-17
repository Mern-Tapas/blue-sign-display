export type ProductColor = { name: string; value: string };

export type ProductBadge = "new" | "sale" | "bestseller" | "limited";

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  /** Selling price in INR (inclusive of all taxes). */
  price: number;
  /** MRP in INR — shown struck through when higher than `price`. */
  compareAt?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  colors?: ProductColor[];
  sizes?: string[];
  badges?: ProductBadge[];
  stock: number;
  description: string;
  features: string[];
  /** Days to deliver to a typical metro PIN (demo; real value comes from the PIN lookup). */
  deliveryDays?: number;
  /** Paid placement — must be labelled "Sponsored" wherever it is shown. */
  sponsored?: boolean;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  image: string;
  subcategories: string[];
};

export type Review = {
  id: string;
  productId: string;
  author: string;
  avatar?: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
  /** Customer photos. */
  media?: string[];
  /** Illustrative content — must be labelled in UI (PRODUCT.md: honest proof only). */
  demo?: boolean;
};

export type OrderStatus = "processing" | "shipped" | "out-for-delivery" | "delivered" | "cancelled" | "returned";

export type OrderEvent = {
  status: string;
  description: string;
  date?: string;
  done: boolean;
  /** Scan location, e.g. "Bengaluru hub". */
  location?: string;
};

export type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: { productId: string; quantity: number; price: number; size?: string; color?: string }[];
  timeline: OrderEvent[];
  address: string;
  paymentMethod?: string;
  courier?: string;
  /** Air waybill / tracking number. */
  awb?: string;
  deliveredOn?: string;
  expectedBy?: string;
  refund?: Refund;
};

export type RefundStatus = "initiated" | "processing" | "credited";

export type Refund = {
  amount: number;
  /** Where the money goes: "HDFC Bank Credit Card •• 4242", "Bank account •• 7781". */
  destination: string;
  status: RefundStatus;
  initiatedOn: string;
  expectedBy: string;
  creditedOn?: string;
  /** Bank reference (RRN / ARN) once issued. */
  reference?: string;
};

export type AddressType = "home" | "work" | "other";

export type Address = {
  id: string;
  name: string;
  mobile: string;
  pincode: string;
  house: string;
  locality: string;
  landmark?: string;
  city: string;
  state: string;
  type: AddressType;
  isDefault?: boolean;
};

export type PincodeInfo = {
  pincode: string;
  city: string;
  state: string;
  /** Business days to deliver. */
  etaDays: number;
  cod: boolean;
  serviceable: boolean;
};

export type Coupon = {
  code: string;
  title: string;
  description: string;
  /** Flat discount in INR or percentage off. */
  discount: { type: "flat"; amount: number } | { type: "percent"; percent: number; maxAmount: number };
  minOrder: number;
  expiresOn: string;
  terms?: string[];
};

export type BankOffer = {
  id: string;
  bank: string;
  title: string;
  detail: string;
  kind: "bank" | "emi" | "upi" | "wallet" | "partner";
  terms: string[];
};

export type Bank = { id: string; name: string; short: string; popular?: boolean };

export type Wallet = { id: string; name: string; balance?: number; linked?: boolean };

export type UpiApp = { id: string; name: string };

export type EmiPlan = { months: number; interestRate: number; noCost?: boolean };

export type NotificationType = "order" | "offer" | "account" | "price-drop" | "back-in-stock";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  date: string;
  read: boolean;
  href?: string;
  image?: string;
};

export type SavedCard = {
  id: string;
  brand: "visa" | "mastercard" | "rupay" | "amex";
  last4: string;
  expiry: string;
  bank: string;
  nickname?: string;
};

export type ProductQuestion = {
  id: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  date: string;
  helpful: number;
};

export type Seller = { name: string; rating: number; since: string; returnDays: number; fulfilledBy?: string };
