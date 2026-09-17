import { OrderDetails, sampleData } from "@bluesigns/ui";

const { orders } = sampleData;
const byId = (id: string) => orders.find((o) => o.id === id)!;

export const OutForDelivery = () => (
  <div className="p-4">
    <OrderDetails order={byId("LM-100482")} />
  </div>
);

export const Delivered = () => (
  <div className="p-4">
    <OrderDetails order={byId("LM-100377")} />
  </div>
);

export const ProcessingCashOnDelivery = () => (
  <div className="p-4">
    <OrderDetails order={byId("LM-100251")} />
  </div>
);

export const ReturnedWithRefund = () => (
  <div className="p-4">
    <OrderDetails order={byId("LM-100066")} />
  </div>
);

export const Cancelled = () => (
  <div className="p-4">
    <OrderDetails order={byId("LM-100118")} />
  </div>
);
