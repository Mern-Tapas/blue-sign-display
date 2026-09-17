import { useState } from "react";
import {
  CardPaymentForm,
  CodOption,
  EmiPlanSelector,
  NetBankingSelector,
  PaymentOptionsList,
  SavedCardsList,
  UpiPayment,
  WalletSelector,
  icons,
  sampleData,
  toast,
} from "@bluesigns/ui";

const { Banknote, CreditCard, Landmark, Smartphone, Wallet, WalletCards } = icons;
const { banks, emiPlans, savedCards, savedUpiIds, upiApps, wallets } = sampleData;

const emiBanks = Object.entries(emiPlans).map(([id, plans]) => ({ id, name: banks.find((b) => b.id === id)?.name ?? id, plans }));
const paid = (what: string) => async () => {
  toast({ title: what, description: "Demo — no real payment taken", tone: "success" });
};

const optionsFor = (amount: number, { codPin }: { codPin?: string } = {}) => [
  {
    id: "upi",
    label: "UPI",
    description: "Google Pay, PhonePe, Paytm or any UPI ID",
    icon: <Smartphone />,
    offer: "₹50 cashback on first UPI payment",
    content: <UpiPayment amount={amount} apps={upiApps} savedIds={savedUpiIds} onPay={paid("UPI request sent")} />,
  },
  { id: "saved", label: "Saved cards", description: `${savedCards.length} saved securely`, icon: <WalletCards />, content: <SavedCardsList cards={savedCards} amount={amount} thisMonth="2026-09" onPay={paid("Saved card")} /> },
  { id: "card", label: "Credit / debit card", description: "RuPay, Visa, Mastercard, Amex", icon: <CreditCard />, offer: "10% instant discount on HDFC credit cards", content: <CardPaymentForm amount={amount} onPay={paid("Card payment")} /> },
  { id: "netbanking", label: "Net banking", description: "All major Indian banks", icon: <Landmark />, content: <NetBankingSelector banks={banks} amount={amount} onPay={paid("Net banking")} /> },
  { id: "wallet", label: "Wallets", description: "Paytm, PhonePe, Amazon Pay, MobiKwik", icon: <Wallet />, content: <WalletSelector wallets={wallets} amount={amount} onPay={paid("Wallet payment")} /> },
  {
    id: "emi",
    label: "EMI",
    description: "No-cost EMI from 3 months",
    icon: <CreditCard />,
    unavailable: amount < 3000 ? "Available on orders of ₹3,000 and above" : undefined,
    content: <EmiPlanSelector banks={emiBanks} amount={amount} onContinue={paid("EMI plan chosen")} />,
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay by cash or UPI at your door",
    icon: <Banknote />,
    unavailable: codPin ? `Not available for PIN ${codPin}` : undefined,
    content: <CodOption amount={amount} pinEligible={!codPin} pincode={codPin} onConfirm={paid("COD order placed")} />,
  },
];

function Options({ initial, amount, codPin }: { initial: string; amount: number; codPin?: string }) {
  const [method, setMethod] = useState(initial);
  return (
    <div style={{ maxWidth: 760 }}>
      <PaymentOptionsList options={optionsFor(amount, { codPin })} value={method} onValueChange={setMethod} />
    </div>
  );
}

export const UpiOpen = () => <Options initial="upi" amount={12999} />;

export const WalletsOpen = () => <Options initial="wallet" amount={12999} />;

export const UnavailableMethods = () => <Options initial="emi" amount={2499} codPin="600001" />;
