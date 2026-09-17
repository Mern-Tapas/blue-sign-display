import { useState } from "react";
import { ShippingMethod } from "@bluesigns/ui";

type Option = {
  id: string;
  label: string;
  eta: string;
  price: number;
  icon?: "standard" | "express" | "pickup" | "scheduled";
  recommended?: boolean;
  unavailableReason?: string;
};

function Picker({ initial, options }: { initial: string; options?: Option[] }) {
  const [value, setValue] = useState(initial);
  return (
    <div style={{ maxWidth: 520 }}>
      <ShippingMethod options={options} value={value} onValueChange={setValue} />
    </div>
  );
}

export const ExpressSelected = () => <Picker initial="express" />;

export const ExpressUnavailable = () => (
  <Picker
    initial="standard"
    options={[
      { id: "standard", label: "Standard delivery", eta: "Delivered in 9–11 days", price: 49, icon: "standard" },
      { id: "express", label: "Express delivery", eta: "Tomorrow by 9 PM", price: 99, icon: "express", unavailableReason: "Not available for this PIN code" },
      { id: "scheduled", label: "Scheduled delivery", eta: "Pick a date and time slot", price: 49, icon: "scheduled" },
    ]}
  />
);

export const WithStorePickup = () => (
  <Picker
    initial="pickup"
    options={[
      { id: "standard", label: "Standard delivery", eta: "Delivered in 2–4 days", price: 0, icon: "standard" },
      { id: "express", label: "Express delivery", eta: "Tomorrow by 9 PM", price: 99, icon: "express", recommended: true },
      { id: "pickup", label: "Pick up from store", eta: "Phoenix Marketcity, Whitefield · ready in 2 hours", price: 0, icon: "pickup" },
    ]}
  />
);
