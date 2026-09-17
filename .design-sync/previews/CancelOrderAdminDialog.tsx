import { CancelOrderAdminDialog, sampleData, toast } from "@bluesigns/ui";

const { adminOrders } = sampleData;

const prepaid = adminOrders.find((o) => o.status === "confirmed" && o.payment !== "COD" && o.paymentStatus === "paid")!;
const cod = adminOrders.find((o) => o.status === "confirmed" && o.payment === "COD")!;

export const PrepaidRefund = () => (
  <CancelOrderAdminDialog
    order={prepaid}
    open
    onOpenChange={() => {}}
    onCancel={(reason) => toast({ title: `${prepaid.id} cancelled`, description: reason, tone: "neutral" })}
  />
);

export const CashOnDelivery = () => (
  <CancelOrderAdminDialog
    order={cod}
    open
    onOpenChange={() => {}}
    onCancel={(reason) => toast({ title: `${cod.id} cancelled`, description: reason, tone: "neutral" })}
  />
);
