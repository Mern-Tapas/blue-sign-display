import { MetricDelta } from "@bluesigns/ui";

export const Directions = () => (
  <div className="flex flex-col items-start gap-2">
    <MetricDelta value={12.4} period="vs last week" />
    <MetricDelta value={-3.1} period="vs last week" />
    <MetricDelta value={0} period="vs last week" />
  </div>
);

export const LowerIsBetter = () => (
  <div className="flex flex-col items-start gap-2">
    <MetricDelta value={4.2} period="return rate vs last month" goodDirection="down" />
    <MetricDelta value={-2.1} period="RTO (COD) vs last month" goodDirection="down" />
  </div>
);
