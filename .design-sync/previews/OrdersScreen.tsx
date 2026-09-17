import { OrdersScreen } from "@bluesigns/ui";

export const AllOrders = () => (
  <div className="flex flex-col gap-6 bg-canvas p-6" style={{ width: 1200 }}>
    <OrdersScreen initialTab="all" initialSlaRisk={false} />
  </div>
);

export const ToPackQueue = () => (
  <div className="flex flex-col gap-6 bg-canvas p-6" style={{ width: 1200 }}>
    <OrdersScreen initialTab="to-pack" initialSlaRisk={false} />
  </div>
);
