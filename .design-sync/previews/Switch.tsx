import { Switch } from "@bluesigns/ui";

export const Settings = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 380 }}>
    <Switch label="Email notifications" description="Order updates and receipts" defaultChecked />
    <Switch label="WhatsApp updates" description="Delivery alerts on +91 98765 43210" />
    <Switch label="Price-drop alerts" description="For items in your wishlist" defaultChecked />
  </div>
);

export const Sizes = () => (
  <div className="flex flex-col gap-3" style={{ maxWidth: 280 }}>
    <Switch label="Small · filter rows" size="sm" defaultChecked />
    <Switch label="Medium · settings" size="md" defaultChecked />
  </div>
);

export const States = () => (
  <div className="flex flex-col gap-3" style={{ maxWidth: 280 }}>
    <Switch label="On" defaultChecked />
    <Switch label="Off" />
    <Switch label="Disabled" disabled />
    <Switch label="Disabled, on" disabled defaultChecked />
    <Switch label="Cash on delivery" aria-invalid />
  </div>
);

export const Standalone = () => (
  <div className="flex items-center gap-4">
    <Switch aria-label="Store open" defaultChecked />
    <Switch aria-label="Store closed" />
  </div>
);
