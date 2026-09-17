import { KpiRow, KpiTile, sampleData } from "@bluesigns/ui";

const last14 = sampleData.dailySales.slice(-14);

export const StoreKpis = () => (
  <div style={{ width: 640 }}>
    <KpiRow>
      <KpiTile label="Net sales" value="₹1.01Cr" delta={{ value: 9.1, period: "vs previous 30 days" }} trend={last14.map((d) => d.revenue)} href="/admin/reports" />
      <KpiTile label="Orders" value="3,810" delta={{ value: 7.7, period: "vs previous 30 days" }} trend={last14.map((d) => d.orders)} />
      <KpiTile label="Return rate" value="6.4%" delta={{ value: 1.2, period: "vs previous 30 days", goodDirection: "down" }} note="rise is worse" />
      <KpiTile label="RTO (COD)" value="8.9%" delta={{ value: -2.1, period: "vs previous 30 days", goodDirection: "down" }} />
    </KpiRow>
  </div>
);

export const CustomerKpis = () => (
  <div style={{ width: 640 }}>
    <KpiRow>
      <KpiTile label="Customers" value="48" note="in the demo store" />
      <KpiTile label="Repeat rate" value="41.7%" delta={{ value: 3.4, period: "vs last quarter" }} />
      <KpiTile label="Average lifetime value" value="₹18,420" />
      <KpiTile label="At risk" value="6" note="no order in 120+ days" />
    </KpiRow>
  </div>
);
