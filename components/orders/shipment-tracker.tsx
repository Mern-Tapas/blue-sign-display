import { KeyRound, Truck } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { CopyButton } from "@/components/ui/copy-button";
import { Inset } from "@/components/ui/inset";
import { Steps, type StepItem } from "@/components/ui/steps";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import type { Order } from "@/lib/data/types";

const stages = ["Ordered", "Packed", "Shipped", "Out for delivery", "Delivered"] as const;

function stageIndex(order: Order) {
  switch (order.status) {
    case "processing":
      return order.timeline.some((e) => e.status === "Packed" && e.done) ? 1 : 0;
    case "shipped":
      return 2;
    case "out-for-delivery":
      return 3;
    default:
      return 4;
  }
}

export type ShipmentTrackerProps = {
  order: Order;
  /** Courier tracking page for the AWB. */
  trackingUrl?: string;
  className?: string;
};

/**
 * Where the parcel is: Ordered → Packed → Shipped → Out for delivery → Delivered, with the
 * scan time under each reached stage, courier and AWB to copy, and the delivery-OTP reminder on
 * the last mile. Server-safe.
 */
export function ShipmentTracker({ order, trackingUrl, className }: ShipmentTrackerProps) {
  const idx = stageIndex(order);
  const delivered = order.status === "delivered" || order.status === "returned";
  const scanFor = (label: string) => order.timeline.find((e) => e.status.toLowerCase().startsWith(label.toLowerCase().replace("ordered", "order placed")) && e.done);

  const steps: StepItem[] = stages.map((s, i) => {
    const scan = scanFor(s);
    return {
      id: s,
      label: s,
      meta: scan?.date ? formatDate(scan.date, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : i === 4 && order.expectedBy && !delivered ? `By ${formatDate(order.expectedBy, { weekday: "short", day: "numeric", month: "short" })}` : undefined,
    };
  });

  return (
    <section data-slot="shipment-tracker" aria-label="Shipment progress" className={cn("flex flex-col gap-5", className)}>
      <div className="hidden sm:block">
        <Steps steps={steps} current={delivered ? stages.length : idx} size="sm" aria-label="Shipment progress" />
      </div>
      <div className="sm:hidden">
        <Steps steps={steps} current={delivered ? stages.length : idx} size="sm" orientation="vertical" aria-label="Shipment progress" />
      </div>

      {order.status === "out-for-delivery" && (
        <Alert size="sm" tone="accent" role="note" icon={<KeyRound aria-hidden />}>
          Arriving today. Share the delivery OTP sent to your mobile only when the parcel is in your hands.
        </Alert>
      )}

      {order.courier && order.awb && (
        <Inset size="sm" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-body">
          <span className="flex items-center gap-2">
            <Truck aria-hidden className="size-icon-md text-fg-muted" />
            {order.courier}
          </span>
          <span className="flex items-center gap-1 text-fg-muted">
            AWB <span className="text-code text-fg">{order.awb}</span>
            <CopyButton value={order.awb} label="Copy tracking number" size="xs" />
          </span>
          {trackingUrl && (
            <TextLink href={trackingUrl} external className="ml-auto text-label">
              Track on {order.courier}
            </TextLink>
          )}
        </Inset>
      )}
    </section>
  );
}
