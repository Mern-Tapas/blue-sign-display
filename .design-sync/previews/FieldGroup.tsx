import { Checkbox, FieldGroup, Radio, RadioGroup } from "@bluesigns/ui";

export const Radios = () => (
  <div style={{ maxWidth: 360 }}>
    <FieldGroup legend="Product type" hint="Changes which fields appear below.">
      <RadioGroup defaultValue="simple">
        <Radio value="simple" label="Simple" description="One price, one SKU" />
        <Radio value="variable" label="With variants" description="Size or colour options" />
      </RadioGroup>
    </FieldGroup>
  </div>
);

export const Invalid = () => (
  <div style={{ maxWidth: 360 }}>
    <FieldGroup legend="Product type" error="Choose how this product is sold." required>
      <RadioGroup>
        <Radio value="simple" label="Simple" description="One price, one SKU" />
        <Radio value="variable" label="With variants" description="Size or colour options" />
      </RadioGroup>
    </FieldGroup>
  </div>
);

export const Checkboxes = () => (
  <div style={{ maxWidth: 360 }}>
    <FieldGroup legend="Notify me about" hint="Pick up to three." counter={{ value: 2, max: 3 }}>
      <div className="flex flex-col gap-3">
        <Checkbox label="Order updates" defaultChecked />
        <Checkbox label="Price drops on wishlist items" defaultChecked />
        <Checkbox label="New arrivals from Sonora" />
      </div>
    </FieldGroup>
  </div>
);
