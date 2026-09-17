import { CustomerProfile, sampleData } from "@bluesigns/ui";

const { adminCustomers, adminOrders } = sampleData;

// The customer with the most recent orders in the demo order book, so every card has content.
const counts = adminOrders.reduce<Record<string, number>>((acc, o) => ({ ...acc, [o.customerId]: (acc[o.customerId] ?? 0) + 1 }), {});
const busyId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]![0];
const customer = adminCustomers.find((c) => c.id === busyId) ?? adminCustomers[0]!;

export const ActiveCustomer = () => (
  <div className="flex flex-col gap-6" style={{ width: 1200 }}>
    <CustomerProfile customer={customer} orders={adminOrders.filter((o) => o.customerId === customer.id)} />
  </div>
);
