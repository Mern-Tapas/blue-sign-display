import { StatusDot } from "@bluesigns/ui";

export const Tones = () => (
  <div className="flex flex-col gap-2">
    <StatusDot tone="success">Delivered</StatusDot>
    <StatusDot tone="info">Shipped</StatusDot>
    <StatusDot tone="warning">Payment pending</StatusDot>
    <StatusDot tone="danger">Cancelled</StatusDot>
    <StatusDot tone="accent">Processing</StatusDot>
    <StatusDot tone="neutral">Draft</StatusDot>
  </div>
);

export const Pill = () => (
  <div className="flex flex-wrap items-center gap-2">
    <StatusDot tone="success" pill>
      Successful
    </StatusDot>
    <StatusDot tone="warning" pill>
      Pending
    </StatusDot>
    <StatusDot tone="danger" pill>
      Failed
    </StatusDot>
  </div>
);

export const Live = () => (
  <div className="flex flex-wrap items-center gap-4">
    <StatusDot tone="success" pulse>
      Store open
    </StatusDot>
    <StatusDot tone="info" pulse pill>
      Out for delivery
    </StatusDot>
    <StatusDot tone="danger" aria-label="Offline" />
  </div>
);
