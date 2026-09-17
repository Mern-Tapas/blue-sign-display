"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { Button } from "./button";

export type LoadMoreProps = {
  /** Items currently shown. */
  loaded: number;
  total: number;
  onLoadMore: () => void;
  loading?: boolean;
  /** Noun for the summary ("products", "reviews"). */
  noun?: string;
  label?: string;
  className?: string;
};

/**
 * "Showing 24 of 132 products" with a progress bar and a Load more button — the accessible
 * alternative to endless scroll (footer stays reachable, position is clear).
 */
export function LoadMore({ loaded, total, onLoadMore, loading = false, noun = "products", label = "Load more", className }: LoadMoreProps) {
  const done = loaded >= total;
  const pct = total ? Math.min(100, (loaded / total) * 100) : 100;
  return (
    <div data-slot="load-more" className={cn("mx-auto flex w-full max-w-xs flex-col items-center gap-3 text-center", className)}>
      <p className="text-body text-fg-muted figures" aria-live="polite">
        Showing <span className="text-fg">{formatNumber(Math.min(loaded, total))}</span> of {formatNumber(total)} {noun}
      </p>
      <div
        role="progressbar"
        aria-label={`${noun} loaded`}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={Math.min(loaded, total)}
        className="h-1 w-full overflow-hidden rounded-pill bg-surface-sunken"
      >
        <div className="h-full rounded-pill bg-fg transition-[width] duration-(--dur-slow) ease-out" style={{ width: `${pct}%` }} />
      </div>
      {!done && (
        <Button variant="secondary" onClick={onLoadMore} loading={loading} className="mt-1 min-w-40">
          {label}
        </Button>
      )}
    </div>
  );
}

export type InfiniteScrollSentinelProps = {
  onLoadMore: () => void;
  hasMore: boolean;
  loading?: boolean;
  /** Start loading before the sentinel is visible. */
  rootMargin?: string;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Invisible trigger for automatic loading as the sentinel nears the viewport. Always pair it
 * with LoadMore (as its children or nearby) so keyboard and switch users have a real control.
 */
export function InfiniteScrollSentinel({ onLoadMore, hasMore, loading = false, rootMargin = "600px 0px", className, children }: InfiniteScrollSentinelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const latest = useRef({ onLoadMore, hasMore, loading });

  useEffect(() => {
    latest.current = { onLoadMore, hasMore, loading };
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const { hasMore: more, loading: busy, onLoadMore: load } = latest.current;
        if (entry?.isIntersecting && more && !busy) load();
      },
      { rootMargin },
    );
    // Re-observing after each load re-runs the initial intersection check, so a sentinel that
    // is still on screen keeps loading until the page is filled.
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, loading, hasMore]);

  return (
    <div ref={ref} data-slot="infinite-scroll-sentinel" className={className}>
      {children}
    </div>
  );
}
