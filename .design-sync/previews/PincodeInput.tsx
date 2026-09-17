import { useState } from "react";
import { Button, Field, PincodeInput } from "@bluesigns/ui";

function Pin({ initial = "", ...props }: { initial?: string } & Omit<React.ComponentProps<typeof PincodeInput>, "value" | "onValueChange">) {
  const [pin, setPin] = useState(initial);
  return <PincodeInput value={pin} onValueChange={setPin} {...props} />;
}

export const DeliveryCheck = () => (
  <div style={{ maxWidth: 400 }}>
    <Field label="Check delivery" hint="Enter your PIN code for delivery date and Cash on Delivery">
      <div className="flex gap-2">
        <Pin initial="560087" />
        <Button variant="secondary">Check</Button>
      </div>
    </Field>
  </div>
);

export const States = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 320 }}>
    <Field label="PIN code">
      <Pin />
    </Field>
    <Field label="PIN code" error="We don’t deliver to 110001 yet">
      <Pin initial="110001" />
    </Field>
    <Field label="PIN code (no icon)">
      <Pin initial="400001" showIcon={false} />
    </Field>
    <Field label="Disabled">
      <Pin initial="560001" disabled />
    </Field>
  </div>
);
