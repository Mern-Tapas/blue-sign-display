import { sampleData, TopCitiesTable } from "@bluesigns/ui";

type CityRow = { city: string; state: string; orders: number; revenue: number; aov: number; codShare: number };

/** Revenue per city from the demo order book, cancelled orders excluded. */
const cityRows: CityRow[] = Object.values(
  sampleData.adminOrders
    .filter((o) => o.status !== "cancelled")
    .reduce<Record<string, { city: string; state: string; orders: number; revenue: number; cod: number }>>((acc, o) => {
      const row = acc[o.city] ?? { city: o.city, state: o.state, orders: 0, revenue: 0, cod: 0 };
      acc[o.city] = { ...row, orders: row.orders + 1, revenue: row.revenue + o.total, cod: row.cod + (o.payment === "COD" ? 1 : 0) };
      return acc;
    }, {}),
).map((r) => ({ city: r.city, state: r.state, orders: r.orders, revenue: r.revenue, aov: Math.round(r.revenue / r.orders), codShare: (r.cod / r.orders) * 100 }));

export const ByRevenue = () => (
  <div style={{ width: 640 }}>
    <TopCitiesTable rows={cityRows} onReset={() => {}} />
  </div>
);

export const NoOrdersInRange = () => (
  <div style={{ width: 640 }}>
    <TopCitiesTable rows={[]} onReset={() => {}} />
  </div>
);
