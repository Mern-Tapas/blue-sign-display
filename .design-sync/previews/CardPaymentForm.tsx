import { useEffect, useRef } from "react";
import { CardPaymentForm, toast } from "@bluesigns/ui";

const pay = async (d: { last4: string }) => {
  toast({ title: "Redirecting to your bank", description: `Card •••• ${d.last4}`, tone: "info" });
};

// Fills the demo fields (and optionally submits) once mounted to show filled / error states.
function Prefill({ values, submit, children }: { values: string[]; submit?: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || root.dataset.filled) return;
    root.dataset.filled = "1";
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    const inputs = [...root.querySelectorAll<HTMLInputElement>("input:not([type=checkbox]):not([role])")];
    values.forEach((v, i) => {
      const input = inputs[i];
      if (!input || !v) return;
      setValue.call(input, v);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    if (submit) setTimeout(() => root.querySelector("form")?.requestSubmit(), 30);
    setTimeout(() => (document.activeElement as HTMLElement | null)?.blur(), 120);
  }, [values, submit]);
  return (
    <div ref={ref} style={{ maxWidth: 760 }}>
      {children}
    </div>
  );
}

export const Filled = () => (
  <Prefill values={["4111 1111 1111 1111", "08/29", "123", "Sujon Ahmed"]}>
    <CardPaymentForm amount={12999} onPay={pay} />
  </Prefill>
);

export const Empty = () => (
  <div style={{ maxWidth: 760 }}>
    <CardPaymentForm amount={21596} onPay={pay} />
  </div>
);

export const ValidationErrors = () => (
  <Prefill values={["4111 1111 1111 1112", "13/21", "", ""]} submit>
    <CardPaymentForm amount={12999} onPay={pay} />
  </Prefill>
);

export const WithoutCardVisual = () => (
  <div style={{ maxWidth: 480 }}>
    <CardPaymentForm amount={4499} showVisual={false} submitLabel="Pay ₹4,499 securely" onPay={pay} />
  </div>
);
