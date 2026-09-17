"use client";

import Link from "next/link";
import { History } from "lucide-react";
import { PriceDisplay } from "@/components/commerce/price-display";
import { ProductImage } from "@/components/commerce/product-image";
import { recentlyViewed, useRecentlyViewed, useTrackRecentlyViewed } from "@/components/providers/recently-viewed-store";
import { Carousel } from "@/components/ui/carousel";
import { TextButton } from "@/components/ui/text-button";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/data/types";

export type RecentlyViewedRailProps = {
  /** Catalogue to resolve stored slugs against (or the products fetched for them). */
  products: Pick<Product, "id" | "slug" | "name" | "brand" | "images" | "price" | "compareAt">[];
  /** Hide the product being viewed. */
  excludeSlug?: string;
  title?: string;
  max?: number;
  className?: string;
};

/**
 * "Recently viewed" from this device's history. Renders nothing on the server, before
 * hydration and when the history is empty, so it never shows a blank shelf.
 */
export function RecentlyViewedRail({ products, excludeSlug, title = "Recently viewed", max = 10, className }: RecentlyViewedRailProps) {
  const slugs = useRecentlyViewed();
  const items = slugs
    .filter((s) => s !== excludeSlug)
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is RecentlyViewedRailProps["products"][number] => Boolean(p))
    .slice(0, max);

  if (items.length === 0) return null;

  return (
    <section aria-label={title} data-slot="recently-viewed" className={cn("animate-fade-in", className)}>
      <Carousel
        aria-label={title}
        controls="header"
        slideClassName="basis-[38%] sm:basis-[24%] lg:basis-[15.5%]"
        gapClassName="gap-3"
        trackClassName="-mx-(--gutter) px-(--gutter) scroll-px-(--gutter) lg:mx-0 lg:px-0 lg:scroll-px-0"
        header={
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 text-heading-lg sm:text-display-lg">
              <History aria-hidden className="size-icon-lg text-fg-muted" />
              {title}
            </h2>
            <TextButton onClick={recentlyViewed.clear}>Clear history</TextButton>
          </div>
        }
      >
        {items.map((p) => (
          <Link key={p.id} href={`/products/${p.slug}`} className="group flex flex-col gap-2 rounded-lg">
            <ProductImage
              src={p.images[0]!}
              alt=""
              sizes="(min-width: 1024px) 15vw, (min-width: 640px) 24vw, 38vw"
              wrapperClassName="aspect-square rounded-lg"
              className="transition-transform duration-(--dur-slow) ease-out motion-safe:group-hover:scale-[1.03]"
            />
            <span className="line-clamp-1 text-label text-fg">{p.name}</span>
            <PriceDisplay amount={p.price} compareAt={p.compareAt} size="sm" showDiscount />
          </Link>
        ))}
      </Carousel>
    </section>
  );
}

/** Drop-in tracker for server-rendered product pages. */
export function TrackRecentlyViewed({ slug }: { slug: string }) {
  useTrackRecentlyViewed(slug);
  return null;
}
