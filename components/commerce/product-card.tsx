import Link from "next/link";
import { Zap } from "lucide-react";
import { RatingPill } from "@/components/reviews/rating-pill";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { Product, ProductBadge } from "@/lib/data/types";
import { AddToCartButton } from "./add-to-cart-button";
import { PriceDisplay } from "./price-display";
import { ProductImage } from "./product-image";
import { RatingStars } from "./rating-stars";
import { WishlistButton } from "./wishlist-button";

// Badges sit on photography, so every tone here must be opaque.
const badgeMap: Record<ProductBadge, { label: string; tone: "sale" | "inverse" | "solid" | "outline" }> = {
  new: { label: "New", tone: "solid" },
  sale: { label: "Sale", tone: "sale" },
  bestseller: { label: "Bestseller", tone: "inverse" },
  limited: { label: "Limited", tone: "outline" },
};

export type ProductCardProps = {
  product: Product;
  layout?: "grid" | "list";
  className?: string;
  /** Preload the image — use for above-the-fold cards. */
  preload?: boolean;
  /** "4.3 ★ | 1.2K" pill (default) or the star row. */
  ratingStyle?: "pill" | "stars";
  /** Extra controls over the image, e.g. a QuickView trigger (appears with Quick add). */
  imageActions?: React.ReactNode;
  /** Row under the price, e.g. an add-to-compare toggle. */
  footer?: React.ReactNode;
};

function ColorDots({ product }: { product: Product }) {
  if (!product.colors?.length) return null;
  return (
    <div className="flex items-center gap-1" aria-label={`${product.colors.length} colors`}>
      {product.colors.slice(0, 4).map((c) => (
        <span
          key={c.name}
          title={c.name}
          className="size-3 rounded-pill ring-1 ring-border-strong ring-offset-1 ring-offset-surface"
          style={{ background: c.value }}
        />
      ))}
    </div>
  );
}

function StockNote({ stock }: { stock: number }) {
  if (stock === 0) return <span className="text-caption whitespace-nowrap text-fg-muted">Sold out</span>;
  if (stock <= 5) return <span className="text-caption whitespace-nowrap text-warning-fg">Only {stock} left</span>;
  return null;
}

function Rating({ product, style }: { product: Product; style: "pill" | "stars" }) {
  return style === "pill" ? (
    <RatingPill value={product.rating} count={product.reviewCount} />
  ) : (
    <RatingStars value={product.rating} count={product.reviewCount} size="sm" />
  );
}

function DeliveryNote({ days }: { days?: number }) {
  if (days !== 1) return null;
  return (
    <span className="flex items-center gap-1 text-caption text-fg-muted">
      <Zap aria-hidden className="size-icon-sm text-accent-fg" />
      Get it by tomorrow
    </span>
  );
}

/** Paid placements are always labelled. */
function Sponsored() {
  return <span className="text-caption text-fg-muted">Sponsored</span>;
}

