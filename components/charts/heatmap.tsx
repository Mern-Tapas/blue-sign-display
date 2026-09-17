"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { CHART_SEQUENTIAL, formatValue, type ValueFormat } from "./scales";

export type HeatmapProps = {
  rows: string[];
  columns: string[];
  /** values[row][column] */
  values: number[][];
  format?: ValueFormat;
  label: string;
  /** Show every nth column label. */
  columnLabelEvery?: number;
  className?: string;
};

/**
 * Magnitude across a grid (orders by weekday × hour) on the one-hue sequential ramp, with a scale
 * legend. Cells are a roving keyboard grid; hover and focus show the same readout.
 */
export function Heatmap({ rows, columns, values, format = "number", label, columnLabelEvery = 3, className }: HeatmapProps) {
  const [active, setActive] = useState<[number, number] | null>(null);
  const flat = values.flat();
  const min = Math.min(...flat);
  const max = Math.max(...flat);
  const step = (v: number) => CHART_SEQUENTIAL[Math.min(CHART_SEQUENTIAL.length - 1, Math.floor(((v - min) / (max - min || 1)) * CHART_SEQUENTIAL.length))]!;
  const current = active ? `${rows[active[0]]}, ${columns[active[1]]}: ${formatValue(values[active[0]]![active[1]]!, format)}` : "";

  return (
    <div data-slot="heatmap" className={cn("flex flex-col gap-3", className)}>
      <div className="overflow-x-auto">
        <div
          role="grid"
          aria-label={label}
          tabIndex={0}
          className="inline-grid min-w-full gap-0.5 rounded-md"
          style={{ gridTemplateColumns: `3rem repeat(${columns.length}, minmax(1.25rem, 1fr))` }}
          onFocus={() => setActive((a) => a ?? [0, 0])}
          onBlur={() => setActive(null)}
          onPointerLeave={() => setActive(null)}
          onKeyDown={(e) => {
            const [r, c] = active ?? [0, 0];
            const moves: Record<string, [number, number]> = { ArrowRight: [r, c + 1], ArrowLeft: [r, c - 1], ArrowDown: [r + 1, c], ArrowUp: [r - 1, c] };
            const next = moves[e.key];
            if (!next) return;
            e.preventDefault();
            setActive([Math.min(rows.length - 1, Math.max(0, next[0])), Math.min(columns.length - 1, Math.max(0, next[1]))]);
          }}
        >
          {rows.map((row, r) => (
            <div key={row} role="row" className="contents">
              <span role="rowheader" className="flex items-center text-caption text-fg-muted">
                {row}
              </span>
              {columns.map((col, c) => {
                const on = active?.[0] === r && active?.[1] === c;
                return (
                  <span
                    key={col}
                    role="gridcell"
                    aria-label={`${row} ${col}: ${formatValue(values[r]![c]!, format)}`}
                    aria-selected={on}
                    className={cn("h-6 rounded-xs transition-shadow duration-(--dur-fast)", on && "shadow-[0_0_0_2px_var(--surface),0_0_0_4px_var(--focus-ring)]")}
                    style={{ background: step(values[r]![c]!) }}
                    onPointerEnter={() => setActive([r, c])}
                  />
                );
              })}
            </div>
          ))}
          <span />
          {columns.map((col, c) => (
            <span key={col} className="pt-1 text-center text-caption text-fg-muted">
              {c % columnLabelEvery === 0 ? col : ""}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="min-h-4 text-caption text-fg figures">
          {current}
        </p>
        <div className="flex items-center gap-2 text-caption text-fg-muted">
          <span className="figures">{formatValue(min, format)}</span>
          <span aria-hidden className="flex gap-0.5">
            {CHART_SEQUENTIAL.map((color) => (
              <span key={color} className="h-2.5 w-4 first:rounded-l-xs last:rounded-r-xs" style={{ background: color }} />
            ))}
          </span>
          <span className="figures">{formatValue(max, format)}</span>
        </div>
      </div>
    </div>
  );
}
