import { Card, SettlementBreakdown, sampleData } from "@bluesigns/ui";

const { settlements } = sampleData;

export const PaidCycle = () => (
  <Card padding="md" className="gap-5" style={{ width: 400 }}>
    <SettlementBreakdown settlement={settlements.find((s) => s.status === "paid")!} />
  </Card>
);

export const Processing = () => (
  <Card padding="md" className="gap-5" style={{ width: 400 }}>
    <SettlementBreakdown settlement={settlements.find((s) => s.status === "processing")!} />
  </Card>
);

export const OnHold = () => (
  <Card padding="md" className="gap-5" style={{ width: 400 }}>
    <SettlementBreakdown settlement={settlements.find((s) => s.status === "on-hold")!} />
  </Card>
);
