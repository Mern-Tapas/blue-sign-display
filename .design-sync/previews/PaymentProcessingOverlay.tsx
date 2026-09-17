import { useEffect } from "react";
import { PaymentProcessingOverlay, toast } from "@bluesigns/ui";

const cancel = () => toast({ title: "Payment cancelled", tone: "info" });
const expire = () => toast({ title: "Payment request expired", tone: "danger" });

// The overlay moves focus to "Cancel payment" on open; blur it so the preview shows the resting state.
function useBlurOnOpen() {
  useEffect(() => {
    const t = setTimeout(() => (document.activeElement as HTMLElement | null)?.blur(), 120);
    return () => clearTimeout(t);
  }, []);
}

export const UpiApproval = () => {
  useBlurOnOpen();
  return <PaymentProcessingOverlay open kind="upi" amount={12999} target="sujon@okaxis" timeoutSeconds={300} onCancel={cancel} onTimeout={expire} />;
};

export const BankRedirect = () => {
  useBlurOnOpen();
  return <PaymentProcessingOverlay open kind="redirect" amount={21596} target="HDFC Bank secure page" timeoutSeconds={120} onCancel={cancel} onTimeout={expire} />;
};

export const ExpiringSoon = () => {
  useBlurOnOpen();
  return <PaymentProcessingOverlay open kind="upi" amount={3527} target="Google Pay" timeoutSeconds={25} onCancel={cancel} onTimeout={expire} />;
};

export const ConfirmingWallet = () => {
  useBlurOnOpen();
  return <PaymentProcessingOverlay open kind="processing" amount={999} target="Paytm Wallet" onCancel={cancel} onTimeout={expire} />;
};
