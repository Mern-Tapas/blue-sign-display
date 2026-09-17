import Link from "next/link";
import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { PriceDisplay } from "@/components/commerce/price-display";
import { ProductImage } from "@/components/commerce/product-image";
import { RatingStars } from "@/components/commerce/rating-stars";
import { Card } from "@/components/ui/card";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/data/types";

export type DealOfTheDayProps = {
  product: Product;
  /** The real end of the deal price. After it passes, the timer shows `expiredText`. */
  endsAt: Date | string | number;
  title?: string;
  /** Share of deal stock already sold (0–100). Only pass real inventory data. */
  claimedPercent?: number;
  /** Deal-specific terms, e.g. "Limit 2 per customer". */
  note?: string;
  tone?: "contrast" | "surface";
  preload?: boolean;
  className?: string;
};

/**
 * One product at a time-limited price: countdown, price with MRP, optional claimed bar and
 * add to bag. Server-safe; the timer and button hydrate on their own.
 */
export function DealOfTheDay({
  product,
  endsAt,
  title = "Deal of the day",
  claimedPercent,
  note,
  tone = "contrast",
  preload,
  className,
}: DealOfTheDayProps) {
  const contrast = tone === "contrast";
  const href = `/products/${product.slug}`;
  const claimed = claimedPercent === undefined ? undefined : Math.max(0, Math.min(100, Math.round(claimedPercent)));

  return (
    // Contrast tone scopes the dark theme, so every token inside (price, timer, button) re-resolves
    <Card asChild padding="none" className={cn("grid overflow-hidden md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]", className)}>
      <section aria-label={title} data-slot="deal-of-the-day" data-theme={contrast ? "dark" : undefined}>
        <Link href={href} tabIndex={-1} aria-hidden className="group relative block aspect-square overflow-hidden bg-surface-sunken md:aspect-auto md:min-h-80">
          <ProductImage
            src={product.images[0]!}
            alt=""
            preload={preload}
            sizes="(min-width: 768px) 40vw, 100vw"
            wrapperClassName="absolute inset-0"
            className="transition-transform duration-(--dur-slow) ease-out motion-safe:group-hover:scale-[1.03]"
          />
        </Link>
        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-heading-md">{title}</h2>
            <CountdownTimer endsAt={endsAt} tone="neutral" size="sm" label="Deal ends in" expiredText="This deal has ended" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-caption text-fg-muted">{product.brand}</p>
            <h3 className="text-heading-sm">
              <Link href={href} className="rounded-xs underline-offset-4 hover:underline">
                {product.name}
              </Link>
            </h3>
            <RatingStars value={product.rating} count={product.reviewCount} size="sm" />
          </div>
          <PriceDisplay amount={product.price} compareAt={product.compareAt} size="xl" showDiscount mrpLabel taxNote />
          {claimed !== undefined && (
            <div className="flex flex-col gap-1.5">
              <div
                role="progressbar"
                aria-label="Deal stock claimed"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={claimed}
                className="h-1.5 overflow-hidden rounded-pill bg-surface-sunken"
              >
                <div className="h-full rounded-pill bg-accent" style={{ width: `${claimed}%` }} />
              </div>
              <p className="text-caption text-fg-muted figures">{claimed}% claimed</p>
            </div>
          )}
          <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center">
            <AddToCartButton product={product} size="lg" label="Add to bag" />
            {note && <p className="text-caption text-fg-muted">{note}</p>}
          </div>
        </div>
      </section>
    </Card>
  );
}
