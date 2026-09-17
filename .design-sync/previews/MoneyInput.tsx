import { Field, MoneyInput } from "@bluesigns/ui";

export const SellingPrice = () => (
  <div style={{ maxWidth: 280 }}>
    <Field label="Selling price" hint="Includes 18% GST">
      <MoneyInput defaultValue={3999} />
    </Field>
  </div>
);

export const WholeUnits = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 280 }}>
    <Field label="Convenience fee">
      <MoneyInput defaultValue={49} wholeUnits />
    </Field>
    <Field label="Price (US store)">
      <MoneyInput defaultValue={59.99} currency="USD" locale="en-US" />
    </Field>
  </div>
);

export const States = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 280 }}>
    <Field label="Discounted price" error="Can’t be more than the MRP (₹4,999)">
      <MoneyInput defaultValue={5499} />
    </Field>
    <Field label="Refund amount" hint="Set by the payment gateway">
      <MoneyInput defaultValue={1299} disabled />
    </Field>
    <Field label="Minimum order value">
      <MoneyInput placeholder="0.00" />
    </Field>
  </div>
);
