"use client";

import { BarChart } from "@/components/charts/bar-chart";
import { ChartFrame } from "@/components/charts/chart-frame";
import { TextLink } from "@/components/ui/text-link";
import { returnReasons } from "@/lib/data/admin";
import { formatNumber } from "@/lib/format";

/** Why items come back, largest first: one series, one colour, values at the bar ends. */
export function ReturnReasonsChart({ className }: { className?: string }) {
  const rows = [...returnReasons].sort((a, b) => b.value - a.value);
  const total = rows.reduce((s, r) => s + r.value, 0);
  const sizing = rows.filter((r) => r.id === "small" || r.id === "large").reduce((s, r) => s + r.value, 0);

  return (
    <ChartFrame
      title="Top return reasons"
      description={`Last 30 days · ${formatNumber(total)} returns`}
      action={<TextLink href="/admin/reports" size="sm">Reports</TextLink>}
      className={className}
      table={{ columns: ["Reason", "Returns", "Share"], rows: rows.map((r) => [r.label, formatNumber(r.value), `${Math.round((r.value / total) * 100)}%`]) }}
      footer={<p className="text-caption text-fg-muted">Sizing causes {Math.round((sizing / total) * 100)}% of returns. A size chart on apparel pages is the biggest lever.</p>}
    >
      <BarChart
        orientation="horizontal"
        categories={rows.map((r) => r.label)}
        series={[{ id: "returns", label: "Returns", slot: 0, values: rows.map((r) => r.value) }]}
        format="number"
        valueLabels
        summary={`Return reasons over the last 30 days. ${rows.map((r) => `${r.label}: ${r.value}`).join(", ")}.`}
      />
    </ChartFrame>
  );
}
