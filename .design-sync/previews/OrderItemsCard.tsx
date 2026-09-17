import { OrderItemsCard, sampleData } from "@bluesigns/ui";

const { adminOrders } = sampleData;

const multi = adminOrders.find((o) => o.lines.length >= 3) ?? adminOrders.find((o) => o.lines.length > 1)!;
const single = adminOrders.find((o) => o.lines.length === 1 && o.lines[0]!.size) ?? adminOrders[0]!;

export const MultipleItems = () => (
  <div style={{ width: 720 }}>
    <OrderItemsCard lines={multi.lines} />
  </div>
);

export const SingleItem = () => (
  <div style={{ width: 720 }}>
    <OrderItemsCard lines={single.lines} />
  </div>
);
