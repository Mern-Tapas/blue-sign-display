import { ChartFrame, LineChart, SegmentedControl, formatPrice, sampleData } from "@bluesigns/ui";

const { dailySales } = sampleData;
const last30 = dailySales.slice(-30);

export const NetSalesInFrame = () => (
  <div style={{ width: 640 }}>
    <ChartFrame
      title="Net sales"
      description="Daily, last 30 days · demo data"
      action={
        <SegmentedControl
          aria-label="Metric"
          size="sm"
          defaultValue="revenue"
          options={[
            { value: "revenue", label: "Net sales" },
            { value: "orders", label: "Orders" },
          ]}
        />
      }
      table={{ columns: ["Date", "Net sales"], rows: last30.map((d) => [d.label, formatPrice(d.revenue)]) }}
    >
      <LineChart
        labels={last30.map((d) => d.label)}
        series={[{ id: "revenue", label: "Net sales", slot: 0, values: last30.map((d) => d.revenue) }]}
        area
        format="inr"
        summary="Daily net sales for the last 30 days"
      />
    </ChartFrame>
  </div>
);

export const Orders = () => (
  <div style={{ width: 560 }}>
    <LineChart
      labels={last30.map((d) => d.label)}
      series={[{ id: "orders", label: "Orders", slot: 0, values: last30.map((d) => d.orders) }]}
      summary="Daily orders for the last 30 days"
    />
  </div>
);

const last14 = dailySales.slice(-14);
const prev14 = dailySales.slice(-28, -14);

export const ComparePeriods = () => (
  <div style={{ width: 560 }}>
    <LineChart
      labels={last14.map((d) => d.label)}
      series={[
        { id: "now", label: "This fortnight", slot: 0, values: last14.map((d) => d.orders) },
        { id: "prev", label: "Previous", slot: 1, values: prev14.map((d) => d.orders) },
      ]}
      height={200}
      summary="Daily orders this fortnight compared with the previous fortnight"
    />
  </div>
);

export const Visitors90Days = () => (
  <div style={{ width: 560 }}>
    <LineChart
      labels={dailySales.map((d) => d.label)}
      series={[{ id: "visitors", label: "Visitors", slot: 2, values: dailySales.map((d) => d.visitors) }]}
      area
      format="compact"
      height={160}
      endLabels={false}
      summary="Daily store visitors over the last 90 days"
    />
  </div>
);
