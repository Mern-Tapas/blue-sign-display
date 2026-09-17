import { BarChart, ChartLegend, LineChart, sampleData } from "@bluesigns/ui";

const { categorySales, dailySales } = sampleData;

export const WithBarChart = () => (
  <div className="flex flex-col gap-3" style={{ width: 560 }}>
    <ChartLegend
      items={[
        { label: "Last 30 days", color: "var(--chart-1)" },
        { label: "Previous 30 days", color: "var(--chart-2)" },
      ]}
    />
    <BarChart
      categories={categorySales.map((c) => c.label)}
      series={[
        { id: "now", label: "Last 30 days", slot: 0, values: categorySales.map((c) => c.revenue) },
        { id: "prev", label: "Previous 30 days", slot: 1, values: categorySales.map((c) => c.lastPeriod) },
      ]}
      format="inr"
      height={200}
      summary="Sales by category for two periods"
    />
  </div>
);

const last14 = dailySales.slice(-14);
const prev14 = dailySales.slice(-28, -14);

export const LineKeys = () => (
  <div className="flex flex-col gap-3" style={{ width: 560 }}>
    <ChartLegend
      items={[
        { label: "This fortnight", color: "var(--chart-1)", shape: "line" },
        { label: "Previous fortnight", color: "var(--chart-2)", shape: "line" },
      ]}
    />
    <LineChart
      labels={last14.map((d) => d.label)}
      series={[
        { id: "now", label: "This fortnight", slot: 0, values: last14.map((d) => d.orders) },
        { id: "prev", label: "Previous", slot: 1, values: prev14.map((d) => d.orders) },
      ]}
      height={180}
      endLabels={false}
      summary="Orders this fortnight vs previous"
    />
  </div>
);

export const WithValues = () => (
  <ChartLegend
    items={[
      { label: "UPI", color: "var(--chart-1)", value: "46%" },
      { label: "Cash on Delivery", color: "var(--chart-2)", value: "24%" },
      { label: "Cards", color: "var(--chart-3)", value: "19%" },
      { label: "Net banking", color: "var(--chart-4)", value: "5%" },
      { label: "Wallets & EMI", color: "var(--chart-5)", value: "6%" },
    ]}
  />
);
