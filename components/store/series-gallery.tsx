"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import type { ProductImage } from "@/lib/data/can-products";

/** Main photo plus a thumbnail row (only when the series has more than one photo). */
export function SeriesGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0]!;
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-card">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          preload
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="animate-fade-in object-contain p-6"
        />
      </div>
      {images.length > 1 && (
        <div role="group" aria-label={`${name} photos`} className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              aria-label={`Show photo ${i + 1}: ${img.alt}`}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg bg-white shadow-flat transition-shadow duration-(--dur-fast)",
                i === active ? "ring-2 ring-selected-ring ring-inset" : "hover:shadow-xs",
              )}
            >
              <Image src={img.src} alt="" fill sizes="96px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
