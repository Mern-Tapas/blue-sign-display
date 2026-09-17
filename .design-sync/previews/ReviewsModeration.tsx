import { ReviewsModeration, sampleData } from "@bluesigns/ui";

const product = (id: string) => sampleData.adminProducts.find((p) => p.id === id) ?? sampleData.adminProducts[0]!;

type Status = "pending" | "published" | "hidden";

const queued = (
  id: string,
  productId: string,
  author: string,
  rating: number,
  title: string,
  body: string,
  date: string,
  status: Status,
  extra: { verified?: boolean; media?: number; flag?: string; hiddenReason?: string; reply?: string } = {},
) => ({
  id,
  productId,
  productName: product(productId).name,
  productImage: product(productId).image,
  author,
  rating,
  title,
  body,
  date,
  status,
  demo: true,
  verified: extra.verified ?? true,
  media: extra.media ?? 0,
  flag: extra.flag,
  hiddenReason: extra.hiddenReason,
  reply: extra.reply,
});

/** Storefront reviews (published) plus a moderation queue, shaped like the /admin/reviews page data. */
const reviews = [
  ...sampleData.reviews.map((r) => ({
    id: r.id,
    productId: r.productId,
    productName: product(r.productId).name,
    productImage: product(r.productId).image,
    author: r.author,
    avatar: r.avatar,
    rating: r.rating,
    title: r.title,
    body: r.body,
    date: r.date,
    verified: r.verified,
    media: r.media?.length ?? 0,
    demo: r.demo ?? true,
    status: "published" as Status,
  })),
  queued("rx3", "p4", "Tanvi Kulkarni", 2, "Step count is off", "It counts steps while I’m riding my scooter. Battery life is fine but the tracking needs a firmware fix.", "2026-09-15", "pending"),
  queued("rx5", "p6", "Farhan Ahmed", 1, "Sole came off in a month", "Very disappointed with the build. Call me on 98450 12345 and I will share the photos.", "2026-09-14", "pending", { media: 3, flag: "Contains a phone number" }),
  queued("rx9", "p10", "Rahul Das", 2, "Pilling after two washes", "Soft at first but it pilled badly under the arms. I washed it cold and inside out, as the label says.", "2026-09-15", "pending", { media: 1 }),
  queued("rx13", "p14", "Pooja Sharma", 1, "Cheaper on another site", "The same serum is ₹300 less on another app. Don’t waste your money here.", "2026-09-13", "pending", { verified: false, flag: "Mentions another store" }),
  queued("rx7", "p8", "Yash Gupta", 1, "Delivery partner was rude", "The delivery person refused to come to the third floor and shouted at my mother.", "2026-09-09", "hidden", { verified: false, hiddenReason: "About delivery, not the product" }),
  queued("rx16", "p16", "Lakshmi Nair", 3, "Late delivery, bottle is fine", "The courier took nine days to reach Guwahati. The bottle itself keeps chai hot till lunch.", "2026-09-04", "published", { reply: "Sorry about the wait, Lakshmi. We have moved North-East orders to a faster courier." }),
].sort((a, b) => b.date.localeCompare(a.date));

export const Queue = () => (
  <div style={{ width: 1200 }}>
    <ReviewsModeration initialReviews={reviews} />
  </div>
);

export const EmptyQueue = () => (
  <div style={{ width: 1200 }}>
    <ReviewsModeration initialReviews={reviews.filter((r) => r.status !== "pending")} />
  </div>
);
