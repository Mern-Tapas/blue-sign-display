"use client";

import { useId, useState } from "react";
import { BarChart3, Table2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { cn } from "@/lib/cn";

export type ChartTableData = {
  columns: string[];
  rows: (string | number)[][];
};

export type ChartFrameProps = {
  title: string;
  description?: React.ReactNode;
  /** Right-aligned header slot (e.g. a "View report" link). Filters belong above the dashboard, not here. */
  action?: React.ReactNode;
  legend?: React.ReactNode;
  /** The accessible twin of the chart; every chart ships one. */
  table: ChartTableData;
  /** Hold the previous render at reduced opacity while data refetches. */
  refreshing?: boolean;
  /** Replaces the plot when there is no data. */
  empty?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

/**
 * Card that owns a chart's title, legend, table-view toggle and loading hold. The plot area grows
 * with its content (never a fixed height that clips the axis band).
 */
export function ChartFrame({ title, description, action, legend, table, refreshing = false, empty, footer, className, children }: ChartFrameProps) {
  const id = useId();
  const [view, setView] = useState<"chart" | "table">("chart");

  return (
    <Card asChild padding="md" className={cn("min-w-0 gap-4", className)}>
      <figure aria-labelledby={`${id}-title`} data-slot="chart-frame">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 id={`${id}-title`} className="text-title">
              {title}
            </h3>
            {description && <p className="mt-0.5 text-caption text-fg-muted">{description}</p>}
          </div>
          <div className="flex items-center gap-2">
            {action}
            {!empty && (
              <SegmentedControl
                aria-label={`${title}: view as`}
                size="sm"
                value={view}
                onValueChange={(v) => setView(v as "chart" | "table")}
                className="[&_button]:w-8 [&_button]:px-0"
                options={[
                  { value: "chart", label: null, ariaLabel: "Chart", icon: <BarChart3 aria-hidden className="size-icon-sm!" /> },
                  { value: "table", label: null, ariaLabel: "Table", icon: <Table2 aria-hidden className="size-icon-sm!" /> },
                ]}
              />
            )}
          </div>
        </div>

        {empty ? (
          <div className="flex min-h-48 items-center justify-center">{empty}</div>
        ) : view === "chart" ? (
          <div aria-busy={refreshing || undefined} className={cn("flex flex-col gap-3 transition-opacity duration-(--dur-base)", refreshing && "opacity-50")}>
            {legend}
            {children}
          </div>
        ) : (
          <div className="max-h-80 overflow-auto rounded-lg shadow-flat">
            <table className="w-full text-left text-body">
              <caption className="sr-only">{title}</caption>
              <thead className="sticky top-0 bg-surface-sunken text-overline text-fg-muted">
                <tr>
                  {table.columns.map((c, i) => (
                    <th key={c} scope="col" className={cn("h-row-sm px-3 whitespace-nowrap", i > 0 && "text-right")}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {table.rows.map((r, ri) => (
                  <tr key={ri}>
                    {r.map((cell, ci) =>
                      ci === 0 ? (
                        <th key={ci} scope="row" className="h-row-sm px-3 font-normal whitespace-nowrap">
                          {cell}
                        </th>
                      ) : (
                        <td key={ci} className="h-row-sm px-3 text-right whitespace-nowrap figures">
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {footer}
      </figure>
    </Card>
  );
}

export type LegendItem = { label: string; color: string; value?: React.ReactNode; shape?: "rect" | "line" };

/** Legend for ≥2 series. Swatch mirrors the mark (rect for bars/areas, line for lines); text stays in text tokens. */
export function ChartLegend({ items, className }: { items: LegendItem[]; className?: string }) {
  if (items.length < 2) return null;
  return (
    <ul data-slot="chart-legend" className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}>
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-2 text-caption text-fg-muted">
          <span aria-hidden className={cn("shrink-0", it.shape === "line" ? "h-0.5 w-3 rounded-pill" : "size-2.5 rounded-xs")} style={{ background: it.color }} />
          <span className="text-fg">{it.label}</span>
          {it.value !== undefined && <span className="figures">{it.value}</span>}
        </li>
      ))}
    </ul>
  );
}

export type TooltipRow = { label: string; value: string; color?: string; shape?: "rect" | "line" };

/** Floating readout: values lead, labels follow; line keys, not boxes. Positioned by the chart. */
export function ChartTooltip({ title, rows, x, y, containerWidth }: { title: string; rows: TooltipRow[]; x: number; y: number; containerWidth: number }) {
  const flip = x > containerWidth - 180;
  return (
    <div
      role="presentation"
      className="pointer-events-none absolute z-10 min-w-36 rounded-md bg-surface-raised px-3 py-2 text-caption text-fg shadow-popover"
      style={{ left: flip ? undefined : x + 12, right: flip ? containerWidth - x + 12 : undefined, top: Math.max(0, y - 8) }}
    >
      <p className="mb-1 text-fg-muted">{title}</p>
      <ul className="flex flex-col gap-1">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-2">
            {r.color && <span aria-hidden className={cn("shrink-0 rounded-pill", r.shape === "rect" ? "size-2" : "h-0.5 w-3")} style={{ background: r.color }} />}
            <span className="text-body-strong figures">{r.value}</span>
            <span className="text-fg-muted">{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
