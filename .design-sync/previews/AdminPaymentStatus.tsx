import { AdminPaymentStatus } from "@bluesigns/ui";

export const States = () => (
  <div className="flex flex-wrap items-start gap-8">
    <AdminPaymentStatus order={{ payment: "UPI", paymentStatus: "paid" }} />
    <AdminPaymentStatus order={{ payment: "COD", paymentStatus: "pending" }} />
    <AdminPaymentStatus order={{ payment: "Net banking", paymentStatus: "pending" }} />
    <AdminPaymentStatus order={{ payment: "Card", paymentStatus: "refunded" }} />
    <AdminPaymentStatus order={{ payment: "Wallet", paymentStatus: "failed" }} />
  </div>
);

export const InOrderRow = () => (
  <div className="flex items-center justify-between gap-6 rounded-xl bg-surface p-4 shadow-flat" style={{ width: 480 }}>
    <span className="flex flex-col">
      <span className="text-body-strong">LM-200597</span>
      <span className="text-caption text-fg-muted">Ananya Reddy · Bengaluru</span>
    </span>
    <AdminPaymentStatus order={{ payment: "COD", paymentStatus: "pending" }} />
    <span className="text-body-strong figures">₹3,518</span>
  </div>
);
