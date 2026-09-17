import { useState } from "react";
import { PaymentMethod } from "@bluesigns/ui";

type Method = "upi" | "card" | "cod";

function Picker({ initial, codAvailable }: { initial: Method; codAvailable?: boolean }) {
  const [value, setValue] = useState<Method>(initial);
  return (
    <div style={{ maxWidth: 860 }}>
      <PaymentMethod value={value} onValueChange={setValue} codAvailable={codAvailable} />
    </div>
  );
}

export const UpiSelected = () => <Picker initial="upi" />;

export const CashOnDeliverySelected = () => <Picker initial="cod" />;

export const CodUnavailable = () => <Picker initial="card" codAvailable={false} />;
