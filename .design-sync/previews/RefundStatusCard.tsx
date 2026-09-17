import { RefundStatusCard } from "@bluesigns/ui";

export const WithYourBank = () => (
  <div style={{ maxWidth: 520 }}>
    <RefundStatusCard refund={{ amount: 4499, destination: "Axis Bank Debit Card •• 7781", status: "processing", initiatedOn: "2026-09-13", expectedBy: "2026-09-20" }} />
  </div>
);

export const Credited = () => (
  <div style={{ maxWidth: 520 }}>
    <RefundStatusCard
      refund={{ amount: 2999, destination: "PhonePe wallet", status: "credited", initiatedOn: "2026-07-14", expectedBy: "2026-07-15", creditedOn: "2026-07-14", reference: "PPW7713920041" }}
    />
  </div>
);

export const JustInitiated = () => (
  <div style={{ maxWidth: 520 }}>
    <RefundStatusCard refund={{ amount: 12999, destination: "HDFC Bank Credit Card •• 4242", status: "initiated", initiatedOn: "2026-09-15", expectedBy: "2026-09-22" }} />
  </div>
);
