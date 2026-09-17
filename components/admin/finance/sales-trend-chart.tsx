"use client";

import { useState } from "react";
import { CalendarRange } from "lucide-react";
import { ChartFrame, ChartLegend } from "@/components/charts/chart-frame";
import { LineChart } from "@/components/charts/line-chart";
import { slotColor } from "@/components/charts/scales";
import { EmptyState } from "@/components/ui/empty-state";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { inrCompact } from "@/lib/data/admin";
import { formatNumber, formatPrice } from "@/lib/format";
import type { ReportDay } from "./reports-data";

type Metric = "revenue" | "orders";

export type SalesTrendChartProps = {
  days: ReportDay[];
  /** Same-length period before `days`, or null when it falls outside the data. */
  previous: ReportDay[] | null;
  compare: boolean;
  scope: string;
  refreshing?: boolean;
  className?: string;
};

/**
 * Daily net sales or orders on one axis. The metric is a view switch, never a second axis; the
 * previous period (slot 2) is the only other series and only appears when comparison is on.
 */
export function SalesTrendChart({ days, previous, compare, scope, refreshing, className }: SalesTrendChartProps) {
  const [metric, setMetric] = useState<Metric>("revenue");
  const label = metric === "revenue" ? "Net sales" : "Orders";
  const fmt = (v: number) => (metric === "revenue" ? formatPrice(v) : formatNumber(v));
  const showPrev = compare && previous !== null && previous.length === days.length;
  const first = days[0];
  const last = days[days.length - 1];

  const series = [
    { id: "current", label: showPrev ? "Selected period" : label, slot: 0, values: days.map((d) => d[metric]) },
    ...(showPrev ? [{ id: "previous", label: "Previous period", slot: 1, values: previous.map((d) => d[metric]) }] : []),
  ];

  return (
    <ChartFrame
      title="Sales over time"
      description={first && last ? `${label} per day, ${first.label} – ${last.label} · ${scope}` : scope}
      refreshing={refreshing}
      className={className}
      action={
        <SegmentedControl
          aria-label="Metric"
          size="sm"
          value={metric}
          onValueChange={(v) => setMetric(v as Metric)}
          options={[
            { value: "revenue", label: "Net sales" },
            { value: "orders", label: "Orders" },
          ]}
        />
      }
      legend={showPrev ? <ChartLegend items={series.map((s) => ({ label: s.label, color: slotColor(s.slot), shape: "line" as const }))} /> : undefined}
      empty={
        days.length < 2 ? (
          <EmptyState compact icon={<CalendarRange aria-hidden />} title="Pick a longer range" description="A daily trend needs at least two days. Try Last 7 days or Last 30 days." />
        ) : undefined
      }
      table={{
        columns: showPrev ? ["Date", label, "Previous period date", `Previous ${label.toLowerCase()}`] : ["Date", label],
        rows: days.map((d, i) => (showPrev ? [d.label, fmt(d[metric]), previous[i]!.label, fmt(previous[i]![metric])] : [d.label, fmt(d[metric])])),
      }}
    >
      <LineChart
        labels={days.map((d) => d.label)}
        series={series}
        area={!showPrev}
        endLabels={!showPrev}
        format={metric === "revenue" ? "inr" : "number"}
        height={260}
        summary={
          first && last
            ? `${label} per day from ${first.label} to ${last.label}: ${metric === "revenue" ? inrCompact(first.revenue) : formatNumber(first.orders)} on the first day, ${metric === "revenue" ? inrCompact(last.revenue) : formatNumber(last.orders)} on the last.${showPrev ? " Compared with the previous period." : ""}`
            : `${label} per day`
        }
      />
    </ChartFrame>
  );
}
