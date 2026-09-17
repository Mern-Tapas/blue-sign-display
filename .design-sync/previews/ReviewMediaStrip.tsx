import { ReviewMediaStrip, sampleData } from "@bluesigns/ui";

const { getProduct, reviews } = sampleData;
// Customer photos across apparel reviews (distinct shots).
const buyers = ["Ananya", "Rohan", "Aisha", "Vikram", "Meera", "Kabir", "Isha"];
const many = ["heavyweight-tee", "fleece-hoodie", "field-jacket"]
  .flatMap((slug) => getProduct(slug)!.images)
  .filter((src, i, all) => all.indexOf(src) === i)
  .map((src, i) => ({ src, caption: `Photo by ${buyers[i % buyers.length]} · ${5 - (i % 2)}★` }));

export const WithOverflow = () => <ReviewMediaStrip items={many} max={3} />;

export const Small = () => <ReviewMediaStrip size="sm" items={reviews[0]!.media!.map((src) => ({ src, caption: "Photo by Ananya Iyer · 5★" }))} aria-label="Photos from Ananya Iyer" />;

export const AllVisible = () => <ReviewMediaStrip items={many} size="sm" />;
