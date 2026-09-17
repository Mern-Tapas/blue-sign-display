import Image from "next/image";
import Link from "next/link";
import { FileText, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { keySpecs, type CatalogueProduct } from "@/lib/data/catalogue";

export type CatalogueCardProps = {
  product: CatalogueProduct;
  categoryName?: string;
  preload?: boolean;
};

/** Catalogue product tile: photo, category, title, up to three key specs, media hints. */
export function CatalogueCard({ product: p, categoryName, preload }: CatalogueCardProps) {
  const cover = p.images[0];
  const specs = keySpecs(p);
  return (
    <Card asChild padding="none" interactive className="group h-full overflow-hidden">
      <Link href={`/catalogue/${p.slug}`}>
        <div className="relative m-2 mb-0 aspect-square overflow-hidden rounded-xl bg-white">
          {cover && (
            <Image
              src={cover}
              alt={p.title}
              fill
              preload={preload}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-contain p-3 transition-transform duration-(--dur-slow) group-hover:scale-[1.03]"
            />
          )}
          {(p.videos.length > 0 || p.brochure) && (
            <div className="absolute right-2 bottom-2 flex gap-1">
              {p.videos.length > 0 && (
                <span className="flex size-7 items-center justify-center rounded-pill bg-surface-inverse text-fg-inverse" title="Has video">
                  <PlayCircle aria-label="Has video" className="size-icon-sm" />
                </span>
              )}
              {p.brochure && (
                <span className="flex size-7 items-center justify-center rounded-pill bg-surface-inverse text-fg-inverse" title="PDF brochure">
                  <FileText aria-label="PDF brochure" className="size-icon-sm" />
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          {categoryName && <p className="text-caption text-fg-muted">{categoryName}</p>}
          <h3 className="line-clamp-3 text-body-strong">{p.title}</h3>
          {specs.length > 0 && (
            <ul className="mt-auto flex flex-wrap gap-1" aria-label="Key specs">
              {specs.map((s) => (
                <li key={s} className="min-w-0">
                  <Badge tone="neutral" size="sm" className="max-w-full truncate">
                    {s}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </Card>
  );
}
