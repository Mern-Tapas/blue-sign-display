import { OrderAddressCard, sampleData } from "@bluesigns/ui";

const { adminOrders } = sampleData;

export const Default = () => (
  <div style={{ width: 360 }}>
    <OrderAddressCard order={adminOrders[0]!} />
  </div>
);

export const SideBySide = () => (
  <div className="grid grid-cols-2 gap-4" style={{ width: 740 }}>
    <OrderAddressCard order={adminOrders[5]!} />
    <OrderAddressCard order={adminOrders[9]!} />
  </div>
);
