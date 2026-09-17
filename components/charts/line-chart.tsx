"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { ChartTooltip } from "./chart-frame";
import { formatValue, linearScale, niceTicks, slotColor, type ValueFormat } from "./scales";
import { useChartWidth } from "./use-chart-width";

export type LineSeries = {
  id: string;
  label: string;
  /** Categorical slot (0-based, fixed per entity so filters never repaint survivors). */
  slot: number;
  values: number[];
};

export type LineChartProps = {
  /** X labels, one per value index (dates, weeks). */
  labels: string[];
  series: LineSeries[];
  /** Soft 10% wash under a single series. */
  area?: boolean;
  format?: ValueFormat;
  height?: number;
  /** Accessible summary of what the chart shows. */
  summary: string;
  /** Label the last point of each series directly (≤4 series). */
  endLabels?: boolean;
  className?: string;
};

const PAD = { top: 12, right: 12, bottom: 28, left: 48 };

/**
 * Trend over time on one y-axis. 2px lines, a crosshair that snaps to the nearest x, one tooltip
 * listing every series, and the same readout on keyboard focus (← → to move).
 */
export function LineChart({ labels, series, area = false, format = "number", height = 220, summary, endLabels = true, className }: LineChartProps) {
  const [ref, width] = useChartWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const gradientId = useId();
  const n = labels.length;

  const all = series.flatMap((s) => s.values);
  const ticks = niceTicks(Math.min(0, ...all), Math.max(...all, 0), height < 180 ? 3 : 4);
  const yMin = ticks[0]!;
  const yMax = ticks[ticks.length - 1]!;
  const labelRoom = endLabels && series.length <= 4 ? 64 : 0;
  const w = width ?? 0;
  const plotW = Math.max(0, w - PAD.left - PAD.right - labelRoom);
  const plotH = height - PAD.top - PAD.bottom;
  const x = linearScale([0, Math.max(1, n - 1)], [PAD.left, PAD.left + plotW]);
  const y = linearScale([yMin, yMax], [PAD.top + plotH, PAD.top]);
  const xEvery = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(plotW / 72))));

  const pathFor = (values: number[]) => values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");

  const pick = (clientX: number, rect: DOMRect) => {
    const rel = clientX - rect.left - PAD.left;
    const i = Math.round((rel / Math.max(1, plotW)) * (n - 1));
    setActive(Math.min(n - 1, Math.max(0, i)));
  };

  return (
    <div ref={ref} className={cn("relative w-full", className)} style={{ height }}>
      {width !== null && width > 0 && (
        <svg
          width={w}
          height={height}
          role="img"
          aria-label={summary}
          tabIndex={0}
          className="block touch-pan-y rounded-md"
          onPointerMove={(e) => pick(e.clientX, e.currentTarget.getBoundingClientRect())}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive((a) => a ?? n - 1)}
          onBlur={() => setActive(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") setActive((a) => Math.min(n - 1, (a ?? -1) + 1));
            else if (e.key === "ArrowLeft") setActive((a) => Math.max(0, (a ?? n) - 1));
            else if (e.key === "Home") setActive(0);
            else if (e.key === "End") setActive(n - 1);
            else return;
            e.preventDefault();
          }}
        >
          {area && series.length === 1 && (
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={slotColor(series[0]!.slot)} stopOpacity="0.14" />
                <stop offset="100%" stopColor={slotColor(series[0]!.slot)} stopOpacity="0.02" />
              </linearGradient>
            </defs>
          )}

          {/* Recessive solid hairline grid + tick labels */}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={PAD.left + plotW} y1={y(t)} y2={y(t)} stroke={t === 0 ? "var(--chart-axis)" : "var(--chart-grid)"} strokeWidth={1} shapeRendering="crispEdges" />
              <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-fg-muted text-caption figures">
                {formatValue(t, format === "inr" ? "inr-compact" : format === "number" ? "compact" : format)}
              </text>
            </g>
          ))}
          {labels.map((l, i) =>
            (i % xEvery === 0 && n - 1 - i >= Math.ceil(xEvery * 0.6)) || i === n - 1 ? (
              <text key={i} x={x(i)} y={height - 8} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} className="fill-fg-muted text-caption">
                {l}
              </text>
            ) : null,
          )}

          {area && series.length === 1 && <path d={`${pathFor(series[0]!.values)}L${x(n - 1)},${y(yMin)}L${x(0)},${y(yMin)}Z`} fill={`url(#${gradientId})`} />}

          {series.map((s) => (
            <path key={s.id} d={pathFor(s.values)} fill="none" stroke={slotColor(s.slot)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          ))}

          {labelRoom > 0 &&
            series.map((s) => (
              <g key={`${s.id}-end`}>
                <circle cx={x(n - 1)} cy={y(s.values[n - 1] ?? 0)} r={4} fill={slotColor(s.slot)} stroke="var(--surface)" strokeWidth={2} />
                <text x={x(n - 1) + 10} y={y(s.values[n - 1] ?? 0)} dy="0.32em" className="fill-fg text-caption figures">
                  {formatValue(s.values[n - 1] ?? 0, format === "inr" ? "inr-compact" : format)}
                </text>
              </g>
            ))}

          {active !== null && (
            <g aria-hidden>
              <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={PAD.top + plotH} stroke="var(--chart-axis)" strokeWidth={1} shapeRendering="crispEdges" />
              {series.map((s) => (
                <circle key={s.id} cx={x(active)} cy={y(s.values[active] ?? 0)} r={4} fill={slotColor(s.slot)} stroke="var(--surface)" strokeWidth={2} />
              ))}
            </g>
          )}
        </svg>
      )}
      {active !== null && width !== null && (
        <ChartTooltip
          title={labels[active] ?? ""}
          x={x(active)}
          y={PAD.top}
          containerWidth={w}
          rows={series.map((s) => ({ label: s.label, value: formatValue(s.values[active] ?? 0, format), color: slotColor(s.slot) }))}
        />
      )}
      <p className="sr-only" aria-live="polite">
        {active !== null ? `${labels[active]}: ${series.map((s) => `${s.label} ${formatValue(s.values[active] ?? 0, format)}`).join(", ")}` : ""}
      </p>
    </div>
  );
}
