import { Radio, RadioGroup } from "@bluesigns/ui";

export const WithDescription = () => (
  <div style={{ maxWidth: 380 }}>
    <RadioGroup defaultValue="standard" aria-label="Shipping speed">
      <Radio value="standard" label="Standard delivery" description="3–5 days · Free" />
      <Radio value="express" label="Express delivery" description="Tomorrow by 9 PM · ₹99" />
    </RadioGroup>
  </div>
);

export const States = () => (
  <RadioGroup defaultValue="selected" aria-label="Radio states">
    <Radio value="selected" label="Selected" />
    <Radio value="idle" label="Unselected" />
    <Radio value="disabled" label="Disabled" disabled />
  </RadioGroup>
);

export const Invalid = () => (
  <RadioGroup aria-label="Gift wrap">
    <Radio value="yes" label="Add gift wrap for ₹49" aria-invalid />
    <Radio value="no" label="No gift wrap" aria-invalid />
  </RadioGroup>
);
