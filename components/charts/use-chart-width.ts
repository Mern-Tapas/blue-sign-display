"use client";

import { useCallback, useState } from "react";

/**
 * Tracks an element's content width with one ResizeObserver. Returns a ref callback and the
 * width (null until measured, so charts render a stable placeholder on the server).
 */
export function useChartWidth<T extends HTMLElement>() {
  const [width, setWidth] = useState<number | null>(null);
  const ref = useCallback((node: T | null) => {
    if (!node) return;
    const ro = new ResizeObserver((entries) => {
      const w = Math.round(entries[0]?.contentRect.width ?? 0);
      setWidth((prev) => (prev === w ? prev : w));
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}
