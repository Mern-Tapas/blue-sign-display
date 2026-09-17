"use client";

import { Children, useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export type CarouselProps = {
  children: React.ReactNode;
  "aria-label": string;
  /** Width of each slide, e.g. "basis-full" or "basis-[46%] sm:basis-1/3 lg:basis-1/5". */
  slideClassName?: string;
  /** Gap between slides (Tailwind gap class). */
  gapClassName?: string;
  /** `overlay` arrows sit on the edges (heroes); `below` puts arrows and dots under the track (rails); `none` hides them. */
  controls?: "overlay" | "below" | "header" | "none";
  showDots?: boolean;
  /** Advance every N ms. Pauses on hover / focus, never runs under reduced motion, and shows a pause button. */
  autoplay?: number;
  /** Content rendered next to the arrows when controls="header" (e.g. a section title). */
  header?: React.ReactNode;
  className?: string;
  trackClassName?: string;
};

/**
 * Native scroll-snap carousel: swipe and trackpad scrolling just work, arrows and dots
 * scroll the track, Left / Right keys move one slide when the track is focused.
 * Slides are labelled "3 of 8"; off-screen slides stay in the DOM for SEO and find-in-page.
 */
export function Carousel({
  children,
  "aria-label": ariaLabel,
  slideClassName = "basis-full",
  gapClassName = "gap-4",
  controls = "overlay",
  showDots = controls === "overlay",
  autoplay,
  header,
  className,
  trackClassName,
}: CarouselProps) {
  const id = useId();
  const trackRef = useRef<HTMLUListElement>(null);
  const slides = Children.toArray(children);
  const count = slides.length;
  const reducedMotion = useReducedMotion();

  const [active, setActive] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: count <= 1 });
  const [userPaused, setUserPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);

  const autoplayOn = Boolean(autoplay) && !reducedMotion && count > 1;
  const playing = autoplayOn && !userPaused && !interacting;

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const items = Array.from(track.children) as HTMLElement[];
    const left = track.scrollLeft;
    let nearest = 0;
    let best = Infinity;
    items.forEach((el, i) => {
      const d = Math.abs(el.offsetLeft - track.offsetLeft - left);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    const max = track.scrollWidth - track.clientWidth;
    setActive(nearest);
    setEdges({ start: left <= 2, end: left >= max - 2 });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(track);
    return () => ro.disconnect();
  }, [measure]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const target = track?.children[index] as HTMLElement | undefined;
      if (!track || !target) return;
      track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: reducedMotion ? "auto" : "smooth" });
    },
    [reducedMotion],
  );

  const page = useCallback(
    (dir: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      const max = track.scrollWidth - track.clientWidth;
      if (dir === 1 && track.scrollLeft >= max - 2) return scrollToIndex(0);
      track.scrollBy({ left: dir * track.clientWidth * 0.9, behavior: reducedMotion ? "auto" : "smooth" });
    },
    [reducedMotion, scrollToIndex],
  );

  useEffect(() => {
    if (!playing || !autoplay) return;
    const t = window.setInterval(() => page(1), autoplay);
    return () => window.clearInterval(t);
  }, [playing, autoplay, page]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.target !== e.currentTarget) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToIndex(Math.min(count - 1, active + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToIndex(Math.max(0, active - 1));
    }
  }

  const arrowClass = cn(
    "press state-layer hit-area relative flex size-control-md shrink-0 items-center justify-center rounded-pill text-fg",
    "transition-[opacity,transform,color] duration-(--dur-fast) ease-out disabled:pointer-events-none disabled:opacity-0",
  );
  const arrows = (placement: "overlay" | "inline") => (
    <>
      <button
        type="button"
        aria-label="Previous slides"
        aria-controls={`${id}-track`}
        disabled={edges.start}
        onClick={() => page(-1)}
        className={cn(arrowClass, placement === "overlay" ? "absolute top-1/2 left-3 z-10 -translate-y-1/2 bg-surface shadow-popover max-sm:hidden" : "border border-border bg-surface disabled:opacity-40")}
      >
        <ChevronLeft aria-hidden className="size-icon-lg" />
      </button>
      <button
        type="button"
        aria-label="Next slides"
        aria-controls={`${id}-track`}
        disabled={edges.end && !autoplayOn}
        onClick={() => page(1)}
        className={cn(arrowClass, placement === "overlay" ? "absolute top-1/2 right-3 z-10 -translate-y-1/2 bg-surface shadow-popover max-sm:hidden" : "border border-border bg-surface disabled:opacity-40")}
      >
        <ChevronRight aria-hidden className="size-icon-lg" />
      </button>
    </>
  );

  const dots = showDots && count > 1 && (
    <div className="flex items-center gap-0.5">
      {slides.map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === active ? "true" : undefined}
          onClick={() => scrollToIndex(i)}
          className="group/dot hit-area relative flex size-5 items-center justify-center rounded-pill"
        >
          <span
            className={cn(
              "h-1.5 rounded-pill transition-[width,background-color] duration-(--dur-base) ease-out",
              i === active ? "w-4 bg-accent" : "w-1.5 bg-border-strong group-hover/dot:bg-fg-muted",
            )}
          />
        </button>
      ))}
    </div>
  );

  const pauseButton = autoplayOn && (
    <button
      type="button"
      aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
      onClick={() => setUserPaused((p) => !p)}
      className="state-layer hit-area relative flex size-control-xs items-center justify-center rounded-pill text-fg-muted hover:text-fg"
    >
      {userPaused ? <Play aria-hidden className="size-icon-sm" /> : <Pause aria-hidden className="size-icon-sm" />}
    </button>
  );

  return (
    <section
      data-slot="carousel"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={cn("flex flex-col gap-4", className)}
      onPointerEnter={() => autoplayOn && setInteracting(true)}
      onPointerLeave={() => autoplayOn && setInteracting(false)}
      onFocus={() => autoplayOn && setInteracting(true)}
      onBlur={(e) => autoplayOn && !e.currentTarget.contains(e.relatedTarget as Node | null) && setInteracting(false)}
    >
      {controls === "header" && (
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1">{header}</div>
          <div className="flex shrink-0 items-center gap-2 max-sm:hidden">{arrows("inline")}</div>
        </div>
      )}

      <div className="relative">
        {controls === "overlay" && arrows("overlay")}
        <ul
          ref={trackRef}
          id={`${id}-track`}
          tabIndex={0}
          aria-label={`${ariaLabel} slides`}
          onScroll={measure}
          onKeyDown={onKeyDown}
          className={cn(
            "scrollbar-none flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-[inherit] outline-none",
            "focus-ring",
            gapClassName,
            trackClassName,
          )}
        >
          {slides.map((slide, i) => (
            <li
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              className={cn("min-w-0 shrink-0 snap-start", slideClassName)}
            >
              {slide}
            </li>
          ))}
        </ul>
        {controls === "overlay" && (dots || pauseButton) && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center">
            <div className="flex items-center gap-1 rounded-pill bg-surface/85 px-2 py-0.5 shadow-xs backdrop-blur-sm">
              {dots}
              {pauseButton}
            </div>
          </div>
        )}
      </div>

      {controls === "below" && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            {dots}
            {pauseButton}
          </div>
          <div className="flex items-center gap-2">{arrows("inline")}</div>
        </div>
      )}
    </section>
  );
}
