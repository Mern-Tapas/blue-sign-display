import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductImage } from "@/components/commerce/product-image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type CategoryTileData = {
  href: string;
  name: string;
  image: string;
  /** Offer or range line: "Min. 30% off", "Under ₹999". Must be true for the linked listing. */
  caption?: string;
};

export type CategoryTileProps = CategoryTileData & {
  /** card — image square + name row; overlay — name over the photo (bento, banners). */
  variant?: "card" | "overlay";
  sizes?: string;
  preload?: boolean;
  className?: string;
};

/** Link tile for a category. Server-safe. */
export function CategoryTile({ href, name, image, caption, variant = "card", sizes = "(min-width: 1024px) 16vw, 45vw", preload, className }: CategoryTileProps) {
  if (variant === "overlay") {
    return (
      <Link
        href={href}
        data-slot="category-tile"
        className={cn("group relative flex min-h-48 flex-col justify-end overflow-hidden rounded-2xl bg-surface-contrast p-4 text-white shadow-card sm:p-5", className)}
      >
        <ProductImage
          src={image}
          alt=""
          sizes={sizes}
          preload={preload}
          wrapperClassName="absolute inset-0 bg-surface-contrast"
          className="transition-transform duration-(--dur-slow) ease-out motion-safe:group-hover:scale-[1.04]"
        />
        <span aria-hidden className="absolute inset-0 bg-linear-to-t from-scrim via-scrim/40 to-transparent" />
        <span className="relative flex items-end justify-between gap-3">
          <span className="flex flex-col">
            <span className="text-heading-sm">{name}</span>
            {caption && <span className="text-body text-fg-on-accent-muted">{caption}</span>}
          </span>
          <span aria-hidden className="flex size-control-sm shrink-0 items-center justify-center rounded-pill bg-white text-black transition-transform duration-(--dur-fast) group-hover:rotate-45">
            <ArrowUpRight className="size-icon-md" />
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Card asChild interactive padding="none" className={cn("group gap-3 p-2.5", className)}>
      <Link href={href} data-slot="category-tile">
        <ProductImage
          src={image}
          alt=""
          sizes={sizes}
          preload={preload}
          wrapperClassName="aspect-square rounded-lg"
          className="transition-transform duration-(--dur-slow) ease-out motion-safe:group-hover:scale-[1.03]"
        />
        <span className="flex items-center justify-between gap-2 px-1.5 pb-1">
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-body-strong">{name}</span>
            {caption && <span className="truncate text-caption text-success-fg">{caption}</span>}
          </span>
          <span
            aria-hidden
            className="flex size-7 shrink-0 items-center justify-center rounded-pill bg-surface-sunken transition-colors duration-(--dur-fast) group-hover:bg-accent group-hover:text-fg-on-accent"
          >
            <ArrowUpRight className="size-icon-sm" />
          </span>
        </span>
      </Link>
    </Card>
  );
}

export type CategoryGridProps = {
  items: CategoryTileData[];
  variant?: CategoryTileProps["variant"];
  /** Swipeable row below lg, grid from lg. */
  scrollOnMobile?: boolean;
  columns?: 3 | 4 | 6;
  "aria-label"?: string;
  className?: string;
};

const cols = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 6: "lg:grid-cols-6" } as const;

/** Category tiles as a grid (or a phone rail that becomes a grid on desktop). */
export function CategoryGrid({ items, variant = "card", scrollOnMobile = true, columns = 6, "aria-label": ariaLabel = "Categories", className }: CategoryGridProps) {
  return (
    <ul
      aria-label={ariaLabel}
      data-slot="category-grid"
      className={cn(
        scrollOnMobile
          ? "scrollbar-none -mx-(--gutter) flex snap-x gap-4 overflow-x-auto px-(--gutter) pt-1 pb-3 lg:mx-0 lg:grid lg:overflow-visible lg:px-0"
          : "grid grid-cols-2 gap-4 sm:grid-cols-3",
        cols[columns],
        className,
      )}
    >
      {items.map((c) => (
        <li key={c.href} className={cn(scrollOnMobile && "w-44 shrink-0 snap-start lg:w-auto")}>
          <CategoryTile {...c} variant={variant} className={variant === "overlay" ? "h-full" : undefined} />
        </li>
      ))}
    </ul>
  );
}
