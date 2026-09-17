import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { placementLabel, sizeRange, type Series } from "@/lib/data/can-products";

export type SeriesCardProps = {
  series: Series;
  /** Preload the image, for above-the-fold cards. */
  preload?: boolean;
  className?: string;
};

/** One CAN series: photo, name, brochure headline, size range and key facts. The whole card links to its page. */
export function SeriesCard({ series: s, preload, className }: SeriesCardProps) {
  const cover = s.images[0]!;
  const has4k = s.resolutions.includes("4K Ultra HD");
  const modelCount = s.models.length;
  return (
    <Card asChild padding="none" interactive className={cn("group overflow-hidden", className)}>
      <Link href={`/products/${s.slug}`}>
        <div className="relative m-2 mb-0 aspect-[4/3] overflow-hidden rounded-xl bg-white">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            preload={preload}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-4 transition-transform duration-(--dur-slow) group-hover:scale-[1.03]"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {has4k && <Badge tone="solid" size="sm">4K</Badge>}
            {s.specsOnRequest && <Badge tone="outline" size="sm">Specs on request</Badge>}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-caption text-fg-muted">
                {placementLabel(s.placement)} · {sizeRange(s)}
              </p>
              <h3 className="mt-1 text-heading-sm">{s.name}</h3>
              <p className="text-body text-fg-muted">{s.headline}</p>
            </div>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-surface-sunken text-fg transition-[background-color,color,rotate] duration-(--dur-fast) group-hover:rotate-45 group-hover:bg-accent group-hover:text-fg-on-accent">
              <ArrowUpRight aria-hidden className="size-icon-md" />
            </span>
          </div>
          <ul className="mt-auto flex flex-wrap gap-1.5" aria-label={`${s.name} highlights`}>
            {s.highlights.map((h) => (
              <li key={h}>
                <Badge tone="neutral">{h}</Badge>
              </li>
            ))}
          </ul>
          <p className="text-caption text-fg-muted">
            {modelCount} {modelCount === 1 ? "model" : "models"}
          </p>
        </div>
      </Link>
    </Card>
  );
}
