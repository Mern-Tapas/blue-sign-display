"use client";

import { useState } from "react";
import { XCircle } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { rejectReasons } from "./return-records";

export type RejectReturnDialogProps = {
  returnId: string;
  customerName: string;
  onReject: (reason: string) => void;
  disabled?: boolean;
};

/** Rejecting a return is final for the customer, so it needs a stated reason they will see. */
export function RejectReturnDialog({ returnId, customerName, onReject, disabled }: RejectReturnDialogProps) {
  const [reason, setReason] = useState("");
  return (
    <ConfirmDialog
      trigger={
        <Button variant="secondary" disabled={disabled}>
          Reject
        </Button>
      }
      onOpenChange={(open) => !open && setReason("")}
      tone="danger"
      icon={<XCircle aria-hidden />}
      title={`Reject return ${returnId}?`}
      description={`${customerName} is told by SMS and email with the reason below, and can’t request a return for this item again.`}
      confirmLabel="Reject return"
      cancelLabel="Keep reviewing"
      confirmDisabled={!reason}
      onConfirm={() => onReject(reason)}
      body={
        <Field label="Reason" required hint="Shown to the customer.">
          <Select value={reason} onValueChange={setReason} placeholder="Choose a reason" options={rejectReasons.map((r) => ({ value: r, label: r }))} />
        </Field>
      }
    />
  );
}
