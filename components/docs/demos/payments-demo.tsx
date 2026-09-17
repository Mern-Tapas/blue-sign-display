"use client";

import { useState } from "react";
import { Banknote, CreditCard, Landmark, Smartphone, Wallet, WalletCards } from "lucide-react";
import { DsGrid, DsPreview } from "@/components/docs/ds-section";
import { CardPaymentForm } from "@/components/payment/card-payment-form";
import { CodOption } from "@/components/payment/cod-option";
import { EmiPlanSelector } from "@/components/payment/emi-plan-selector";
import { GiftCardRedeem, type GiftCardApplied } from "@/components/payment/gift-card-redeem";
import { NetBankingSelector } from "@/components/payment/net-banking-selector";
import { PaymentOptionsList } from "@/components/payment/payment-options-list";
import { PaymentProcessingOverlay } from "@/components/payment/payment-processing-overlay";
import { PaymentStatus } from "@/components/payment/payment-status";
import { SavedCardsList } from "@/components/payment/saved-cards-list";
import { UpiPayment } from "@/components/payment/upi-payment";
import { WalletSelector } from "@/components/payment/wallet-selector";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { banks, emiPlans, savedCards, savedUpiIds, upiApps, wallets } from "@/lib/data/india";
import type { EmiBank } from "@/lib/emi";
import { formatPrice } from "@/lib/format";

const AMOUNT = 12999;
const emiBanks: EmiBank[] = Object.entries(emiPlans).map(([id, plans]) => ({ id, name: banks.find((b) => b.id === id)?.name ?? id, plans }));
const wait = (ms = 900) => new Promise((r) => setTimeout(r, ms));
const paid = (what: string) => async () => {
  await wait();
  toast({ title: `Demo: ${what}`, description: `${formatPrice(AMOUNT)} — no real payment taken`, tone: "success" });
};

export function PaymentOptionsDemo() {
  const [method, setMethod] = useState("upi");
  return (
    <PaymentOptionsList
      value={method}
      onValueChange={setMethod}
      options={[
        {
          id: "upi",
          label: "UPI",
          description: "Google Pay, PhonePe, Paytm or any UPI ID",
          icon: <Smartphone />,
          offer: "₹50 cashback · demo",
          content: (
            <UpiPayment
              amount={AMOUNT}
              apps={upiApps}
              savedIds={savedUpiIds}
              verify={async (v) => {
                await wait(600);
                if (v.includes("unknown")) throw new Error("This UPI ID doesn’t exist");
                return "Sujon Ahmed";
              }}
              onPay={paid("UPI request sent")}
            />
          ),
        },
        { id: "saved", label: "Saved cards", description: "2 saved securely", icon: <WalletCards />, content: <SavedCardsList cards={savedCards} amount={AMOUNT} thisMonth="2026-09" onPay={paid("saved card")} /> },
        { id: "card", label: "Credit / debit card", description: "RuPay, Visa, Mastercard, Amex", icon: <CreditCard />, content: <CardPaymentForm amount={AMOUNT} onPay={paid("card payment")} /> },
        { id: "netbanking", label: "Net banking", description: "All major banks", icon: <Landmark />, content: <NetBankingSelector banks={banks} amount={AMOUNT} onPay={paid("net banking redirect")} /> },
        { id: "wallet", label: "Wallets", description: "Paytm, PhonePe, Amazon Pay", icon: <Wallet />, content: <WalletSelector wallets={wallets} amount={AMOUNT} onPay={paid("wallet payment")} /> },
        { id: "emi", label: "EMI", description: "No-cost EMI from 3 months", icon: <CreditCard />, content: <EmiPlanSelector banks={emiBanks} amount={AMOUNT} onContinue={paid("EMI plan chosen")} /> },
        { id: "cod", label: "Cash on Delivery", description: "Pay at your door", icon: <Banknote />, content: <CodOption amount={AMOUNT} pinEligible onConfirm={paid("COD order placed")} /> },
      ]}
    />
  );
}

export function PaymentStatesDemo() {
  const [overlay, setOverlay] = useState<"upi" | "redirect" | null>(null);
  const [gift, setGift] = useState<GiftCardApplied | null>(null);
  return (
    <div className="flex flex-col gap-5">
      <DsGrid>
        <DsPreview label="PaymentProcessingOverlay" className="flex-col items-start">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setOverlay("upi")}>
              UPI approval
            </Button>
            <Button variant="secondary" onClick={() => setOverlay("redirect")}>
              Bank redirect
            </Button>
          </div>
          <p className="text-caption text-fg-muted">Can’t be dismissed by Escape or clicking outside; use Cancel payment. Times out after 20 seconds here.</p>
          <PaymentProcessingOverlay
            open={overlay !== null}
            kind={overlay ?? "upi"}
            amount={AMOUNT}
            target={overlay === "upi" ? "sujon@okaxis" : "HDFC Bank"}
            timeoutSeconds={20}
            onCancel={() => {
              setOverlay(null);
              toast({ title: "Payment cancelled", tone: "info" });
            }}
            onTimeout={() => {
              setOverlay(null);
              toast({ title: "Payment request expired", tone: "danger" });
            }}
          />
        </DsPreview>
        <DsPreview label="GiftCardRedeem (card ending 0000 is invalid)" className="flex-col items-stretch">
          <GiftCardRedeem
            orderTotal={AMOUNT}
            applied={gift}
            onApply={setGift}
            checkBalance={async (n) => {
              await wait(700);
              if (n.endsWith("0000")) throw new Error("This gift card number isn’t valid");
              return 2500;
            }}
          />
        </DsPreview>
      </DsGrid>
      <div className="grid gap-5 lg:grid-cols-3">
        <PaymentStatus status="success" amount={AMOUNT} method="UPI · sujon@okaxis" reference="TXN48213377" actions={<Button variant="neutral">View order</Button>} />
        <PaymentStatus
          status="failed"
          amount={AMOUNT}
          method="HDFC Bank card •••• 4242"
          reason="Your bank declined the payment because the OTP wasn’t entered in time."
          reference="TXN48213412"
          actions={
            <>
              <Button>Try again</Button>
              <Button variant="secondary">Use another method</Button>
            </>
          }
        />
        <PaymentStatus status="pending" amount={AMOUNT} method="Net banking · SBI" reference="TXN48213590" actions={<Button variant="secondary">Check status</Button>} />
      </div>
    </div>
  );
}
