import { Button, CustomerOrdersTable, icons, sampleData } from "@bluesigns/ui";

const { BadgePercent } = icons;
const { adminOrders } = sampleData;

// The busiest customer in the demo order book, so the table has several rows.
const counts = adminOrders.reduce<Record<string, number>>((acc, o) => ({ ...acc, [o.customerId]: (acc[o.customerId] ?? 0) + 1 }), {});
const topId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]![0];
const orders = adminOrders.filter((o) => o.customerId === topId);
const firstName = orders[0]!.customerName.split(" ")[0]!;

export const RecentOrders = () => (
  <div style={{ width: 860 }}>
    <CustomerOrdersTable orders={orders} firstName={firstName} />
  </div>
);

export const NoOrders = () => (
  <div style={{ width: 860 }}>
    <CustomerOrdersTable
      orders={[]}
      firstName="Farhan"
      emptyAction={
        <Button variant="secondary" size="sm" leadingIcon={<BadgePercent aria-hidden />}>
          Send a coupon
        </Button>
      }
    />
  </div>
);
