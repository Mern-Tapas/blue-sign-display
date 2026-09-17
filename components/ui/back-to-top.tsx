"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export type BackToTopProps = {
  /** Show after scrolling this many pixels. */
  threshold?: number;
  /** Element focused after scrolling (keyboard users land at the top, not on a random button). */
  targetId?: string;
  /** Lift the button above sticky mobile bars (e.g. "bottom-24 lg:bottom-6"). */
  className?: string;
  label?: string;
};

/**
 * Floating "Back to top" for long listings. Appears after the threshold, scrolls smoothly
 * (instantly under reduced motion) and moves focus to the main landmark.
 */
export function BackToTop({ threshold = 1200, targetId = "main", className, label = "Back to top" }: BackToTopProps) {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setVisible(window.scrollY > threshold));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold]);

  function toTop() {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    const target = document.getElementById(targetId);
    if (target) {
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  }

  return (
    <button
      type="button"
      data-slot="back-to-top"
      onClick={toTop}
      aria-hidden={!visible || undefined}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "press fixed right-4 bottom-6 z-(--z-sticky) flex h-control-md items-center gap-2 rounded-pill bg-surface-inverse pr-4 pl-3 text-label text-fg-inverse shadow-popover sm:right-6",
        "transition-[opacity,translate,transform] duration-(--dur-base) ease-out",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        className,
      )}
    >
      <ArrowUp aria-hidden className="size-icon-md" />
      {label}
    </button>
  );
}
