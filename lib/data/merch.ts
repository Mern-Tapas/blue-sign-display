/* Demo merchandising content for the home page and docs. Campaigns, deals and brand offers are
   illustrative: dates are fixed so countdowns stay truthful (they end, then say so). */

import type { BrandTileData } from "@/components/merch/brand-grid";
import type { CategoryTileData } from "@/components/merch/category-grid";
import type { HeroSlide } from "@/components/merch/hero-carousel";
import { categories, products } from "./products";

const bySlug = (slug: string) => products.find((p) => p.slug === slug)!;

export const heroSlides: HeroSlide[] = [
  {
    id: "everyday",
    title: "Everyday goods,",
    muted: "quietly considered.",
    description: "Headphones, sneakers and basics designed to be used daily and kept for years.",
    image: bySlug("aura-wireless-headphones").images[0]!,
    href: "/shop",
    cta: "Shop the collection",
    secondary: { href: "/shop?sort=newest", label: "New arrivals" },
  },
  {
    id: "run",
    title: "Built for the",
    muted: "morning run.",
    description: "Lightweight runners with cushioning that lasts past the first 500 km.",
    image: bySlug("velocity-runner-red").images[0]!,
    href: "/shop?category=footwear",
    cta: "Shop footwear",
    align: "end",
  },
  {
    id: "home",
    title: "Light the room,",
    muted: "not the bill.",
    description: "Warm LED lamps and everyday drinkware for small spaces.",
    image: bySlug("orbit-table-lamp").images[0]!,
    href: "/shop?category=home",
    cta: "Shop home",
  },
];

const captions: Record<string, string> = {
  audio: "Noise cancelling from ₹5,499",
  watches: "Smart and analog",
  footwear: "Runners and court shoes",
  apparel: "Tees from ₹849",
  beauty: "Fragrance and skincare",
  home: "Lamps and drinkware",
};

export const categoryTiles: CategoryTileData[] = categories.map((c) => ({
  href: `/shop?category=${c.slug}`,
  name: c.name,
  image: c.image,
  caption: captions[c.slug],
}));

export const brandTiles: BrandTileData[] = [
  { name: "Sonora", slug: "aura-wireless-headphones", offer: "Up to 23% off" },
  { name: "Hale & Co", slug: "meridian-classic-watch", offer: "New season" },
  { name: "Stride", slug: "velocity-runner-red", offer: "Up to 25% off" },
  { name: "Common Thread", slug: "heavyweight-tee", offer: "Tees from ₹849" },
  { name: "Maison Lune", slug: "no-5-eau-de-parfum" },
  { name: "Form Studio", slug: "orbit-table-lamp", offer: "Under ₹5,000" },
].map(({ name, slug, offer }) => ({
  name,
  href: `/shop?q=${encodeURIComponent(name)}`,
  image: bySlug(slug).images[0]!,
  offer,
}));

export const featuredDeal = {
  product: bySlug("aura-wireless-headphones"),
  /** Demo campaign end (IST). */
  endsAt: "2026-12-31T23:59:59+05:30",
  note: "Limit 2 per order · demo deal",
};
