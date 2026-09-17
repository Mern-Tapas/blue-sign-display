"use client";

import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import type { Address } from "@/lib/data/types";
import { AddressForm, type AddressFormValue } from "./address-form";

export type AddressDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present when editing. */
  address?: Address;
  onSave: (value: AddressFormValue, id?: string) => void;
};

/** Add or edit a delivery address in a dialog; the form's submit button lives in the footer. */
export function AddressDialog({ open, onOpenChange, address, onSave }: AddressDialogProps) {
  const formId = `address-dialog-${useId()}`;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader title={address ? "Edit address" : "Add a new address"} description="Deliveries and invoices use this address." />
        <DialogBody>
          {open && (
            <AddressForm
              id={formId}
              defaultValue={address ? { ...address, landmark: address.landmark ?? "", isDefault: Boolean(address.isDefault), alternateMobile: "" } : undefined}
              onSubmit={(value) => {
                onSave(value, address?.id);
                onOpenChange(false);
              }}
            />
          )}
        </DialogBody>
        <DialogFooter className="border-t border-border-subtle pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={formId}>
            {address ? "Save changes" : "Save address"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
