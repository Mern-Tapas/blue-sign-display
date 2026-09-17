import { useEffect, useState } from "react";
import { AddressDialog, sampleData, toast } from "@bluesigns/ui";

const { addresses } = sampleData;

// Radix focuses the first field on open; blur it so the preview shows the resting state.
function useBlurOnOpen() {
  useEffect(() => {
    const t = setTimeout(() => (document.activeElement as HTMLElement | null)?.blur(), 120);
    return () => clearTimeout(t);
  }, []);
}

export const EditAddress = () => {
  const [open, setOpen] = useState(true);
  useBlurOnOpen();
  return (
    <AddressDialog
      open={open}
      onOpenChange={setOpen}
      address={addresses[0]}
      onSave={(value) => toast({ title: "Address updated", description: `${value.city} ${value.pincode}`, tone: "success" })}
    />
  );
};

export const AddNewAddress = () => {
  const [open, setOpen] = useState(true);
  useBlurOnOpen();
  return (
    <AddressDialog
      open={open}
      onOpenChange={setOpen}
      onSave={(value) => toast({ title: "Address added", description: `${value.city} ${value.pincode}`, tone: "success" })}
    />
  );
};
