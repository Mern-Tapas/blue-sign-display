import { BarChart, ChartFrame, ChartLegend, SegmentedControl, formatPrice, sampleData } from "@bluesigns/ui";

const { categorySales, returnReasons, weekdays, ordersHeatmap } = sampleData;

const series = [
  { id: "now", label: "Last 30 days", slot: 0, values: categorySales.map((c) => c.revenue) },
  { id: "prev", label: "Previous 30 days", slot: 1, values: categorySales.map((c) => c.lastPeriod) },
];

export const GroupedInFrame = () => (
  <div style={{ width: 680 }}>
    <ChartFrame
      title="Sales by category"
      description="Two series share one axis · demo data"
      action={
        <SegmentedControl
          aria-label="Layout"
          size="sm"
          defaultValue="grouped"
          options={[
            { value: "grouped", label: "Grouped" },
            { value: "stacked", label: "Stacked" },
          ]}
        />
      }
      legend={<ChartLegend items={series.map((s) => ({ label: s.label, color: `var(--chart-${s.slot + 1})` }))} />}
      table={{ columns: ["Category", "Last 30 days", "Previous 30 days"], rows: categorySales.map((c) => [c.label, formatPrice(c.revenue), formatPrice(c.lastPeriod)]) }}
    >
      <BarChart categories={categorySales.map((c) => c.label)} series={series} format="inr" summary="Sales by category, last 30 days vs previous 30 days" />
    </ChartFrame>
  </div>
);

export const Stacked = () => (
  <div style={{ width: 600 }}>
    <BarChart categories={categorySales.map((c) => c.label)} series={series} stacked format="inr-compact" summary="Stacked sales by category for two periods" />
  </div>
);

export const HorizontalWithLabels = () => (
  <div style={{ width: 560 }}>
    <BarChart
      orientation="horizontal"
      valueLabels
      categories={returnReasons.map((r) => r.label)}
      series={[{ id: "returns", label: "Returns", slot: 0, values: returnReasons.map((r) => r.value) }]}
      summary="Return requests by reason, last 30 days"
    />
  </div>
);

const byDay = ordersHeatmap.map((row) => row.reduce((a, b) => a + b, 0));

export const SingleSeries = () => (
  <div style={{ width: 480 }}>
    <BarChart
      categories={weekdays}
      series={[{ id: "orders", label: "Orders", slot: 0, values: byDay }]}
      height={200}
      summary="Orders by weekday, last 30 days"
    />
  </div>
);
