"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";
import { ImageZoomLens } from "@/components/product/image-zoom-lens";
import { ProductImage } from "./product-image";

export type ImageGalleryProps = {
  images: string[];
  alt: string;
  /** Overlay slot on the main image, e.g. badges. */
  overlay?: React.ReactNode;
  className?: string;
};

export function ImageGallery({ images, alt, overlay, className }: ImageGalleryProps) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const count = images.length;
  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <div
      data-slot="image-gallery"
      className={cn("flex flex-col-reverse gap-3 md:flex-row", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${alt} images`}
    >
      {count > 1 && (
        <div role="tablist" aria-label="Choose image" className="scrollbar-none flex gap-2 overflow-x-auto md:flex-col">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Image ${i + 1} of ${count}`}
              onClick={() => setIndex(i)}
              className={cn(
                "relative size-18 shrink-0 overflow-hidden rounded-lg ring-offset-2 ring-offset-canvas transition-[box-shadow,opacity] duration-(--dur-fast)",
                i === index ? "ring-2 ring-accent" : "opacity-70 hover:opacity-100",
              )}
            >
              <ProductImage src={src} alt="" sizes="72px" wrapperClassName="size-full" />
            </button>
          ))}
        </div>
      )}

      <div
        className="group relative flex-1"
        tabIndex={0}
        aria-live="polite"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        <ImageZoomLens src={images[index]!} className="rounded-2xl">
          <ProductImage
            key={images[index]}
            src={images[index]!}
            alt={`${alt} — image ${index + 1} of ${count}`}
            sizes="(min-width: 1024px) 50vw, 100vw"
            preload={index === 0}
            wrapperClassName="aspect-square w-full rounded-2xl animate-fade-in"
          />
        </ImageZoomLens>
        {overlay && <div className="absolute top-4 left-4 flex gap-1.5">{overlay}</div>}
        <IconButton label="Zoom image" size="sm" variant="secondary" className="absolute top-4 right-4" onClick={() => setZoom(true)}>
          <Expand aria-hidden />
        </IconButton>
        {count > 1 && (
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
            <IconButton label="Previous image" variant="secondary" onClick={() => go(-1)}>
              <ChevronLeft aria-hidden />
            </IconButton>
            <div className="flex gap-1.5 rounded-pill bg-surface/80 px-2.5 py-2 backdrop-blur-sm" aria-hidden>
              {images.map((src, i) => (
                <span key={src} className={cn("h-1.5 rounded-pill bg-fg transition-[width,opacity] duration-(--dur-base)", i === index ? "w-4" : "w-1.5 opacity-30")} />
              ))}
            </div>
            <IconButton label="Next image" variant="secondary" onClick={() => go(1)}>
              <ChevronRight aria-hidden />
            </IconButton>
          </div>
        )}
      </div>

      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent size="xl" className="overflow-hidden p-0" aria-label={alt} aria-describedby={undefined}>
          <ProductImage src={images[index]!} alt={alt} sizes="90vw" wrapperClassName="aspect-square max-h-[85dvh] w-full" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
