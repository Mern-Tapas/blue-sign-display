import { OrderCustomerCard, sampleData } from "@bluesigns/ui";

const { adminOrders, adminCustomers } = sampleData;

const order = adminOrders[2]!;
const customer = adminCustomers.find((c) => c.id === order.customerId);

export const WithProfile = () => (
  <div style={{ width: 360 }}>
    <OrderCustomerCard order={order} customer={customer} />
  </div>
);

export const WithoutProfile = () => (
  <div style={{ width: 360 }}>
    <OrderCustomerCard order={adminOrders[7]!} />
  </div>
);
