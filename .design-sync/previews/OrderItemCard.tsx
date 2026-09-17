import { OrderItemCard, sampleData } from "@bluesigns/ui";

const { orders } = sampleData;
const byId = (id: string) => orders.find((o) => o.id === id)!;
const today = "2026-09-15";

export const OutForDeliveryMultiItem = () => (
  <div style={{ maxWidth: 520 }}>
    <OrderItemCard order={byId("LM-100482")} today={today} detailsHref="/account/orders/LM-100482" />
  </div>
);

export const DeliveredReturnOpen = () => (
  <div style={{ maxWidth: 520 }}>
    <OrderItemCard order={byId("LM-100377")} today={today} detailsHref="/account/orders/LM-100377" />
  </div>
);

export const DeliveredReturnClosed = () => (
  <div style={{ maxWidth: 520 }}>
    <OrderItemCard order={byId("LM-100377")} today="2026-10-02" detailsHref="/account/orders/LM-100377" />
  </div>
);

export const Processing = () => (
  <div style={{ maxWidth: 520 }}>
    <OrderItemCard order={byId("LM-100251")} today={today} detailsHref="/account/orders/LM-100251" />
  </div>
);

export const CancelledRefunded = () => (
  <div style={{ maxWidth: 520 }}>
    <OrderItemCard order={byId("LM-100118")} today={today} detailsHref="/account/orders/LM-100118" />
  </div>
);

export const ReturnedRefundInProgress = () => (
  <div style={{ maxWidth: 520 }}>
    <OrderItemCard order={byId("LM-100066")} today={today} detailsHref="/account/orders/LM-100066" />
  </div>
);
