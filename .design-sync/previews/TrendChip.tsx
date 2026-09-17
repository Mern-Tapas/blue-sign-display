import { Card, CardHeader, PriceDisplay, TrendChip } from "@bluesigns/ui";

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-3">
    <TrendChip value={12.8} />
    <TrendChip value={-5.2} />
    <TrendChip value={17.8} variant="solid" />
    <TrendChip value={-3.1} variant="solid" />
    <TrendChip value={2.4} variant="plain" />
    <TrendChip value={-0.8} variant="plain" />
  </div>
);

export const WithCaption = () => (
  <div className="flex flex-col items-start gap-3">
    <TrendChip value={12.8} caption="vs last month" />
    <TrendChip value={-4.6} caption="vs last week" />
    <TrendChip value={2.4} variant="plain" caption="from last month" />
  </div>
);

export const InKpiCards = () => (
  <div className="grid grid-cols-2 gap-4" style={{ width: 600 }}>
    <Card>
      <CardHeader title="Net sales" description="Last 30 days" />
      <PriceDisplay amount={1842300} size="xl" />
      <TrendChip value={12.8} caption="vs previous 30 days" />
    </Card>
    <Card variant="accent">
      <CardHeader title="Avg. order value" description="Last 30 days" />
      <p className="text-figure-xl figures">₹2,614</p>
      <TrendChip value={-0.6} variant="solid" caption="vs previous 30 days" />
    </Card>
  </div>
);
