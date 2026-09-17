import { Button, Field, FormRow, Input, MoneyInput, NumberInput, Select } from "@bluesigns/ui";

export const TwoColumns = () => (
  <div style={{ maxWidth: 560 }}>
    <FormRow columns={2}>
      <Field label="City">
        <Input defaultValue="Bengaluru" />
      </Field>
      <Field label="State">
        <Select defaultValue="KA" options={[{ value: "KA", label: "Karnataka" }, { value: "MH", label: "Maharashtra" }]} />
      </Field>
    </FormRow>
  </div>
);

export const Pricing = () => (
  <div style={{ maxWidth: 560 }}>
    <FormRow columns={2}>
      <Field label="Stock on hand">
        <NumberInput defaultValue={12} min={0} max={999} stepper="inline" />
      </Field>
      <Field label="GST rate">
        <NumberInput defaultValue={18} min={0} max={100} suffix="%" />
      </Field>
      <Field label="MRP">
        <MoneyInput defaultValue={4999} wholeUnits />
      </Field>
      <Field label="Selling price">
        <MoneyInput defaultValue={3999} wholeUnits />
      </Field>
    </FormRow>
  </div>
);

export const AlignEnd = () => (
  <div style={{ maxWidth: 560 }}>
    <FormRow columns={2} align="end">
      <Field label="Delivery PIN code">
        <Input defaultValue="560087" inputMode="numeric" />
      </Field>
      <div>
        <Button variant="secondary">Check</Button>
      </div>
    </FormRow>
  </div>
);
