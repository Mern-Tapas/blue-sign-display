import { Badge } from "@/components/ui/badge";
import type { AdminOrder } from "@/lib/data/admin";
import { cn } from "@/lib/cn";
import { paymentBadge } from "./order-helpers";

/** Payment mode with its collection state; COD still to collect is a warning badge, not a footnote. */
export function PaymentStatus({ order, className }: { order: Pick<AdminOrder, "payment" | "paymentStatus">; className?: string }) {
  const badge = paymentBadge(order);
  return (
    <span className={cn("inline-flex flex-col items-start gap-1", className)}>
      <span className="text-body">{order.payment}</span>
      <Badge tone={badge.tone} size="sm">
        {badge.label}
      </Badge>
    </span>
  );
}
