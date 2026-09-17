"use client";

import { useState } from "react";
import { XCircle } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { Alert } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import type { AdminOrder } from "@/lib/data/admin";
import { formatPrice } from "@/lib/format";

export const cancelReasons = [
  "Customer asked to cancel",
  "Item out of stock",
  "PIN code not serviceable",
  "Suspected fake COD order",
  "Pricing or listing error",
] as const;

export type CancelOrderAdminDialogProps = {
  order: Pick<AdminOrder, "id" | "payment" | "paymentStatus" | "total" | "lines">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: (reason: string) => void;
};

/** Seller-side cancel: a required reason and the refund consequence spelled out before confirming. */
export function CancelOrderAdminDialog({ order, open, onOpenChange, onCancel }: CancelOrderAdminDialogProps) {
  const [reason, setReason] = useState("");
  const units = order.lines.reduce((s, l) => s + l.quantity, 0);

  const refund =
    order.payment === "COD"
      ? { tone: "neutral" as const, title: "Nothing to refund", body: "This is a cash on delivery order, so no money was collected." }
      : order.paymentStatus === "paid"
        ? { tone: "warning" as const, title: `${formatPrice(order.total)} will be refunded`, body: `The refund goes back to the customer’s ${order.payment} source and reaches them in 5–7 working days.` }
        : { tone: "neutral" as const, title: "Nothing to refund", body: "The payment was never completed, so no money was captured." };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setReason("");
        onOpenChange(next);
      }}
      tone="danger"
      icon={<XCircle aria-hidden />}
      title={`Cancel order ${order.id}?`}
      description={`The customer is told by SMS and email, and ${units} ${units === 1 ? "unit goes" : "units go"} back into stock. You can’t undo this.`}
      confirmLabel="Cancel order"
      cancelLabel="Keep order"
      confirmDisabled={!reason}
      onConfirm={() => {
        onCancel(reason);
        setReason("");
      }}
      body={
        <div className="flex flex-col gap-4">
          <Field label="Reason" required hint="Shared with the customer and kept in the order timeline.">
            <Select value={reason} onValueChange={setReason} placeholder="Choose a reason" options={cancelReasons.map((r) => ({ value: r, label: r }))} />
          </Field>
          <Alert tone={refund.tone} size="sm" title={refund.title} role="status">
            {refund.body}
          </Alert>
        </div>
      }
    />
  );
}
