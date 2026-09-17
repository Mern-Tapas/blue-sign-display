import { OrderPaymentCard, sampleData } from "@bluesigns/ui";

const { adminOrders } = sampleData;

const withCoupon = adminOrders.find((o) => o.discount > 0 && o.paymentStatus === "paid")!;
const cod = adminOrders.find((o) => o.payment === "COD" && o.paymentStatus === "pending")!;
const refunded = adminOrders.find((o) => o.paymentStatus === "refunded")!;

export const PrepaidWithCoupon = () => (
  <div style={{ width: 380 }}>
    <OrderPaymentCard order={withCoupon} />
  </div>
);

export const CashOnDelivery = () => (
  <div style={{ width: 380 }}>
    <OrderPaymentCard order={cod} />
  </div>
);

export const Refunded = () => (
  <div style={{ width: 380 }}>
    <OrderPaymentCard order={refunded} />
  </div>
);
