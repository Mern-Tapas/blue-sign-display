import { StatusPill } from "@bluesigns/ui";

export const OrderStatuses = () => (
  <div className="flex flex-wrap items-center gap-2">
    <StatusPill tone="warning" label="Payment pending" />
    <StatusPill tone="info" label="To pack" />
    <StatusPill tone="accent" label="Out for delivery" live />
    <StatusPill tone="success" label="Delivered" />
    <StatusPill tone="danger" label="RTO" />
    <StatusPill tone="neutral" label="Cancelled" />
  </div>
);

export const SettlementStatuses = () => (
  <div className="flex flex-wrap items-center gap-2">
    <StatusPill tone="accent" label="Processing" live />
    <StatusPill tone="success" label="Paid" />
    <StatusPill tone="warning" label="On hold" />
    <StatusPill tone="success" label="Filed" />
    <StatusPill tone="info" label="Draft" />
  </div>
);
