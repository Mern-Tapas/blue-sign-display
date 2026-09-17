import { sampleData, ShipOrderDialog, toast } from "@bluesigns/ui";

const { adminOrders } = sampleData;

const order = adminOrders.find((o) => o.status === "packed")!;

export const Default = () => (
  <ShipOrderDialog
    orderId={order.id}
    pincode={order.pincode}
    open
    onOpenChange={() => {}}
    onShip={(d) => toast({ title: `Shipped with ${d.courier}`, description: `AWB ${d.awb}`, tone: "success" })}
  />
);
