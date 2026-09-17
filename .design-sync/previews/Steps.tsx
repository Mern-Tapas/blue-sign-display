import { icons, Steps } from "@bluesigns/ui";

const { PackageCheck, Truck } = icons;

const orderSteps = [
  { id: "ordered", label: "Ordered", meta: "10 Sept, 9:12 AM" },
  { id: "packed", label: "Packed", meta: "10 Sept, 6:40 PM" },
  { id: "shipped", label: "Shipped", meta: "11 Sept, 8:05 AM", icon: <Truck aria-hidden /> },
  { id: "ofd", label: "Out for delivery", meta: "Today, 7:30 AM" },
  { id: "delivered", label: "Delivered", description: "Expected today by 9 PM", icon: <PackageCheck aria-hidden /> },
];

export const OrderProgress = () => (
  <div style={{ maxWidth: 720 }}>
    <Steps aria-label="Order progress" steps={orderSteps} current={3} size="sm" />
  </div>
);

export const ReturnProgress = () => (
  <div style={{ maxWidth: 600 }}>
    <Steps
      aria-label="Return progress"
      current={1}
      steps={[
        { id: "request", label: "Requested" },
        { id: "pickup", label: "Pickup", description: "Tomorrow, 10 AM – 1 PM" },
        { id: "check", label: "Quality check" },
        { id: "refund", label: "Refund" },
      ]}
    />
  </div>
);

export const PaymentError = () => (
  <div style={{ maxWidth: 480 }}>
    <Steps
      aria-label="Payment progress"
      current={1}
      size="sm"
      steps={[
        { id: "placed", label: "Order placed" },
        { id: "pay", label: "Payment", status: "error", description: "UPI request declined" },
        { id: "confirm", label: "Confirmed" },
      ]}
    />
  </div>
);

export const VerticalShipment = () => (
  <div style={{ maxWidth: 360 }}>
    <Steps aria-label="Shipment scans" orientation="vertical" steps={orderSteps} current={3} />
  </div>
);
