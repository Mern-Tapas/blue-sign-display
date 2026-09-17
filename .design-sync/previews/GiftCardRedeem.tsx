import { useEffect, useRef, useState } from "react";
import { GiftCardRedeem } from "@bluesigns/ui";

type Applied = { last4: string; amount: number } | null;

const checkBalance = async (number: string) => {
  await new Promise((r) => setTimeout(r, 700));
  if (number.endsWith("0000")) throw new Error("This gift card number isn’t valid");
  return 2500;
};

function Redeem({ orderTotal, initial }: { orderTotal: number; initial: Applied }) {
  const [applied, setApplied] = useState<Applied>(initial);
  return <GiftCardRedeem orderTotal={orderTotal} applied={applied} onApply={setApplied} checkBalance={checkBalance} />;
}

export const Collapsed = () => (
  <div style={{ maxWidth: 560 }}>
    <Redeem orderTotal={12999} initial={null} />
  </div>
);

// Expands the "Have a gift card?" row once mounted.
export const FormOpen = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const toggle = ref.current?.querySelector<HTMLButtonElement>("button[aria-expanded]");
    if (!toggle || toggle.dataset.opened) return;
    toggle.dataset.opened = "1";
    toggle.click();
    setTimeout(() => toggle.blur(), 50);
  }, []);
  return (
    <div ref={ref} style={{ maxWidth: 560 }}>
      <Redeem orderTotal={12999} initial={null} />
    </div>
  );
};

export const PartiallyApplied = () => (
  <div style={{ maxWidth: 560 }}>
    <Redeem orderTotal={12999} initial={{ last4: "7788", amount: 2500 }} />
  </div>
);

export const CoversWholeOrder = () => (
  <div style={{ maxWidth: 560 }}>
    <Redeem orderTotal={1299} initial={{ last4: "3104", amount: 1299 }} />
  </div>
);
