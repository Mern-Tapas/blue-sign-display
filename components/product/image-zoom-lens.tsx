"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";

export type ImageZoomLensProps = {
  /** Full-resolution source for the magnified layer. */
  src: string;
  children: React.ReactNode;
  /** Magnification factor. */
  zoom?: number;
  className?: string;
};

/**
 * Hover magnifier for desktop product photos: the image under the pointer is shown enlarged in
 * place. Fine pointers only (touch keeps pinch-zoom and the gallery's full-screen view), and
 * the pointer position is written to CSS variables directly, so moving never re-renders React.
 */
export function ImageZoomLens({ src, children, zoom = 2.5, className }: ImageZoomLensProps) {
  const ref = useRef<HTMLDivElement>(null);

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--zx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--zy", `${((e.clientY - r.top) / r.height) * 100}%`);
  }

  return (
    <div ref={ref} data-slot="image-zoom-lens" onPointerMove={move} className={cn("group/zoom relative overflow-hidden", className)}>
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-no-repeat opacity-0 transition-opacity duration-(--dur-fast) ease-out pointer-fine:block pointer-fine:group-hover/zoom:opacity-100"
        style={{
          backgroundImage: `url("${src}")`,
          backgroundSize: `${zoom * 100}%`,
          backgroundPosition: "var(--zx, 50%) var(--zy, 50%)",
          cursor: "zoom-in",
        }}
      />
    </div>
  );
}
