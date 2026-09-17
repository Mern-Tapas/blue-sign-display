import { Checkbox } from "@bluesigns/ui";

export const States = () => (
  <div className="flex max-w-sm flex-col gap-3">
    <Checkbox label="Subscribe to restock alerts" defaultChecked />
    <Checkbox label="Gift wrap this order" description="Add a handwritten note for ₹49" />
    <Checkbox label="Select all items" checked="indeterminate" />
    <Checkbox label="Save card for faster checkout" disabled />
  </div>
);

export const FilterList = () => (
  <div className="flex flex-col gap-3" style={{ width: 240 }}>
    <Checkbox label="Sonora" trailing={128} defaultChecked />
    <Checkbox label="Northwind" trailing={64} />
    <Checkbox label="Kaveri Craft" trailing={37} defaultChecked />
    <Checkbox label="Urban Loom" trailing={12} />
  </div>
);

export const Sizes = () => (
  <div className="flex items-center gap-6">
    <Checkbox size="sm" label="Small" defaultChecked />
    <Checkbox size="md" label="Medium" defaultChecked />
  </div>
);

export const Invalid = () => (
  <div className="max-w-sm">
    <Checkbox label="I agree to the Terms of Use and Privacy Policy" aria-invalid />
  </div>
);