export function ProductCard({ product, layout = "grid", className, preload, ratingStyle = "pill", imageActions, footer }: ProductCardProps) {
  const href = `/products/${product.slug}`;
  const soldOut = product.stock === 0;

  if (layout === "list") {
    return (
      <Card asChild interactive padding="none" className={cn("group flex-row gap-4 p-3 sm:gap-6", className)}>
      <article data-slot="product-card">
        <div className="relative w-32 shrink-0 sm:w-48">
          <ProductImage
            src={product.images[0]!}
            alt={product.name}
            sizes="(min-width: 640px) 192px, 128px"
            wrapperClassName={cn("aspect-square rounded-xl", soldOut && "opacity-60")}
            className="transition-transform duration-(--dur-slow) motion-safe:group-hover:scale-[1.03]"
            preload={preload}
          />
          {product.badges?.[0] && (
            <Badge size="sm" tone={badgeMap[product.badges[0]].tone} className="absolute top-2 left-2">
              {badgeMap[product.badges[0]].label}
            </Badge>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2 py-1 pr-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {product.sponsored && <Sponsored />}
              <p className="text-caption text-fg-muted">{product.brand}</p>
              <h3 className="text-body-lg font-medium">
                <Link href={href} className="focus-ring-card after:absolute after:inset-0 after:rounded-2xl">
                  {product.name}
                </Link>
              </h3>
            </div>
            <WishlistButton productName={product.name} slug={product.slug} price={product.price} variant="secondary" size="sm" className="relative z-10" />
          </div>
          <Rating product={product} style={ratingStyle} />
          <p className="line-clamp-2 hidden text-body text-fg-muted sm:block">{product.description}</p>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <PriceDisplay amount={product.price} compareAt={product.compareAt} size="lg" showDiscount />
              <div className="flex flex-wrap items-center gap-3">
                <ColorDots product={product} />
                <StockNote stock={product.stock} />
                <DeliveryNote days={product.deliveryDays} />
              </div>
              {footer && <div className="relative z-10">{footer}</div>}
            </div>
            <div className="relative z-10 flex items-center gap-2">
              {imageActions}
              <AddToCartButton product={product} size="sm" openDrawer={false} />
            </div>
          </div>
        </div>
      </article>
      </Card>
    );
  }

  return (
    <Card asChild interactive padding="none" className={cn("group gap-3 p-2.5", className)}>
    <article data-slot="product-card">
      <div className="relative">
        <ProductImage
          src={product.images[0]!}
          alt={product.name}
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw"
          wrapperClassName={cn("aspect-[4/5] rounded-lg", soldOut && "opacity-60")}
          className="transition-transform duration-(--dur-slow) ease-out motion-safe:group-hover:scale-[1.03]"
          preload={preload}
        />
        {product.images[1] && (
          <ProductImage
            src={product.images[1]}
            alt=""
            aria-hidden
            sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw"
            wrapperClassName="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-(--dur-slow) group-hover:opacity-100 pointer-coarse:hidden"
          />
        )}
        {product.badges?.length ? (
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
            {product.badges.slice(0, 2).map((b, i) => (
              <Badge key={b} size="sm" tone={badgeMap[b].tone} className={cn(i > 0 && "max-sm:hidden")}>
                {badgeMap[b].label}
              </Badge>
            ))}
          </div>
        ) : null}
        <WishlistButton productName={product.name} slug={product.slug} price={product.price} size="sm" className="absolute top-2.5 right-2.5 z-10" />
        <div className="absolute inset-x-2.5 bottom-2.5 z-10 flex justify-center gap-2 transition-[opacity,translate] duration-(--dur-base) ease-out pointer-fine:translate-y-2 pointer-fine:opacity-0 pointer-fine:group-focus-within:translate-y-0 pointer-fine:group-focus-within:opacity-100 pointer-fine:group-hover:translate-y-0 pointer-fine:group-hover:opacity-100">
          <AddToCartButton product={product} appearance="compact" openDrawer={false} className="shadow-popover" />
          {imageActions}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-1.5 pb-1.5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-caption text-fg-muted">
            {product.sponsored && (
              <>
                <Sponsored /> ·{" "}
              </>
            )}
            {product.brand}
          </p>
          <ColorDots product={product} />
        </div>
        <h3 className="line-clamp-1 text-body-strong">
          <Link href={href} className="focus-ring-card after:absolute after:inset-0 after:rounded-2xl">
            {product.name}
          </Link>
        </h3>
        <Rating product={product} style={ratingStyle} />
        <PriceDisplay amount={product.price} compareAt={product.compareAt} showDiscount className="mt-1 gap-x-1.5" />
        {(product.stock <= 5 || product.deliveryDays === 1) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
            <StockNote stock={product.stock} />
            <DeliveryNote days={product.deliveryDays} />
          </div>
        )}
        {footer && <div className="relative z-10 mt-1">{footer}</div>}
      </div>
    </article>
    </Card>
  );
}

export function ProductCardSkeleton({ layout = "grid" }: { layout?: "grid" | "list" }) {
  return (
    <Card aria-hidden padding="none" className={cn("p-2.5", layout === "list" && "flex-row gap-4")}>
      <div className={cn("shimmer animate-shimmer rounded-xl", layout === "grid" ? "aspect-[4/5]" : "aspect-square w-32 sm:w-48")} />
      <div className={cn("flex flex-col gap-2 p-1.5", layout === "list" && "flex-1")}>
        <div className="shimmer h-3 w-1/3 animate-shimmer rounded-pill" />
        <div className="shimmer h-4 w-3/4 animate-shimmer rounded-pill" />
        <div className="shimmer h-4 w-1/4 animate-shimmer rounded-pill" />
      </div>
    </Card>
  );
}
