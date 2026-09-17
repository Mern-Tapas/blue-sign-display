import { CustomerSpendCard, sampleData } from "@bluesigns/ui";

const { adminOrders } = sampleData;
const counted = adminOrders.filter((o) => !["cancelled", "returned", "rto"].includes(o.status));
const monthOf = (iso: string) => new Date(iso).getMonth();
const ids = [...new Set(counted.map((o) => o.customerId))];
const byCustomer = (id: string) => adminOrders.filter((o) => o.customerId === id);
const monthsFor = (id: string) => new Set(counted.filter((o) => o.customerId === id).map((o) => monthOf(o.placedAt))).size;

// A customer whose orders span two or more months (bar chart) and one with a single month (figure).
const multiId = [...ids].sort((a, b) => monthsFor(b) - monthsFor(a) || byCustomer(b).length - byCustomer(a).length)[0]!;
const singleId = ids.find((id) => monthsFor(id) === 1)!;
const multi = byCustomer(multiId);
const single = byCustomer(singleId);

export const MonthlyChart = () => (
  <div style={{ width: 400 }}>
    <CustomerSpendCard orders={multi} firstName={multi[0]!.customerName.split(" ")[0]!} />
  </div>
);

export const SingleMonth = () => (
  <div style={{ width: 400 }}>
    <CustomerSpendCard orders={single} firstName={single[0]!.customerName.split(" ")[0]!} />
  </div>
);

export const NoSpend = () => (
  <div style={{ width: 400 }}>
    <CustomerSpendCard orders={[]} firstName="Farhan" />
  </div>
);
