import { useEffect, useRef } from "react";
import { NetBankingSelector, sampleData, toast } from "@bluesigns/ui";

const { banks } = sampleData;

const onPay = async ({ bankId }: { bankId: string }) => {
  toast({ title: "Redirecting to your bank", description: banks.find((b) => b.id === bankId)?.name, tone: "info" });
};

export const ChooseBank = () => (
  <div style={{ maxWidth: 560 }}>
    <NetBankingSelector banks={banks} amount={12999} onPay={onPay} />
  </div>
);

// Picks the SBI tile once mounted.
export const PopularBankSelected = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tile = [...(ref.current?.querySelectorAll<HTMLButtonElement>("button[role=radio]") ?? [])].find((b) => b.textContent?.includes("SBI"));
    if (!tile || tile.dataset.picked) return;
    tile.dataset.picked = "1";
    tile.click();
    setTimeout(() => tile.blur(), 50);
  }, []);
  return (
    <div ref={ref} style={{ maxWidth: 560 }}>
      <NetBankingSelector banks={banks} amount={21596} onPay={onPay} />
    </div>
  );
};

// Submits without a bank to show the inline error.
export const MissingBankError = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const form = ref.current?.querySelector("form");
    if (!form || form.dataset.submitted) return;
    form.dataset.submitted = "1";
    form.requestSubmit();
  }, []);
  return (
    <div ref={ref} style={{ maxWidth: 560 }}>
      <NetBankingSelector banks={banks} amount={12999} onPay={onPay} />
    </div>
  );
};
