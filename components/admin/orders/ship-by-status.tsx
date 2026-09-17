import { AlertTriangle, Clock } from "lucide-react";
import { adminDateTime } from "@/lib/admin-format";
import type { AdminOrder } from "@/lib/data/admin";
import { cn } from "@/lib/cn";
import { isUnshipped, shipByHoursLeft } from "./order-helpers";

export type ShipByStatusProps = {
  order: Pick<AdminOrder, "shipBy" | "status">;
  /** `stacked` puts the deadline under the warning (table cells); `inline` keeps one line. */
  layout?: "stacked" | "inline";
  className?: string;
};

/** Dispatch deadline for unshipped orders. Within 24 h it turns into a worded warning, never colour alone. */
export function ShipByStatus({ order, layout = "stacked", className }: ShipByStatusProps) {
  if (!isUnshipped(order.status)) {
    return <span className={cn("text-caption text-fg-muted", className)}>—<span className="sr-only">Not applicable</span></span>;
  }
  const hours = shipByHoursLeft(order);
  const overdue = hours < 0;
  const risk = hours < 24;
  const when = adminDateTime(order.shipBy);

  if (!risk) {
    const [day, time] = when.split(", ");
    return layout === "stacked" ? (
      <span className={cn("flex flex-col text-caption text-fg-muted figures", className)}>
        <span className="text-body text-fg">{day}</span>
        <span>{time}</span>
      </span>
    ) : (
      <span className={cn("text-caption text-fg-muted figures", className)}>Ship by {when}</span>
    );
  }

  return (
    <span className={cn("inline-flex min-w-0", layout === "stacked" ? "flex-col" : "flex-wrap items-center gap-x-2", className)}>
      <span className={cn("inline-flex items-center gap-1 text-caption-strong figures", overdue ? "text-danger-fg" : "text-warning-fg")}>
        {overdue ? <AlertTriangle aria-hidden className="size-icon-sm" /> : <Clock aria-hidden className="size-icon-sm" />}
        {overdue ? `Overdue by ${Math.abs(hours)} h` : `Ship in ${hours} h`}
      </span>
      <span className="text-caption text-fg-muted figures">by {when}</span>
    </span>
  );
}
