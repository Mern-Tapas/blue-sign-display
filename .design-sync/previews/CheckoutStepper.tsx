import { useState } from "react";
import { CheckoutStepper } from "@bluesigns/ui";

const steps = [
  { id: "bag", label: "Bag" },
  { id: "address", label: "Address" },
  { id: "payment", label: "Payment" },
];

export const AddressStep = () => (
  <div className="rounded-xl bg-canvas p-4" style={{ maxWidth: 640 }}>
    <CheckoutStepper steps={steps} current={1} />
  </div>
);

export const Progression = () => (
  <div className="flex flex-col gap-3 rounded-xl bg-canvas p-4" style={{ maxWidth: 640 }}>
    <CheckoutStepper steps={steps} current={0} />
    <CheckoutStepper steps={steps} current={1} />
    <CheckoutStepper steps={steps} current={2} />
  </div>
);

export const ClickableCompletedSteps = () => {
  const [step, setStep] = useState(2);
  return (
    <div className="rounded-xl bg-canvas p-4" style={{ maxWidth: 640 }}>
      <CheckoutStepper steps={steps} current={step} onStepClick={setStep} />
    </div>
  );
};

export const FourSteps = () => (
  <div className="rounded-xl bg-canvas p-4" style={{ maxWidth: 720 }}>
    <CheckoutStepper
      steps={[
        { id: "bag", label: "Bag" },
        { id: "address", label: "Address" },
        { id: "delivery", label: "Delivery slot" },
        { id: "payment", label: "Payment" },
      ]}
      current={2}
    />
  </div>
);
