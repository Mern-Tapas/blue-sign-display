import { BadgeCheck } from "lucide-react";
import { PriceDisplay } from "@/components/commerce/price-display";
import { RatingPill } from "@/components/reviews/rating-pill";
import { Badge } from "@/components/ui/badge";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/cn";
import { formatNumber, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/data/types";

export type ProductTitleBlockProps = {
  product: Pick<Product, "name" | "brand" | "rating" | "reviewCount" | "price" | "compareAt" | "badges">;
  brandHref?: string;
  /** Written reviews (subset of ratings). */
  writtenReviews?: number;
  reviewsHref?: string;
  /** Lowest monthly EMI to tease under the price. */
  emiFrom?: number;
  /** EMI plans trigger (EmiOptionsDialog). */
  emiAction?: React.ReactNode;
  /** Fulfilment assurance, e.g. "BlueSigns Assured". */
  assured?: string;
  headingLevel?: "h1" | "h2";
  className?: string;
};

/** Product page top: brand, name, rating pill with counts, price against MRP and an EMI line. Server-safe. */
export function ProductTitleBlock({
  product,
  brandHref,
  writtenReviews,
  reviewsHref = "#reviews",
  emiFrom,
  emiAction,
  assured,
  headingLevel: Heading = "h1",
  className,
}: ProductTitleBlockProps) {
  return (
    <div data-slot="product-title-block" className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-2">
        {brandHref ? (
          <TextLink href={brandHref} className="self-start text-label">
            {product.brand}
          </TextLink>
        ) : (
          <p className="text-label text-accent-fg">{product.brand}</p>
        )}
        <Heading className="text-heading-lg sm:text-display-lg">{product.name}</Heading>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <RatingPill value={product.rating} size="md" />
          <TextLink href={reviewsHref} tone="muted" className="text-label font-normal figures">
            {formatNumber(product.reviewCount)} ratings
            {writtenReviews !== undefined && <> &amp; {formatNumber(writtenReviews)} reviews</>}
          </TextLink>
          {product.badges?.includes("bestseller") && <Badge tone="inverse">Bestseller</Badge>}
          {assured && (
            <span className="inline-flex items-center gap-1 text-label text-accent-fg">
              <BadgeCheck aria-hidden className="size-icon-md" />
              {assured}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {product.compareAt && product.compareAt > product.price && <p className="text-label text-success-fg">Special price</p>}
        <PriceDisplay amount={product.price} compareAt={product.compareAt} size="2xl" showDiscount mrpLabel taxNote />
        {emiFrom !== undefined && (
          <p className="flex flex-wrap items-center gap-x-2 text-body text-fg-muted">
            <span>
              EMI from <span className="font-medium text-fg figures">{formatPrice(emiFrom)}</span>/month
            </span>
            {emiAction}
          </p>
        )}
      </div>
    </div>
  );
}
