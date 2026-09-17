import { Field, FormRow, FormSection, Input, MoneyInput, Switch, TextButton } from "@bluesigns/ui";

export const Card = () => (
  <div style={{ maxWidth: 620 }}>
    <FormSection title="Pricing" description="Prices include GST.">
      <FormRow columns={2}>
        <Field label="MRP">
          <MoneyInput defaultValue={4999} wholeUnits />
        </Field>
        <Field label="Selling price">
          <MoneyInput defaultValue={3999} wholeUnits />
        </Field>
      </FormRow>
    </FormSection>
  </div>
);

export const Split = () => (
  <div style={{ maxWidth: 820 }}>
    <FormSection title="Shipping" description="Orders at or above the threshold ship free." layout="split" divided={false}>
      <Field label="Free delivery above">
        <MoneyInput defaultValue={499} wholeUnits />
      </Field>
      <Switch label="Offer cash on delivery" description="Up to ₹10,000 per order" defaultChecked />
    </FormSection>
  </div>
);

export const WithAction = () => (
  <div style={{ maxWidth: 620 }}>
    <FormSection title="Store details" description="Shown on invoices and the storefront footer." action={<TextButton size="sm">Reset</TextButton>}>
      <Field label="Store name">
        <Input defaultValue="BlueSigns Bengaluru" />
      </Field>
      <Field label="Support email">
        <Input type="email" defaultValue="help@bluesigns.shop" />
      </Field>
    </FormSection>
  </div>
);
