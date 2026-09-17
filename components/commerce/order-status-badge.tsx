import { StatusDot, type StatusTone } from "@/components/ui/status-dot";
import type { OrderStatus } from "@/lib/data/types";

const map: Record<OrderStatus, { tone: StatusTone; label: string; pulse?: boolean }> = {
  processing: { tone: "warning", label: "Processing" },
  shipped: { tone: "info", label: "Shipped" },
  "out-for-delivery": { tone: "accent", label: "Out for delivery", pulse: true },
  delivered: { tone: "success", label: "Delivered" },
  cancelled: { tone: "danger", label: "Cancelled" },
  returned: { tone: "neutral", label: "Returned" },
};

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const s = map[status];
  return (
    <StatusDot tone={s.tone} pulse={s.pulse} pill className={className}>
      {s.label}
    </StatusDot>
  );
}
