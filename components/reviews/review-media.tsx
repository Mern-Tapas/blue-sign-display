"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ProductImage } from "@/components/commerce/product-image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";

export type ReviewMediaItem = { src: string; /** "Photo by Ananya · 5★" */ caption?: string };

/* ---------- Lightbox ---------- */

export type ReviewMediaLightboxProps = {
  items: ReviewMediaItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  index: number;
  onIndexChange: (index: number) => void;
};

/** Full-size customer photos with previous / next (buttons and arrow keys) and a position counter. */
export function ReviewMediaLightbox({ items, open, onOpenChange, index, onIndexChange }: ReviewMediaLightboxProps) {
  const count = items.length;
  const item = items[index];
  const go = (delta: number) => onIndexChange((index + delta + count) % count);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="xl"
        className="overflow-hidden bg-surface-contrast p-0 text-fg-on-contrast"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        <DialogPrimitive.Title className="sr-only">Customer photos</DialogPrimitive.Title>
        <DialogPrimitive.Description className="sr-only">Use the arrow keys to move between photos.</DialogPrimitive.Description>
        {item && (
          <div className="relative">
            <ProductImage key={item.src} src={item.src} alt={item.caption ?? `Customer photo ${index + 1}`} sizes="90vw" wrapperClassName="aspect-square max-h-[80dvh] w-full animate-fade-in bg-surface-contrast" className="object-contain" />
            {count > 1 && (
              <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
                <IconButton label="Previous photo" variant="secondary" onClick={() => go(-1)}>
                  <ChevronLeft aria-hidden />
                </IconButton>
                <IconButton label="Next photo" variant="secondary" onClick={() => go(1)}>
                  <ChevronRight aria-hidden />
                </IconButton>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-linear-to-t from-scrim to-transparent p-4 pt-10 text-white">
              <p className="text-body">{item.caption}</p>
              <p aria-live="polite" className="shrink-0 text-caption figures">
                {index + 1} / {count}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Strip ---------- */

export type ReviewMediaStripProps = {
  items: ReviewMediaItem[];
  /** Thumbnails before a "+N" tile that opens the lightbox at the next photo. */
  max?: number;
  size?: "sm" | "md";
  "aria-label"?: string;
  className?: string;
};

/** Row of customer photo thumbnails; each opens the lightbox at that photo. */
export function ReviewMediaStrip({ items, max = 6, size = "md", "aria-label": ariaLabel = "Customer photos", className }: ReviewMediaStripProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  if (items.length === 0) return null;
  const shown = items.slice(0, max);
  const extra = items.length - shown.length;
  const tile = size === "sm" ? "size-16" : "size-20 sm:size-24";

  return (
    <>
      <ul data-slot="review-media-strip" aria-label={ariaLabel} className={cn("flex flex-wrap gap-2", className)}>
        {shown.map((m, i) => {
          const isLast = i === shown.length - 1 && extra > 0;
          return (
            <li key={`${m.src}-${i}`}>
              <button
                type="button"
                aria-label={isLast ? `View all ${items.length} photos` : `Open photo ${i + 1} of ${items.length}${m.caption ? `, ${m.caption}` : ""}`}
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
                className={cn("group relative block overflow-hidden rounded-lg", tile)}
              >
                <ProductImage src={m.src} alt="" sizes="96px" wrapperClassName="size-full" className="transition-transform duration-(--dur-slow) ease-out motion-safe:group-hover:scale-105" />
                {isLast && (
                  <span aria-hidden className="absolute inset-0 flex items-center justify-center bg-scrim text-body-strong text-white figures">
                    +{extra + 1}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <ReviewMediaLightbox items={items} open={open} onOpenChange={setOpen} index={index} onIndexChange={setIndex} />
    </>
  );
}
