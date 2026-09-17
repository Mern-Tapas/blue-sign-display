import { Field, Input, SettingsSection, Switch } from "@bluesigns/ui";

export const OrderNotifications = () => (
  <div style={{ maxWidth: 960 }}>
    <SettingsSection title="Order notifications" description="Who hears about new orders and when.">
      <Switch label="Email me for every new order" description="Sent to sujon@bluesigns.shop" defaultChecked />
      <Switch label="WhatsApp alert for orders above ₹10,000" />
    </SettingsSection>
  </div>
);

export const StoreProfile = () => (
  <div style={{ maxWidth: 960 }}>
    <SettingsSection title="Store profile" description="Shown on invoices, order emails and the storefront footer.">
      <Field label="Store name">
        <Input defaultValue="BlueSigns" />
      </Field>
      <Field label="GSTIN" hint="Printed on every tax invoice">
        <Input defaultValue="29ABCDE1234F1Z5" />
      </Field>
      <Field label="Support email">
        <Input type="email" defaultValue="support@bluesigns.shop" />
      </Field>
    </SettingsSection>
  </div>
);
