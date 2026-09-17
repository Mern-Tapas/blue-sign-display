import { OrdersView, sampleData } from "@bluesigns/ui";

const { orders } = sampleData;

export const AllOrders = () => (
  <div className="rounded-xl bg-canvas p-4">
    <OrdersView orders={orders} detailsHref={(o) => `/account/orders/${o.id}`} />
  </div>
);

export const PastOrdersOnly = () => (
  <div className="rounded-xl bg-canvas p-4" style={{ maxWidth: 560 }}>
    <OrdersView orders={orders.filter((o) => o.status !== "out-for-delivery" && o.status !== "processing")} />
  </div>
);

export const NoOrders = () => (
  <div className="rounded-xl bg-canvas p-4" style={{ maxWidth: 560 }}>
    <OrdersView orders={[]} />
  </div>
);
