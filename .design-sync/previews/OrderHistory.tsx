import { OrderHistory, sampleData } from "@bluesigns/ui";

const { orders } = sampleData;

export const WithTracking = () => (
  <div style={{ maxWidth: 720 }}>
    <OrderHistory orders={orders} activeId={orders[0]!.id} hrefFor={(o) => `/account/orders/${o.id}`} />
  </div>
);

export const Plain = () => (
  <div style={{ maxWidth: 720 }}>
    <OrderHistory orders={orders.slice(1, 4)} />
  </div>
);

export const SingleOrder = () => (
  <div style={{ maxWidth: 720 }}>
    <OrderHistory orders={[orders[1]!]} hrefFor={(o) => `/account/orders/${o.id}`} />
  </div>
);
