import Link from "next/link";
import { ProductImage } from "@/components/commerce/product-image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type BrandTileData = {
  name: string;
  href: string;
  /** Lifestyle or product photo for the brand. */
  image: string;
  /** Logo image; when missing the brand name is set as a wordmark. */
  logo?: string;
  /** "Up to 40% off", "New season". Must match the linked listing. */
  offer?: string;
};

export type BrandGridProps = {
  brands: BrandTileData[];
  "aria-label"?: string;
  /** Swipeable row on phones instead of a 2-column grid. */
  scrollOnMobile?: boolean;
  className?: string;
};

/** "Top brands" tiles: photo, brand mark on a white plate, offer line. Server-safe. */
export function BrandGrid({ brands, "aria-label": ariaLabel = "Top brands", scrollOnMobile = false, className }: BrandGridProps) {
  return (
    <ul
      aria-label={ariaLabel}
      data-slot="brand-grid"
      className={cn(
        scrollOnMobile
          ? "scrollbar-none -mx-(--gutter) flex snap-x gap-3 overflow-x-auto px-(--gutter) pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-6"
          : "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6",
        className,
      )}
    >
      {brands.map((b) => (
        <li key={b.href} className={cn(scrollOnMobile && "w-40 shrink-0 snap-start sm:w-auto")}>
          <Card asChild interactive padding="none" className="group h-full overflow-hidden">
            <Link href={b.href}>
              <span className="relative block aspect-[4/3] overflow-hidden">
                <ProductImage
                  src={b.image}
                  alt=""
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw"
                  wrapperClassName="absolute inset-0"
                  className="transition-transform duration-(--dur-slow) ease-out motion-safe:group-hover:scale-[1.04]"
                />
              </span>
              <span className="relative -mt-6 flex flex-1 flex-col items-center gap-1 px-3 pb-4 text-center">
                <span className="flex h-12 min-w-24 items-center justify-center rounded-lg bg-white px-3 text-black shadow-xs">
                  {b.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element -- brand logos are small, fixed-size marks
                    <img src={b.logo} alt={b.name} className="max-h-7 max-w-24 object-contain" />
                  ) : (
                    <span className="text-title tracking-tight uppercase">{b.name}</span>
                  )}
                </span>
                {b.offer && <span className="mt-1 text-label text-success-fg">{b.offer}</span>}
              </span>
            </Link>
          </Card>
        </li>
      ))}
    </ul>
  );
}
