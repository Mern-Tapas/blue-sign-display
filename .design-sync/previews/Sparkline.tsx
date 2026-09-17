import { Card, Sparkline, TrendChip, sampleData } from "@bluesigns/ui";

const { dailySales } = sampleData;
const last14 = dailySales.slice(-14);

export const Default = () => <Sparkline values={last14.map((d) => d.revenue)} width={160} height={40} />;

export const InKpiTile = () => (
  <div style={{ width: 280 }}>
    <Card>
      <p className="text-caption text-fg-muted">Net sales · 14 days</p>
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-heading-sm figures">₹38.6L</p>
          <TrendChip value={9.4} />
        </div>
        <Sparkline values={last14.map((d) => d.revenue)} />
      </div>
    </Card>
  </div>
);

export const Sizes = () => (
  <div className="flex items-end gap-6">
    <Sparkline values={last14.map((d) => d.orders)} width={64} height={24} />
    <Sparkline values={last14.map((d) => d.orders)} />
    <Sparkline values={dailySales.slice(-30).map((d) => d.visitors)} width={200} height={48} />
  </div>
);
