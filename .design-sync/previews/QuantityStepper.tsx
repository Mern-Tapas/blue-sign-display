import { useState } from "react";
import { QuantityStepper } from "@bluesigns/ui";

export const Default = () => (
  <div className="flex flex-wrap items-center gap-4">
    <QuantityStepper defaultValue={2} />
    <QuantityStepper defaultValue={1} size="sm" />
  </div>
);

function CartLineQuantity() {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="flex items-center gap-3">
      <QuantityStepper size="sm" value={quantity} onValueChange={setQuantity} removeAtMin onRemove={() => setQuantity(1)} label="Quantity for Thermal Bottle" />
      <span className="text-caption text-fg-muted">Trash icon at the minimum removes the line</span>
    </div>
  );
}

export const RemoveAtMinimum = () => <CartLineQuantity />;

export const Limits = () => (
  <div className="flex flex-col items-start gap-3">
    <div className="flex items-center gap-3">
      <QuantityStepper defaultValue={5} max={5} />
      <span className="text-caption text-fg-muted">Max 5 per order</span>
    </div>
    <div className="flex items-center gap-3">
      <QuantityStepper defaultValue={1} />
      <span className="text-caption text-fg-muted">At minimum</span>
    </div>
  </div>
);

export const Disabled = () => <QuantityStepper defaultValue={3} disabled />;
