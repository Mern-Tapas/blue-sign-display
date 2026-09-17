"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/components/providers/wishlist-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { ShareButton } from "@/components/ui/share-button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/format";
import { useHydrated } from "@/lib/use-hydrated";
import type { Product } from "@/lib/data/types";
import { WishlistItemCard } from "./wishlist-item-card";

export type WishlistGridProps = {
  /** Catalogue used to resolve saved slugs. */
  products: Product[];
  title?: string;
  shopHref?: string;
  shareUrl?: string;
};

type Sort = "recent" | "price-drop" | "price-asc" | "in-stock";

/**
 * The wishlist page body: count, sort, share, the saved cards, and a helpful empty state.
 * Shows skeletons until the device's list has loaded, so nothing flashes "empty" first.
 */
export function WishlistGrid({ products, title = "Wishlist", shopHref = "/shop", shareUrl }: WishlistGridProps) {
  const hydrated = useHydrated();
  const entries = useWishlist();
  const [sort, setSort] = useState<Sort>("recent");

  const items = entries
    .map((e) => ({ entry: e, product: products.find((p) => p.slug === e.slug) }))
    .filter((x): x is { entry: (typeof entries)[number]; product: Product } => Boolean(x.product));

  const sorted = [...items];
  if (sort === "price-drop") sorted.sort((a, b) => (b.entry.savedPrice ?? b.product.price) - b.product.price - ((a.entry.savedPrice ?? a.product.price) - a.product.price));
  if (sort === "price-asc") sorted.sort((a, b) => a.product.price - b.product.price);
  if (sort === "in-stock") sorted.sort((a, b) => Number(b.product.stock > 0) - Number(a.product.stock > 0));

  return (
    <section data-slot="wishlist-grid" aria-labelledby="wishlist-title" className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 id="wishlist-title" className="text-display-lg">
          {title}{" "}
          <span className="text-fg-muted figures" aria-live="polite">
            {hydrated ? `${formatNumber(items.length)} ${items.length === 1 ? "item" : "items"}` : ""}
          </span>
        </h1>
        {hydrated && items.length > 0 && (
          <div className="flex items-center gap-2">
            <Select
              aria-label="Sort wishlist"
              prefix="Sort:"
              size="sm"
              variant="sunken"
              value={sort}
              onValueChange={(v) => setSort(v as Sort)}
              className="w-auto min-w-52"
              options={[
                { value: "recent", label: "Recently added" },
                { value: "price-drop", label: "Biggest price drop" },
                { value: "price-asc", label: "Price: low to high" },
                { value: "in-stock", label: "In stock first" },
              ]}
            />
            <ShareButton title="My BlueSigns wishlist" url={shareUrl} size="sm" />
          </div>
        )}
      </div>

      {!hydrated ? (
        <div aria-hidden className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="aspect-[3/5] rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card variant="outline" padding="none">
          <EmptyState
            icon={<Heart aria-hidden />}
            title="Your wishlist is empty"
            description="Tap the heart on any product to save it here. We’ll show price drops since you saved it."
            action={
              <Button asChild>
                <Link href={shopHref}>Explore products</Link>
              </Button>
            }
          />
        </Card>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {sorted.map(({ entry, product }) => (
            <li key={entry.slug} className="animate-fade-in">
              <WishlistItemCard product={product} savedPrice={entry.savedPrice} className="h-full" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
