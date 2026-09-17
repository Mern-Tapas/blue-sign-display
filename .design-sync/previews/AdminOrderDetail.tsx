import { AdminOrderDetail, sampleData } from "@bluesigns/ui";

const { adminOrders, adminCustomers } = sampleData;

const packed = adminOrders.find((o) => o.status === "packed")!;
const delivered = adminOrders.find((o) => o.status === "delivered" && o.payment === "COD") ?? adminOrders.find((o) => o.status === "delivered")!;
const customerFor = (id: string) => adminCustomers.find((c) => c.id === id);

export const ReadyToShip = () => (
  <div className="flex flex-col gap-6 bg-canvas p-6" style={{ width: 1200 }}>
    <AdminOrderDetail order={packed} customer={customerFor(packed.customerId)} />
  </div>
);

export const DeliveredCashOnDelivery = () => (
  <div className="flex flex-col gap-6 bg-canvas p-6" style={{ width: 1200 }}>
    <AdminOrderDetail order={delivered} customer={customerFor(delivered.customerId)} />
  </div>
);
