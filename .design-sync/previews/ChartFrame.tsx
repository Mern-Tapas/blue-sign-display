import { Button, ChartFrame, EmptyState, Funnel, LineChart, ShareBar, TextButton, formatNumber, icons, sampleData } from "@bluesigns/ui";

const { ChartNoAxesColumn } = icons;
const { dailySales, conversionFunnel, paymentMix } = sampleData;
const last30 = dailySales.slice(-30);

export const WithLineChart = () => (
  <div style={{ width: 620 }}>
    <ChartFrame
      title="Orders"
      description="Daily, last 30 days · demo data"
      action={<TextButton size="sm">View report</TextButton>}
      table={{ columns: ["Date", "Orders"], rows: last30.map((d) => [d.label, String(d.orders)]) }}
    >
      <LineChart labels={last30.map((d) => d.label)} series={[{ id: "orders", label: "Orders", slot: 0, values: last30.map((d) => d.orders) }]} area summary="Daily orders, last 30 days" />
    </ChartFrame>
  </div>
);

export const FunnelFrame = () => (
  <div style={{ width: 520 }}>
    <ChartFrame
      title="Conversion funnel"
      description="Ordinal ramp; counts and step conversion always visible"
      table={{ columns: ["Stage", "Count"], rows: conversionFunnel.map((s) => [s.label, formatNumber(s.value)]) }}
    >
      <Funnel label="Conversion funnel" stages={conversionFunnel} format="compact" />
    </ChartFrame>
  </div>
);

const payment = paymentMix.map((p) => ({ ...p, value: Math.round(p.value * 9140) }));

export const Refreshing = () => (
  <div style={{ width: 520 }}>
    <ChartFrame
      title="Payment mix"
      description="Share of orders · refreshing"
      refreshing
      table={{ columns: ["Method", "Orders"], rows: payment.map((p) => [p.label, formatNumber(p.value)]) }}
    >
      <ShareBar label="Payment mix" segments={payment} />
    </ChartFrame>
  </div>
);

export const Empty = () => (
  <div style={{ width: 520 }}>
    <ChartFrame
      title="Net sales"
      description="Koramangala store · last 7 days"
      table={{ columns: ["Date", "Net sales"], rows: [] }}
      empty={
        <EmptyState
          compact
          icon={<ChartNoAxesColumn aria-hidden />}
          title="No sales yet"
          description="Sales appear here once your first order is paid."
          action={
            <Button size="sm" variant="secondary">
              Share store link
            </Button>
          }
        />
      }
      footer={<p className="text-caption text-fg-muted">Last synced just now</p>}
    >
      <div />
    </ChartFrame>
  </div>
);
