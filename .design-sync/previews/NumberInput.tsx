import { Field, NumberInput } from "@bluesigns/ui";

export const Stepper = () => (
  <div style={{ maxWidth: 240 }}>
    <Field label="Stock on hand" hint="↑ ↓ to step · Shift for ten">
      <NumberInput defaultValue={12} min={0} max={999} stepper="inline" />
    </Field>
  </div>
);

export const Adornments = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 240 }}>
    <Field label="GST rate">
      <NumberInput defaultValue={18} min={0} max={100} suffix="%" />
    </Field>
    <Field label="Package weight">
      <NumberInput defaultValue={0.45} precision={2} step={0.05} suffix="kg" />
    </Field>
  </div>
);

export const States = () => (
  <div className="flex flex-col gap-3" style={{ maxWidth: 240 }}>
    <NumberInput aria-label="Quantity" defaultValue={4} />
    <NumberInput aria-label="Weight" defaultValue={-2} aria-invalid />
    <NumberInput aria-label="Quantity locked" defaultValue={4} disabled stepper="inline" />
  </div>
);
