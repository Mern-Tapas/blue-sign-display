import { FulfilmentCard, sampleData, toast } from "@bluesigns/ui";

const { adminOrders } = sampleData;
type Order = (typeof adminOrders)[number];

const HOUR = 3600000;
const after = (iso: string, hours: number) => new Date(new Date(iso).getTime() + hours * HOUR).toISOString();

/** When each completed stage happened (the dataset stores only the current status). */
const stageTimes = (o: Order) => ({
  Placed: o.placedAt,
  Confirmed: after(o.placedAt, 0.05),
  Packed: after(o.placedAt, 4),
  Shipped: after(o.placedAt, 20),
  Delivered: after(o.placedAt, 72),
});

const byStatus = (status: Order["status"]) => adminOrders.find((o) => o.status === status)!;

const Fulfilment = ({ order, pickupDate, cancelReason }: { order: Order; pickupDate?: string; cancelReason?: string }) => (
  <div style={{ width: 720 }}>
    <FulfilmentCard
      order={order}
      stageTimes={stageTimes(order)}
      pickupDate={pickupDate}
      cancelReason={cancelReason}
      onMarkPacked={() => toast({ title: `${order.id} marked as packed`, tone: "success" })}
      onShip={() => toast({ title: "Opening ship dialog" })}
      onMarkDelivered={() => toast({ title: `${order.id} marked as delivered`, tone: "success" })}
      onPrintLabel={() => toast({ title: "Shipping label sent to the printer", tone: "success" })}
      onSendPaymentLink={() => toast({ title: "Payment link sent", tone: "success" })}
    />
  </div>
);

export const ToPack = () => <Fulfilment order={byStatus("confirmed")} />;

export const ReadyToShip = () => <Fulfilment order={byStatus("packed")} />;

export const Shipped = () => <Fulfilment order={byStatus("shipped")} pickupDate="2026-09-15" />;

export const Delivered = () => <Fulfilment order={byStatus("delivered")} />;

export const Cancelled = () => <Fulfilment order={byStatus("cancelled")} cancelReason="Customer asked to cancel" />;
