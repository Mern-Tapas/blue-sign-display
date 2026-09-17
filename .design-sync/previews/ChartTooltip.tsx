import { ChartTooltip, Sparkline, sampleData } from "@bluesigns/ui";

const { dailySales } = sampleData;

export const SingleSeries = () => (
  <div className="relative rounded-lg bg-surface p-4 shadow-flat" style={{ width: 360, height: 140 }}>
    <Sparkline values={dailySales.slice(-14).map((d) => d.revenue)} width={320} height={100} />
    <ChartTooltip title="15 Sept" rows={[{ label: "Net sales", value: "₹3,12,480", color: "var(--chart-1)" }]} x={120} y={24} containerWidth={360} />
  </div>
);

export const MultiSeries = () => (
  <div className="relative rounded-lg bg-surface shadow-flat" style={{ width: 360, height: 140 }}>
    <ChartTooltip
      title="Electronics"
      x={40}
      y={20}
      containerWidth={360}
      rows={[
        { label: "Last 30 days", value: "₹31,20,000", color: "var(--chart-1)", shape: "rect" },
        { label: "Previous 30 days", value: "₹28,10,000", color: "var(--chart-2)", shape: "rect" },
      ]}
    />
  </div>
);

export const FlippedAtEdge = () => (
  <div className="relative rounded-lg bg-surface shadow-flat" style={{ width: 360, height: 140 }}>
    <ChartTooltip
      title="Sat 13 Sept"
      x={330}
      y={20}
      containerWidth={360}
      rows={[
        { label: "This fortnight", value: "142 orders", color: "var(--chart-1)" },
        { label: "Previous", value: "118 orders", color: "var(--chart-2)" },
      ]}
    />
  </div>
);
