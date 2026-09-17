import { useEffect, useRef } from "react";
import { PromoCodeInput } from "@bluesigns/ui";

const validate = (code: string) =>
  code === "FIRST500" ? { ok: true as const, label: "FIRST500 · ₹500 off applied" } : { ok: false as const, error: `${code} isn’t a valid code` };

// Types a code into the field and submits it once, to show the applied / error states.
function EnterCode({ code, children }: { code: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const input = ref.current?.querySelector("input");
    if (!input || input.dataset.filled) return;
    input.dataset.filled = "1";
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    setValue.call(input, code);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    setTimeout(() => input.form?.requestSubmit(), 30);
  }, [code]);
  return (
    <div ref={ref} style={{ maxWidth: 360 }}>
      {children}
    </div>
  );
}

export const Empty = () => (
  <div style={{ maxWidth: 360 }}>
    <PromoCodeInput onApply={validate} />
  </div>
);

export const Applied = () => (
  <EnterCode code="FIRST500">
    <PromoCodeInput onApply={validate} onRemove={() => {}} />
  </EnterCode>
);

export const InvalidCode = () => (
  <EnterCode code="SAVE90">
    <PromoCodeInput onApply={validate} />
  </EnterCode>
);
