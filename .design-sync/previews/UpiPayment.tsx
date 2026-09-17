import { useEffect, useRef } from "react";
import { UpiPayment, sampleData, toast } from "@bluesigns/ui";

const { upiApps, savedUpiIds } = sampleData;

const verify = async (vpa: string) => {
  await new Promise((r) => setTimeout(r, 300));
  if (vpa.includes("unknown")) throw new Error("This UPI ID doesn’t exist. Check it and try again.");
  return "Sujon Ahmed";
};
const onPay = async () => {
  toast({ title: "Payment request sent", description: "Approve it in your UPI app", tone: "info" });
};

// Clicks a radio card by its text, then optionally types + verifies a UPI ID.
function Drive({ pick, vpa, children }: { pick: string; vpa?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || root.dataset.driven) return;
    root.dataset.driven = "1";
    const card = [...root.querySelectorAll<HTMLButtonElement>("button[role=radio]")].find((b) => b.textContent?.includes(pick));
    card?.click();
    if (vpa) {
      setTimeout(() => {
        const input = root.querySelector<HTMLInputElement>("input[inputmode=email]");
        if (!input) return;
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, vpa);
        input.dispatchEvent(new Event("input", { bubbles: true }));
        setTimeout(() => [...root.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Verify")?.click(), 30);
      }, 30);
    }
    setTimeout(() => (document.activeElement as HTMLElement | null)?.blur(), 60);
  }, [pick, vpa]);
  return (
    <div ref={ref} style={{ maxWidth: 520 }}>
      {children}
    </div>
  );
}

export const SavedUpiIds = () => (
  <div style={{ maxWidth: 520 }}>
    <UpiPayment amount={12999} apps={upiApps} savedIds={savedUpiIds} verify={verify} onPay={onPay} />
  </div>
);

export const VerifiedNewId = () => (
  <Drive pick="Use another UPI ID" vpa="9876543210@ybl">
    <UpiPayment amount={12999} apps={upiApps} savedIds={savedUpiIds} verify={verify} onPay={onPay} />
  </Drive>
);

export const UnknownIdError = () => (
  <Drive pick="Enter UPI ID" vpa="unknown.user@okhdfc">
    <UpiPayment amount={3527} apps={upiApps} verify={verify} onPay={onPay} />
  </Drive>
);

export const ScanQrCode = () => (
  <Drive pick="Scan QR code">
    <UpiPayment amount={21596} apps={upiApps} savedIds={savedUpiIds} onPay={onPay} />
  </Drive>
);
