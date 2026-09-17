import { CodOption, toast } from "@bluesigns/ui";

const confirm = async () => {
  toast({ title: "Order placed", description: "Pay on delivery", tone: "success" });
};

export const Available = () => (
  <div style={{ maxWidth: 480 }}>
    <CodOption amount={3508} pinEligible pincode="560066" onConfirm={confirm} />
  </div>
);

export const PinNotEligible = () => (
  <div style={{ maxWidth: 480 }}>
    <CodOption amount={3508} pinEligible={false} pincode="600001" onConfirm={confirm} />
  </div>
);

export const OverOrderLimit = () => (
  <div style={{ maxWidth: 480 }}>
    <CodOption amount={64999} pinEligible maxAmount={50000} onConfirm={confirm} />
  </div>
);
