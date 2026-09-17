import { KpiTile, sampleData } from "@bluesigns/ui";

const last14 = sampleData.dailySales.slice(-14);

export const WithTrend = () => (
  <div style={{ width: 280 }}>
    <KpiTile label="Net sales" value="₹1.01Cr" delta={{ value: 9.1, period: "vs previous 30 days" }} trend={last14.map((d) => d.revenue)} href="/admin/reports" />
  </div>
);

export const LowerIsBetter = () => (
  <div style={{ width: 280 }}>
    <KpiTile label="Return rate" value="6.4%" delta={{ value: 1.2, period: "vs previous 30 days", goodDirection: "down" }} note="rise is worse" />
  </div>
);

export const WithNote = () => (
  <div style={{ width: 280 }}>
    <KpiTile label="Next payout" value="₹6,84,210" note="STL-2609 · processing, expected 17 Sep" />
  </div>
);
