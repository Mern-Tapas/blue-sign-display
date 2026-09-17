"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { ChartTooltip } from "./chart-frame";
import { barPath, formatValue, linearScale, niceTicks, slotColor, type ValueFormat } from "./scales";
import { useChartWidth } from "./use-chart-width";

export type BarSeries = { id: string; label: string; slot: number; values: number[] };

export type BarChartProps = {
  categories: string[];
  /** One series → every bar wears slot 1 (no legend). Several → grouped or stacked. */
  series: BarSeries[];
  stacked?: boolean;
  orientation?: "vertical" | "horizontal";
  format?: ValueFormat;
  /** Plot height for vertical charts; horizontal charts size from the category count. */
  height?: number;
  summary: string;
  /** Value at the bar tip (single series only; skipped when it would not fit). */
  valueLabels?: boolean;
  className?: string;
};

const BAR_MAX = 24;
const GAP = 2;

/**
 * Magnitude comparison. Bars ≤24px with a 4px rounded data end, square at the baseline, a 2px
 * surface gap between touching bars and stack segments. Each bar is its own hover/focus target.
 */
export function BarChart({ categories, series, stacked = false, orientation = "vertical", format = "number", height = 240, summary, valueLabels = false, className }: BarChartProps) {
  const [ref, width] = useChartWidth<HTMLDivElement>();
  const [active, setActive] = useState<{ c: number; s: number } | null>(null);
  const horizontal = orientation === "horizontal";
  const nCat = categories.length;
  const nSer = series.length;

  const totals = categories.map((_, c) => series.reduce((sum, s) => sum + Math.max(0, s.values[c] ?? 0), 0));
  const peak = stacked ? Math.max(...totals, 0) : Math.max(...series.flatMap((s) => s.values), 0);
  const tickCount = horizontal ? Math.max(2, Math.min(4, Math.floor(((width ?? 600) - 180) / 90))) : 4;
  const ticks = niceTicks(0, peak, tickCount);
  const vMax = ticks[ticks.length - 1]!;

  const w = width ?? 0;
  const labelW = horizontal ? Math.min(160, Math.max(72, Math.max(...categories.map((c) => c.length)) * 7)) : 0;
  const pad = horizontal ? { top: 4, right: valueLabels ? 64 : 16, bottom: 24, left: labelW } : { top: 16, right: 8, bottom: 28, left: 48 };
  const bandSize = horizontal ? 36 : 0;
  const h = horizontal ? pad.top + pad.bottom + nCat * bandSize : height;
  const plotW = Math.max(0, w - pad.left - pad.right);
  const plotH = h - pad.top - pad.bottom;
  const band = (horizontal ? plotH : plotW) / Math.max(1, nCat);
  const groupCount = stacked ? 1 : nSer;
  const barThick = Math.max(4, Math.min(BAR_MAX, (band * 0.62 - GAP * (groupCount - 1)) / groupCount));
  const value = linearScale([0, vMax], horizontal ? [0, plotW] : [0, plotH]);

  type Rect = { c: number; s: number; d: string; cx: number; cy: number };
  const rects: Rect[] = [];
  categories.forEach((_, c) => {
    const bandStart = (horizontal ? pad.top : pad.left) + c * band;
    const groupSpan = groupCount * barThick + (groupCount - 1) * GAP;
    let offset = 0;
    series.forEach((s, si) => {
      const v = Math.max(0, s.values[c] ?? 0);
      const len = value(v);
      const segLen = stacked && si < nSer - 1 && len > GAP ? len - GAP : len;
      const across = bandStart + (band - groupSpan) / 2 + (stacked ? 0 : si * (barThick + GAP));
      const isTop = !stacked || series.slice(si + 1).every((t) => (t.values[c] ?? 0) <= 0);
      if (horizontal) {
        const x0 = pad.left + offset;
        rects.push({ c, s: si, d: isTop ? barPath(x0, across, segLen, barThick, "horizontal") : `M${x0},${across}h${segLen}v${barThick}h${-segLen}Z`, cx: x0 + segLen, cy: across + barThick / 2 });
      } else {
        const y0 = pad.top + plotH - offset - segLen;
        rects.push({ c, s: si, d: isTop ? barPath(across, y0, barThick, segLen, "vertical") : `M${across},${y0}h${barThick}v${segLen}h${-barThick}Z`, cx: across + barThick / 2, cy: y0 });
      }
      if (stacked) offset += len;
    });
  });

  const focusIndex = active ? rects.findIndex((r) => r.c === active.c && r.s === active.s) : -1;
  const move = (delta: number) => {
    const next = rects[Math.min(rects.length - 1, Math.max(0, (focusIndex < 0 ? -1 : focusIndex) + delta))];
    if (next) setActive({ c: next.c, s: next.s });
  };
  const activeRect = focusIndex >= 0 ? rects[focusIndex] : null;

  return (
    <div ref={ref} className={cn("relative w-full", className)} style={{ height: h }}>
      {width !== null && width > 0 && (
        <svg
          width={w}
          height={h}
          role="img"
          aria-label={summary}
          tabIndex={0}
          className="block rounded-md"
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive((a) => a ?? { c: 0, s: 0 })}
          onBlur={() => setActive(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") move(1);
            else if (e.key === "ArrowLeft" || e.key === "ArrowUp") move(-1);
            else return;
            e.preventDefault();
          }}
        >
          {ticks.map((t) =>
            horizontal ? (
              <g key={t}>
                <line x1={pad.left + value(t)} x2={pad.left + value(t)} y1={pad.top} y2={pad.top + plotH} stroke={t === 0 ? "var(--chart-axis)" : "var(--chart-grid)"} strokeWidth={1} shapeRendering="crispEdges" />
                <text x={pad.left + value(t)} y={h - 6} textAnchor="middle" className="fill-fg-muted text-caption figures">
                  {formatValue(t, format === "inr" ? "inr-compact" : format === "number" ? "compact" : format)}
                </text>
              </g>
            ) : (
              <g key={t}>
                <line x1={pad.left} x2={pad.left + plotW} y1={pad.top + plotH - value(t)} y2={pad.top + plotH - value(t)} stroke={t === 0 ? "var(--chart-axis)" : "var(--chart-grid)"} strokeWidth={1} shapeRendering="crispEdges" />
                <text x={pad.left - 8} y={pad.top + plotH - value(t)} dy="0.32em" textAnchor="end" className="fill-fg-muted text-caption figures">
                  {formatValue(t, format === "inr" ? "inr-compact" : format === "number" ? "compact" : format)}
                </text>
              </g>
            ),
          )}

          {categories.map((cat, c) =>
            horizontal ? (
              <text key={cat} x={pad.left - 10} y={pad.top + c * band + band / 2} dy="0.32em" textAnchor="end" className="fill-fg text-caption">
                {cat}
              </text>
            ) : (
              <text key={cat} x={pad.left + c * band + band / 2} y={h - 8} textAnchor="middle" className="fill-fg-muted text-caption">
                {cat}
              </text>
            ),
          )}

          {rects.map((r) => {
            const isActive = active?.c === r.c && active?.s === r.s;
            return (
              <path
                key={`${r.c}-${r.s}`}
                d={r.d}
                fill={slotColor(nSer === 1 ? 0 : series[r.s]!.slot)}
                opacity={active && !isActive ? 0.55 : 1}
                className="transition-opacity duration-(--dur-fast)"
                onPointerEnter={() => setActive({ c: r.c, s: r.s })}
              />
            );
          })}

          {/* Generous transparent hit bands so the pointer never has to land on a thin bar */}
          {categories.map((_, c) => (
            <rect
              key={`hit-${c}`}
              x={horizontal ? pad.left : pad.left + c * band}
              y={horizontal ? pad.top + c * band : pad.top}
              width={horizontal ? plotW : band}
              height={horizontal ? band : plotH}
              fill="transparent"
              onPointerMove={() => setActive((a) => (a?.c === c ? a : { c, s: stacked ? nSer - 1 : 0 }))}
            />
          ))}

          {valueLabels &&
            nSer === 1 &&
            rects.map((r) => {
              const v = series[0]!.values[r.c] ?? 0;
              return horizontal ? (
                <text key={`v-${r.c}`} x={r.cx + 8} y={r.cy} dy="0.32em" className="pointer-events-none fill-fg text-caption figures">
                  {formatValue(v, format)}
                </text>
              ) : band > 44 ? (
                <text key={`v-${r.c}`} x={r.cx} y={r.cy - 6} textAnchor="middle" className="pointer-events-none fill-fg text-caption figures">
                  {formatValue(v, format === "inr" ? "inr-compact" : format)}
                </text>
              ) : null;
            })}
        </svg>
      )}
      {activeRect && active && (
        <ChartTooltip
          title={categories[active.c] ?? ""}
          x={activeRect.cx}
          y={horizontal ? activeRect.cy - 20 : Math.max(0, activeRect.cy - 40)}
          containerWidth={w}
          rows={(stacked ? series : [series[active.s]!]).map((s) => ({ label: s.label, value: formatValue(s.values[active.c] ?? 0, format), color: slotColor(nSer === 1 ? 0 : s.slot), shape: "rect" as const }))}
        />
      )}
      <p className="sr-only" aria-live="polite">
        {active ? `${categories[active.c]}, ${series[active.s]?.label}: ${formatValue(series[active.s]?.values[active.c] ?? 0, format)}` : ""}
      </p>
    </div>
  );
}
