import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { placementLabel, sizeRange, type Series } from "@/lib/data/can-products";

export type SeriesCardProps = {
  series: Series;
  /** Preload the image, for above-the-fold cards. */
  preload?: boolean;
  className?: string;
};

/**
 * One CAN series. The photo sits on a lit white stage (the product shots are shot on white), the
 * name and size range read as one line, and the facts follow as a single quiet run of text.
 * The whole card is the link; hover lifts it and eases the photo forward.
 */
export function SeriesCard({ series: s, preload, className }: SeriesCardProps) {
  const cover = s.images[0]!;
  const has4k = s.resolutions.includes("4K Ultra HD");
  const models = s.models.length;
  return (
    <Link
      href={`/products/${s.slug}`}
      className={cn(
        "group lift relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-card outline-offset-4",
        "active:scale-[0.99] active:duration-(--dur-instant)",
        className,
      )}
    >
      <div className="relative m-1.5 mb-0 aspect-[4/3] overflow-hidden rounded-xl bg-white">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_110%,rgb(5_24_39/0.07),transparent_70%)]"
        />
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          preload={preload}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-5 transition-transform duration-(--dur-slow) ease-(--ease-out) group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
        />
        {(has4k || s.specsOnRequest) && (
          <div className="absolute top-3 left-3 flex gap-1.5">
            {has4k && (
              <Badge tone="solid" size="sm">
                4K
              </Badge>
            )}
            {s.specsOnRequest && (
              <Badge tone="outline" size="sm">
                Specs on request
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pt-4 pb-5">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-heading-sm">{s.name}</h3>
            <span className="shrink-0 text-label text-fg-muted figures">{sizeRange(s)}</span>
          </div>
          <p className="mt-0.5 text-body text-fg-muted">{s.headline}</p>
        </div>

        <p className="line-clamp-2 text-caption text-fg-muted">{s.highlights.join(", ")}</p>

        <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-3 text-label">
          <span className="text-fg-muted">
            {placementLabel(s.placement)} · {models} {models === 1 ? "model" : "models"}
          </span>
          <span className="inline-flex items-center gap-1 text-accent-fg">
            View series
            <ArrowRight
              aria-hidden
              className="size-icon-sm transition-transform duration-(--dur-base) ease-(--ease-out) group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
