"use client";

import { CheckCircle2, PackageCheck, Printer, Send, Truck } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { DescriptionList } from "@/components/ui/description-list";
import { Inset } from "@/components/ui/inset";
import { Steps, type StepItem } from "@/components/ui/steps";
import { adminDate, adminRelative } from "@/lib/admin-format";
import { ADMIN_TODAY, type AdminOrder } from "@/lib/data/admin";
import { formatPrice } from "@/lib/format";
import { fulfilmentIndex, fulfilmentSteps } from "./order-helpers";
import { ShipByStatus } from "./ship-by-status";

export type FulfilmentCardProps = {
  order: AdminOrder;
  /** ISO time each completed stage happened, keyed by step label. */
  stageTimes: Partial<Record<(typeof fulfilmentSteps)[number], string>>;
  pickupDate?: string;
  cancelReason?: string;
  busy?: "packed" | "delivered" | null;
  onMarkPacked: () => void;
  onShip: () => void;
  onMarkDelivered: () => void;
  onPrintLabel: () => void;
  onSendPaymentLink: () => void;
};

/** Where the order is (Placed → Delivered) and the one thing to do next. */
export function FulfilmentCard({ order, stageTimes, pickupDate, cancelReason, busy, onMarkPacked, onShip, onMarkDelivered, onPrintLabel, onSendPaymentLink }: FulfilmentCardProps) {
  const { status } = order;
  const current = fulfilmentIndex(status);
  const time = (iso?: string) => (iso ? adminRelative(iso, ADMIN_TODAY) : undefined);

  const steps: StepItem[] = fulfilmentSteps.map((label, i) => {
    if (status === "cancelled" && i === 1) return { id: label, label: "Cancelled", status: "error" };
    if (status === "rto" && i === 4) return { id: label, label: "RTO", description: "Returned to origin", status: "error" };
    return {
      id: label,
      label,
      meta: i < current ? time(stageTimes[label]) : undefined,
      description: i === current && status === "pending" ? "Awaiting payment" : i === current && status === "out-for-delivery" ? "Out for delivery" : undefined,
    };
  });

  const shipment = order.courier && (
    <Inset size="sm">
      <DescriptionList
        size="sm"
        items={[
          { term: "Courier", description: order.courier },
          { term: "AWB", description: <span className="text-code">{order.awb}</span>, action: <CopyButton value={order.awb ?? ""} label="Copy AWB" size="xs" /> },
          ...(pickupDate ? [{ term: "Pickup", description: adminDate(pickupDate) }] : []),
        ]}
      />
    </Inset>
  );

  let next: React.ReactNode = null;
  switch (status) {
    case "pending":
      next = (
        <>
          <Alert tone="warning" size="sm" role="status">
            Waiting for the customer to finish their {order.payment} payment. The order moves to To pack once it’s paid.
          </Alert>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" leadingIcon={<Send aria-hidden />} onClick={onSendPaymentLink}>
              Send payment link
            </Button>
          </div>
        </>
      );
      break;
    case "confirmed":
      next = (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <Button leadingIcon={<PackageCheck aria-hidden />} onClick={onMarkPacked} loading={busy === "packed"}>
            Mark as packed
          </Button>
          <ShipByStatus order={order} layout="inline" />
        </div>
      );
      break;
    case "packed":
      next = (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <Button leadingIcon={<Truck aria-hidden />} onClick={onShip}>
            Ship order
          </Button>
          <Button variant="secondary" leadingIcon={<Printer aria-hidden />} onClick={onPrintLabel}>
            Print shipping label
          </Button>
          <ShipByStatus order={order} layout="inline" />
        </div>
      );
      break;
    case "shipped":
    case "out-for-delivery":
      next = (
        <>
          {shipment}
          <div className="flex flex-wrap gap-2">
            <Button leadingIcon={<CheckCircle2 aria-hidden />} onClick={onMarkDelivered} loading={busy === "delivered"}>
              Mark as delivered
            </Button>
          </div>
          {order.payment === "COD" && order.paymentStatus === "pending" && <p className="text-caption text-fg-muted">The courier collects {formatPrice(order.total)} in cash on delivery.</p>}
        </>
      );
      break;
    case "delivered":
      next = (
        <>
          <Alert tone="success" size="sm">
            Delivered {time(stageTimes.Delivered)?.replace(/^(Today|Yesterday)/, (m) => m.toLowerCase()) ?? ""}. The return window closes 7 days after delivery.
          </Alert>
          {shipment}
        </>
      );
      break;
    case "cancelled":
      next = (
        <Alert tone="neutral" size="sm" title="Order cancelled">
          {cancelReason ? `${cancelReason}. ` : ""}
          {order.paymentStatus === "refunded" ? `${formatPrice(order.total)} refunded to the customer’s ${order.payment} source (5–7 working days).` : "Nothing was charged, so there is nothing to refund."}
        </Alert>
      );
      break;
    case "rto":
      next = (
        <>
          <Alert tone="danger" size="sm" title="Returned to origin">
            The courier returned this parcel after 3 failed delivery attempts. Check the items and restock them when it arrives.
          </Alert>
          {shipment}
        </>
      );
      break;
    case "returned":
      next = (
        <Alert tone="neutral" size="sm" title="Returned by customer">
          The items came back after delivery and {formatPrice(order.total)} was refunded.
        </Alert>
      );
      break;
  }

  return (
    <Card padding="md" className="gap-5">
      <CardHeader title="Fulfilment" description={status === "cancelled" || status === "rto" || status === "returned" ? "This order is closed." : "Pack before the ship-by time to keep your dispatch rating."} />
      <Steps steps={steps} current={current} size="sm" aria-label="Fulfilment progress" className="max-sm:hidden" />
      <Steps steps={steps} current={current} size="sm" orientation="vertical" aria-label="Fulfilment progress" className="sm:hidden" />
      {next && <div className="flex flex-col gap-3">{next}</div>}
    </Card>
  );
}
