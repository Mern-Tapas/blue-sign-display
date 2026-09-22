import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { keySpecs, type CatalogueProduct } from "@/lib/data/catalogue";

export type CatalogueCardProps = {
  product: CatalogueProduct;
  categoryName?: string;
  preload?: boolean;
  className?: string;
};

/**
 * Catalogue product tile, in the same language as SeriesCard: photo on a lit white stage,
 * category and title, up to three key specs as one quiet line, and a "view" affordance.
 * Video and brochure availability show as small marks on the photo.
 */
export function CatalogueCard({ product: p, categoryName, preload, className }: CatalogueCardProps) {
  const cover = p.images[0];
  const specs = keySpecs(p);
  return (
    <Link
      href={p.href ?? `/catalogue/${p.slug}`}
      className={cn(
        "group lift relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-card outline-offset-4",
        "active:scale-[0.99] active:duration-(--dur-instant)",
        className,
      )}
    >
      <div className="relative m-1.5 mb-0 aspect-square overflow-hidden rounded-xl bg-white">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_110%,rgb(5_24_39/0.07),transparent_70%)]"
        />
        {cover && (
          <Image
            src={cover}
            alt={p.title}
            fill
            preload={preload}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-contain p-3 transition-transform duration-(--dur-slow) ease-(--ease-out) group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
          />
        )}
        {p.brand && (
          <Badge tone="solid" size="sm" className="absolute top-2.5 left-2.5">
            {p.brand}
          </Badge>
        )}
        {(p.videos.length > 0 || p.brochure) && (
          <div className="absolute right-2.5 bottom-2.5 flex gap-1">
            {p.videos.length > 0 && (
              <span className="flex size-7 items-center justify-center rounded-pill bg-surface-inverse/85 text-fg-inverse" title="Has video">
                <PlayCircle aria-label="Has video" className="size-icon-sm" />
              </span>
            )}
            {p.brochure && (
              <span className="flex size-7 items-center justify-center rounded-pill bg-surface-inverse/85 text-fg-inverse" title="PDF brochure">
                <FileText aria-label="PDF brochure" className="size-icon-sm" />
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 px-4 pt-3.5 pb-4">
        {categoryName && <p className="text-caption text-fg-muted">{categoryName}</p>}
        <h3 className="line-clamp-2 text-body-strong" title={p.name}>
          {p.title}
        </h3>
        {specs.length > 0 && <p className="line-clamp-2 text-caption text-fg-muted">{specs.join(", ")}</p>}
        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-label text-accent-fg">
          {p.brand ? "View series" : "View details"}
          <ArrowRight
            aria-hidden
            className="size-icon-sm transition-transform duration-(--dur-base) ease-(--ease-out) group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
