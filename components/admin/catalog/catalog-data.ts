/**
 * Server-safe data helpers for the catalog, inventory and reviews screens. Everything is derived
 * deterministically from the demo data (no randomness, no clock), so server and client agree.
 */
import { ADMIN_TODAY, adminProducts, type AdminProduct } from "@/lib/data/admin";
import { brands, categories, getProductById } from "@/lib/data/products";
import { reviews } from "@/lib/data/reviews";

const isoDay = (daysAgo: number) => {
  const d = new Date(ADMIN_TODAY.getFullYear(), ADMIN_TODAY.getMonth(), ADMIN_TODAY.getDate() - daysAgo);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/* ---------------------------------------------------------------- stock */

export type StockState = "out" | "low" | "in";

export function stockState(stock: number, reorderPoint: number): StockState {
  if (stock <= 0) return "out";
  if (stock <= reorderPoint) return "low";
  return "in";
}

export const stockStateMeta: Record<StockState, { label: string; tone: "danger" | "warning" | "success" }> = {
  out: { label: "Out of stock", tone: "danger" },
  low: { label: "Low stock", tone: "warning" },
  in: { label: "In stock", tone: "success" },
};

export type ProductStatus = AdminProduct["status"];

export const productStatusMeta: Record<ProductStatus, { label: string; tone: "success" | "neutral" | "info" }> = {
  active: { label: "Active", tone: "success" },
  draft: { label: "Draft", tone: "info" },
  archived: { label: "Archived", tone: "neutral" },
};

export const categoryNames = categories.map((c) => c.name);
export const brandNames = brands;

/* ---------------------------------------------------------------- inventory */

export type InventoryRow = {
  sku: string;
  productId: string;
  productName: string;
  image: string;
  variant: string;
  category: string;
  onHand: number;
  reorderPoint: number;
  price: number;
  /** Units sold per day for this variant, from the product's last 30 days. */
  dailyRate: number;
};

/** One row per variant. Multi-variant products split the product reorder point across variants. */
export const inventoryRows: InventoryRow[] = adminProducts
  .filter((p) => p.status !== "archived")
  .flatMap((p) =>
    p.variants.map((v) => ({
      sku: v.sku,
      productId: p.id,
      productName: p.name,
      image: p.image,
      variant: v.label,
      category: p.category,
      onHand: v.stock,
      reorderPoint: p.variants.length > 1 ? Math.max(2, Math.ceil(p.reorderPoint / p.variants.length)) : p.reorderPoint,
      price: p.price,
      dailyRate: p.sold30d / 30 / p.variants.length,
    })),
  );

/** Seed entries for the stock adjustment log (demo). */
export const seedAdjustments = [
  { id: "adj-1", actor: "Kabir Singh", action: "received 24 units of Heavyweight Tee (M) from Tiruppur Knits", at: new Date(ADMIN_TODAY.getFullYear(), ADMIN_TODAY.getMonth(), ADMIN_TODAY.getDate(), 9, 12).toISOString(), tone: "success" as const },
  { id: "adj-2", actor: "Priya Nair", action: "wrote off 2 units of Orbit Table Lamp as damaged in transit", at: new Date(ADMIN_TODAY.getFullYear(), ADMIN_TODAY.getMonth(), ADMIN_TODAY.getDate() - 1, 16, 40).toISOString(), tone: "danger" as const },
  { id: "adj-3", actor: "Kabir Singh", action: "corrected Velocity Runner (42) after cycle count, −1 unit", at: new Date(ADMIN_TODAY.getFullYear(), ADMIN_TODAY.getMonth(), ADMIN_TODAY.getDate() - 3, 11, 5).toISOString(), tone: "neutral" as const },
];

/* ---------------------------------------------------------------- product editor */

export type EditorVariant = { id: string; label: string; sku: string; stock: string };
export type EditorImage = { id: string; src: string };

export type EditorDraft = {
  name: string;
  brand: string | null;
  category: string;
  description: string;
  highlights: string[];
  mrp: string;
  price: string;
  cost: string;
  gstRate: "5" | "12" | "18";
  hsn: string;
  variants: EditorVariant[];
  weight: string;
  length: string;
  width: string;
  height: string;
  returnable: boolean;
  returnWindow: string;
  seoTitle: string;
  slug: string;
  metaDescription: string;
  status: ProductStatus;
  images: EditorImage[];
  collections: string[];
  tags: string;
};

export type EditorMeta = {
  id: string | null;
  sku: string;
  sold30d: number;
  updatedAt: string | null;
  storefrontSlug: string | null;
};

export const collectionOptions = ["Bestsellers", "New arrivals", "Sale", "Festive edit", "Gifting", "Under ₹999"];

const shippingDefaults: Record<string, [weight: number, l: number, w: number, h: number]> = {
  audio: [350, 22, 20, 9],
  watches: [180, 12, 10, 8],
  footwear: [900, 33, 22, 12],
  apparel: [400, 30, 25, 4],
  beauty: [250, 12, 8, 6],
  home: [800, 25, 25, 30],
};

export function emptyDraft(): EditorDraft {
  return {
    name: "",
    brand: null,
    category: "",
    description: "",
    highlights: [""],
    mrp: "",
    price: "",
    cost: "",
    gstRate: "18",
    hsn: "",
    variants: [{ id: "v-1", label: "Default", sku: "", stock: "0" }],
    weight: "",
    length: "",
    width: "",
    height: "",
    returnable: true,
    returnWindow: "10",
    seoTitle: "",
    slug: "",
    metaDescription: "",
    status: "draft",
    images: [],
    collections: [],
    tags: "",
  };
}

export function editorProduct(id: string): { draft: EditorDraft; meta: EditorMeta } | null {
  const admin = adminProducts.find((p) => p.id === id);
  const product = getProductById(id);
  if (!admin || !product) return null;
  const [weight, l, w, h] = shippingDefaults[product.category] ?? [500, 20, 20, 10];
  const collections = [
    ...(product.badges?.includes("bestseller") ? ["Bestsellers"] : []),
    ...(product.badges?.includes("new") ? ["New arrivals"] : []),
    ...(product.badges?.includes("sale") ? ["Sale"] : []),
  ];
  return {
    draft: {
      name: admin.name,
      brand: admin.brand,
      category: admin.category,
      description: product.description,
      highlights: product.features.length ? product.features : [""],
      mrp: String(admin.mrp),
      price: String(admin.price),
      cost: String(Math.round((admin.price * 0.52) / 10) * 10),
      gstRate: String(admin.gstRate) as EditorDraft["gstRate"],
      hsn: admin.hsn,
      variants: admin.variants.map((v, i) => ({ id: `v-${i + 1}`, label: v.label, sku: v.sku, stock: String(v.stock) })),
      weight: String(weight),
      length: String(l),
      width: String(w),
      height: String(h),
      returnable: product.category !== "beauty",
      returnWindow: product.category === "beauty" ? "7" : "10",
      seoTitle: `${admin.name} by ${admin.brand} | BlueSigns`,
      slug: admin.slug,
      metaDescription: product.description.slice(0, 155),
      status: admin.status,
      images: product.images.map((src, i) => ({ id: `img-${i + 1}`, src })),
      collections,
      tags: [product.category, admin.brand.toLowerCase()].join(", "),
    },
    meta: { id: admin.id, sku: admin.sku, sold30d: admin.sold30d, updatedAt: admin.updatedAt, storefrontSlug: admin.slug },
  };
}

/* ---------------------------------------------------------------- reviews moderation */

export type ModerationStatus = "pending" | "published" | "hidden";

export type ModerationReview = {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  author: string;
  avatar?: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  media: number;
  demo: boolean;
  status: ModerationStatus;
  /** Why the review needs a closer look (automatic checks). */
  flag?: string;
  hiddenReason?: string;
  reply?: string;
};

type Extra = Omit<ModerationReview, "id" | "productName" | "productImage" | "demo" | "date"> & { daysAgo: number };

/** Illustrative reviews for the rest of the catalogue (demo; each is labelled in the UI). */
const extraReviews: Extra[] = [
  { productId: "p2", author: "Nisha Menon", rating: 4, title: "Detailed sound, a little heavy", body: "Editing podcasts on these is a joy. After two hours the headband starts to press, so I take short breaks.", verified: true, media: 0, status: "published", daysAgo: 12 },
  { productId: "p3", author: "Karan Joshi", rating: 5, title: "Looks far more expensive than it is", body: "Bought it for my father’s 60th. The dial is crisp and the leather strap softened within a week.", verified: true, media: 2, status: "published", daysAgo: 9, reply: "Thank you, Karan! Wishing your father many happy returns." },
  { productId: "p4", author: "Tanvi Kulkarni", rating: 2, title: "Step count is off", body: "It counts steps while I’m riding my scooter. Battery life is fine but the tracking needs a firmware fix.", verified: true, media: 0, status: "pending", daysAgo: 0 },
  { productId: "p5", author: "Arjun Reddy", rating: 4, title: "Runs half a size small", body: "Order one size up if you have wide feet. Cushioning is great for my morning 5K at Cubbon Park.", verified: true, media: 1, status: "published", daysAgo: 16 },
  { productId: "p6", author: "Farhan Ahmed", rating: 1, title: "Sole came off in a month", body: "Very disappointed with the build. Call me on 98450 12345 and I will share the photos.", verified: true, media: 3, status: "pending", daysAgo: 1, flag: "Contains a phone number" },
  { productId: "p7", author: "Meera Pillai", rating: 5, title: "Survived a monsoon trek", body: "Wore these on the Kudremukh trek in heavy rain. Grip on wet rock was excellent and my feet stayed dry.", verified: true, media: 2, status: "published", daysAgo: 21 },
  { productId: "p8", author: "Yash Gupta", rating: 1, title: "Delivery partner was rude", body: "The delivery person refused to come to the third floor and shouted at my mother.", verified: false, media: 0, status: "hidden", daysAgo: 6, hiddenReason: "About delivery, not the product" },
  { productId: "p9", author: "Diya Bose", rating: 5, title: "Heavy cotton that holds its shape", body: "Five washes in and no shrinking or twisted seams. Finally a plain tee worth the price.", verified: true, media: 0, status: "published", daysAgo: 4 },
  { productId: "p10", author: "Rahul Das", rating: 2, title: "Pilling after two washes", body: "Soft at first but it pilled badly under the arms. I washed it cold and inside out, as the label says.", verified: true, media: 1, status: "pending", daysAgo: 0 },
  { productId: "p11", author: "Zoya Khan", rating: 4, title: "Warm enough for Delhi winters", body: "Layered over a sweater it handled 6°C mornings. I wish the pockets were a little deeper.", verified: true, media: 0, status: "published", daysAgo: 30 },
  { productId: "p12", author: "Dev Chatterjee", rating: 5, title: "Watch my full unboxing!!", body: "Link in bio. Use code NOMAD on my page for an extra discount on this backpack.", verified: false, media: 0, status: "hidden", daysAgo: 3, flag: "Looks like advertising", hiddenReason: "Spam or advertising" },
  { productId: "p13", author: "Sneha Rao", rating: 4, title: "Lasts through Mumbai humidity", body: "Still noticeable by evening even in July. The cap feels a bit cheap for the price.", verified: true, media: 0, status: "published", daysAgo: 14 },
  { productId: "p14", author: "Pooja Sharma", rating: 1, title: "Cheaper on another site", body: "The same serum is ₹300 less on another app. Don’t waste your money here.", verified: false, media: 0, status: "pending", daysAgo: 2, flag: "Mentions another store" },
  { productId: "p15", author: "Siddharth Iyer", rating: 5, title: "Warm light, perfect by the bed", body: "Three brightness levels, and the lowest is gentle enough for reading while my partner sleeps.", verified: true, media: 1, status: "published", daysAgo: 8 },
  { productId: "p16", author: "Lakshmi Nair", rating: 3, title: "Late delivery, bottle is fine", body: "The courier took nine days to reach Guwahati. The bottle itself keeps chai hot till lunch.", verified: true, media: 0, status: "published", daysAgo: 11, reply: "Sorry about the wait, Lakshmi. We have moved North-East orders to a faster courier." },
];

export const moderationReviews: ModerationReview[] = [
  ...reviews.map((r) => {
    const p = adminProducts.find((ap) => ap.id === r.productId)!;
    return {
      id: r.id,
      productId: r.productId,
      productName: p.name,
      productImage: p.image,
      author: r.author,
      avatar: r.avatar,
      rating: r.rating,
      title: r.title,
      body: r.body,
      date: r.date,
      verified: r.verified,
      media: r.media?.length ?? 0,
      demo: r.demo ?? true,
      status: "published" as ModerationStatus,
      reply: r.id === "r2" ? "Thanks, Rohan. A slimmer travel pouch is coming with the next batch." : undefined,
    };
  }),
  ...extraReviews.map(({ daysAgo, ...r }, i) => {
    const p = adminProducts.find((ap) => ap.id === r.productId)!;
    return { ...r, id: `rx${i + 1}`, productName: p.name, productImage: p.image, date: isoDay(daysAgo), demo: true };
  }),
].sort((a, b) => b.date.localeCompare(a.date));
