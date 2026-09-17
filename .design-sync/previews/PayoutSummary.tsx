import { PayoutSummary, sampleData } from "@bluesigns/ui";

export const WeeklySettlements = () => (
  <div style={{ width: 640 }}>
    <PayoutSummary rows={sampleData.settlements} />
  </div>
);

export const NothingProcessing = () => (
  <div style={{ width: 640 }}>
    <PayoutSummary rows={sampleData.settlements.filter((s) => s.status === "paid")} />
  </div>
);
