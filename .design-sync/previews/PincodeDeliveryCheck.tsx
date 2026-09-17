import { useEffect, useRef } from "react";
import { deliveryLocation, PincodeDeliveryCheck, sampleData } from "@bluesigns/ui";

const { lookupPincode } = sampleData;

// Reads the shopper's stored PIN (shared with the header chip); without one it shows the PIN form.
deliveryLocation.set({ pincode: "560066", city: "Bengaluru", state: "Karnataka" });

export const DeliverTo = () => (
  <div style={{ maxWidth: 440 }}>
    <PincodeDeliveryCheck lookup={lookupPincode} productDays={1} />
  </div>
);

export const NoCashOnDelivery = () => (
  <div style={{ maxWidth: 440 }}>
    <PincodeDeliveryCheck lookup={lookupPincode} productDays={3} returnDays={7} codEligible={false} />
  </div>
);

// "Change" swaps the summary for the PIN field (prefilled with the stored PIN).
function Editing() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      const change = [...(ref.current?.querySelectorAll("button") ?? [])].find((b) => b.textContent === "Change");
      change?.click();
    }, 50);
    return () => clearTimeout(t);
  }, []);
  return (
    <div ref={ref} style={{ maxWidth: 440 }}>
      <PincodeDeliveryCheck lookup={lookupPincode} />
    </div>
  );
}

export const ChangePin = () => <Editing />;
