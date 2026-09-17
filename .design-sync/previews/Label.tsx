import { Checkbox, Input, Label, Switch } from "@bluesigns/ui";

export const WithInput = () => (
  <div className="flex flex-col gap-2" style={{ maxWidth: 320 }}>
    <Label htmlFor="label-pincode">Delivery PIN code</Label>
    <Input id="label-pincode" defaultValue="560001" inputMode="numeric" />
  </div>
);

export const WithSwitch = () => (
  <div className="flex items-center justify-between gap-4" style={{ maxWidth: 320 }}>
    <Label htmlFor="label-gift">Gift wrap this order</Label>
    <Switch id="label-gift" defaultChecked />
  </div>
);

export const PeerDisabled = () => (
  <div className="flex items-center gap-3">
    <Checkbox id="label-cod" disabled className="peer" />
    <Label htmlFor="label-cod">Cash on delivery (not available for 560100)</Label>
  </div>
);
