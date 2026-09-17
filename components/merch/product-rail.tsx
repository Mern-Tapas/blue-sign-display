import { ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/commerce/product-card";
import { Carousel } from "@/components/ui/carousel";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/data/types";

export type ProductRailProps = {
  title: string;
  muted?: string;
  description?: string;
  products: Product[];
  href?: string;
  linkLabel?: string;
  /** Slide widths; defaults show ~2 cards on phones, 5 on wide screens. */
  slideClassName?: string;
  /** Preload the first N images when the rail is above the fold. */
  preloadCount?: number;
  className?: string;
};

/**
 * Horizontal product row ("Best sellers", "Similar products", "Under ₹999") with a heading,
 * View all link and arrow controls beside it. Server-safe; renders nothing without products.
 */
export function ProductRail({
  title,
  muted,
  description,
  products,
  href,
  linkLabel = "View all",
  slideClassName = "basis-[46%] sm:basis-[31%] lg:basis-[23.5%] xl:basis-[18.8%]",
  preloadCount = 0,
  className,
}: ProductRailProps) {
  if (products.length === 0) return null;
  const label = muted ? `${title} ${muted}` : title;
  return (
    <section aria-label={label} data-slot="product-rail" className={className}>
      <Carousel
        aria-label={label}
        controls="header"
        slideClassName={slideClassName}
        gapClassName="gap-3 sm:gap-4"
        trackClassName="-my-2 py-2 -mx-(--gutter) px-(--gutter) scroll-px-(--gutter) lg:mx-0 lg:px-0 lg:scroll-px-0"
        header={
          <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
            <div>
              <h2 className="text-heading-lg sm:text-display-lg">
                {title}
                {muted && <span className="text-fg-muted"> {muted}</span>}
              </h2>
              {description && <p className="mt-1 max-w-xl text-body text-fg-muted">{description}</p>}
            </div>
            {href && (
              <TextLink href={href} className="group items-center gap-1 text-label">
                {linkLabel}
                <ArrowUpRight aria-hidden className="transition-transform duration-(--dur-fast) group-hover:rotate-45" />
              </TextLink>
            )}
          </div>
        }
      >
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} preload={i < preloadCount} className={cn("h-full")} />
        ))}
      </Carousel>
    </section>
  );
}
