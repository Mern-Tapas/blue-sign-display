import { useEffect, useRef } from "react";
import { ReturnExchangeFlow, TextButton, sampleData } from "@bluesigns/ui";

const { orders, getProductById } = sampleData;

// `lines` are order items joined with their products.
const linesOf = (id: string) => {
  const order = orders.find((o) => o.id === id)!;
  return order.items.map((i) => ({ ...i, product: getProductById(i.productId)! }));
};
const HOME = "Flat 402, Prestige Lakeside, Varthur Road, Whitefield, Bengaluru, Karnataka 560066";
const submit = () => new Promise<void>((r) => setTimeout(r, 900));

// The flow owns its open state: click the trigger, then press Continue `steps` times.
function AutoOpen({ steps = 0, children }: { steps?: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const trigger = ref.current?.querySelector("button");
    if (!trigger || trigger.dataset.autoOpened) return;
    trigger.dataset.autoOpened = "1";
    trigger.click();
    let n = 0;
    const advance = () => {
      if (n++ >= steps) return (document.activeElement as HTMLElement | null)?.blur();
      const next = [...document.querySelectorAll<HTMLButtonElement>("[role=dialog] button[type=submit]")][0];
      next?.click();
      setTimeout(advance, 80);
    };
    setTimeout(advance, 120);
  }, [steps]);
  return <div ref={ref}>{children}</div>;
}

export const ChooseItems = () => (
  <AutoOpen>
    <ReturnExchangeFlow orderId="LM-100482" lines={linesOf("LM-100482")} deadline="2026-09-29" paymentMethod="UPI · sujon@okaxis" pickupAddress={HOME} onSubmit={submit} />
  </AutoOpen>
);

export const ReasonStep = () => (
  <AutoOpen steps={1}>
    <ReturnExchangeFlow orderId="LM-100377" lines={linesOf("LM-100377")} deadline="2026-09-23" paymentMethod="HDFC Bank Credit Card •• 4242" pickupAddress={HOME} onSubmit={submit} />
  </AutoOpen>
);

export const Triggers = () => (
  <div className="flex flex-wrap items-center gap-3">
    <ReturnExchangeFlow orderId="LM-100377" lines={linesOf("LM-100377")} deadline="2026-09-23" paymentMethod="HDFC Bank Credit Card •• 4242" pickupAddress={HOME} onSubmit={submit} />
    <ReturnExchangeFlow
      orderId="LM-100251"
      lines={linesOf("LM-100251")}
      deadline="2026-09-29"
      isCod
      paymentMethod="Cash on Delivery"
      pickupAddress={HOME}
      trigger={<TextButton>Return (refund to bank)</TextButton>}
      onSubmit={submit}
    />
  </div>
);
