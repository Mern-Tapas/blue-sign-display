"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Banknote, CreditCard, Landmark, ShoppingBag, Smartphone, Wallet, WalletCards } from "lucide-react";
import { CouponSheet } from "@/components/cart/coupon-sheet";
import { StickyCheckoutBar } from "@/components/cart/sticky-checkout-bar";
import { CardPaymentForm } from "@/components/payment/card-payment-form";
import { CodOption } from "@/components/payment/cod-option";
import { EmiPlanSelector } from "@/components/payment/emi-plan-selector";
import { GiftCardRedeem, type GiftCardApplied } from "@/components/payment/gift-card-redeem";
import { NetBankingSelector } from "@/components/payment/net-banking-selector";
import { PaymentOptionsList } from "@/components/payment/payment-options-list";
import { PaymentProcessingOverlay } from "@/components/payment/payment-processing-overlay";
import { PaymentStatus } from "@/components/payment/payment-status";
import { SavedCardsList } from "@/components/payment/saved-cards-list";
import { SecureCheckoutBadges } from "@/components/payment/secure-checkout-badges";
import { UpiPayment } from "@/components/payment/upi-payment";
import { WalletSelector } from "@/components/payment/wallet-selector";
import { bag, useBag } from "@/components/providers/bag-store";
import { cart, useCart, type CartItem } from "@/components/providers/cart-store";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, cardVariants } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Inset } from "@/components/ui/inset";
import { Skeleton } from "@/components/ui/skeleton";
import { addresses as savedAddresses, banks, coupons, emiPlans, lookupPincode, savedCards, savedUpiIds, upiApps, wallets } from "@/lib/data/india";
import type { Address } from "@/lib/data/types";
import type { EmiBank } from "@/lib/emi";
import { formatPrice, LOCALE, TIME_ZONE } from "@/lib/format";
import { computeBagTotals, type BagTotals } from "@/lib/pricing";
import { useHydrated } from "@/lib/use-hydrated";
import { formatAddress } from "@/lib/address";
import { AddressSelector } from "./address-selector";
import { CheckoutStepper } from "./checkout-stepper";
import { DeliverySlotPicker, type DeliverySlotValue } from "./delivery-slot-picker";
import { OrderConfirmation } from "./order-confirmation";
import { OrderSummary } from "./order-summary";
import { ShippingMethod, shippingOptionsFor } from "./shipping-method";

const steps = [
  { id: "bag", label: "Bag" },
  { id: "address", label: "Address" },
  { id: "payment", label: "Payment" },
];

const emiBanks: EmiBank[] = Object.entries(emiPlans).map(([id, plans]) => ({ id, name: banks.find((b) => b.id === id)?.name ?? id, plans }));
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const dayLabel = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return new Intl.DateTimeFormat(LOCALE, { weekday: "short", day: "numeric", month: "short", timeZone: TIME_ZONE }).format(d);
};

function StepCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card asChild padding="none" className="animate-slide-up gap-5 p-5 sm:p-8">
      <section>
        <div>
          <h2 className="text-heading-sm">{title}</h2>
          {description && <p className="mt-1 text-body text-fg-muted">{description}</p>}
        </div>
        {children}
      </section>
    </Card>
  );
}

type Processing = { kind: "upi" | "redirect" | "processing"; target: string; method: string; fail?: boolean } | null;
type Placed = { id: string; items: CartItem[]; totals: BagTotals; address: Address; payment: string; deliveryBy: string; cod: boolean };

/**
 * Indian checkout: Bag → Address (saved addresses, delivery speed, optional slot) → Payment
 * (UPI, cards, net banking, wallets, EMI, COD, gift card). Totals come from computeBagTotals so
 * they match the bag. Demo payments: UPI IDs containing "fail" and cards ending 0002 decline.
 */
export function CheckoutFlow() {
  const { items, subtotal } = useCart();
  const { couponCode, giftWrap } = useBag();
  const hydrated = useHydrated();
  const [step, setStep] = useState(1);
  const [addressList, setAddressList] = useState<Address[]>(savedAddresses);
  const [addressId, setAddressId] = useState<string | null>(savedAddresses.find((a) => a.isDefault)?.id ?? null);
  const [shippingId, setShippingId] = useState("standard");
  const [slot, setSlot] = useState<DeliverySlotValue>(null);
  const [method, setMethod] = useState("upi");
  const [giftCard, setGiftCard] = useState<GiftCardApplied | null>(null);
  const [processing, setProcessing] = useState<Processing>(null);
  const [failed, setFailedState] = useState<{ method: string; reason: string; reference: string } | null>(null);
  const processingRef = useRef<Processing>(null);
  const router = useRouter();

  const setFailed = (f: { method: string; reason: string } | null) =>
    setFailedState(f ? { ...f, reference: `TXN${Date.now().toString().slice(-8)}` } : null);
  const [placed, setPlaced] = useState<Placed | null>(null);

  const address = addressList.find((a) => a.id === addressId) ?? null;
  const pin = address ? lookupPincode(address.pincode) : undefined;
  const coupon = coupons.find((c) => c.code === couponCode) ?? null;
  const shippingOptions = shippingOptionsFor(subtotal, { etaDays: pin?.etaDays ?? 4, expressAvailable: (pin?.etaDays ?? 9) <= 3 });
  const totals = computeBagTotals(items, { coupon, giftWrap: giftWrap.enabled, express: shippingId === "express", cod: method === "cod" });
  const payable = Math.max(0, totals.total - (giftCard?.amount ?? 0));
  const deliveryDays = shippingId === "express" ? 1 : (pin?.etaDays ?? 4);
  const today = hydrated ? new Date().toISOString().slice(0, 10) : "";

  if (placed) {
    return (
      <OrderConfirmation
        orderId={placed.id}
        customerName={placed.address.name}
        deliveryBy={placed.deliveryBy}
        addressLine={formatAddress(placed.address)}
        paymentLine={placed.payment}
        items={placed.items}
        totals={placed.totals}
        note={placed.cod ? `Keep ${formatPrice(placed.totals.total)} ready in cash or UPI for the delivery partner.` : undefined}
      />
    );
  }

  // Cart lives in localStorage — avoid flashing the empty state before hydration.
  if (!hydrated) return <CheckoutFlowSkeleton />;

  if (items.length === 0) {
    return (
      <Card variant="outline" padding="none">
        <EmptyState
          icon={<ShoppingBag aria-hidden />}
          title="Your bag is empty"
          description="Add something you love, then come back to check out."
          action={
            <Button asChild>
              <Link href="/shop">Browse products</Link>
            </Button>
          }
        />
      </Card>
    );
  }

  const goTo = (s: number) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function complete(paymentLine: string) {
    if (!address) return;
    const snapshot: Placed = {
      id: `LM-${100500 + Math.floor(Math.random() * 400)}`,
      items,
      totals,
      address,
      payment: giftCard ? `${paymentLine} + gift card •••• ${giftCard.last4}` : paymentLine,
      deliveryBy: shippingId === "scheduled" && slot ? new Intl.DateTimeFormat(LOCALE, { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${slot.date}T12:00:00`)) : dayLabel(deliveryDays),
      cod: method === "cod",
    };
    cart.clear();
    bag.applyCoupon(null);
    bag.setGiftWrap({ enabled: false, message: "", to: "", from: "" });
    setPlaced(snapshot);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function runPayment(p: NonNullable<Processing>, durationMs: number) {
    setFailed(null);
    processingRef.current = p;
    setProcessing(p);
    await wait(durationMs);
    // Cancel or timeout clears the ref first; only finish if this attempt is still open
    if (processingRef.current !== p) return;
    processingRef.current = null;
    setProcessing(null);
    if (p.fail) setFailed({ method: p.method, reason: "The payment was declined by your bank or UPI app. No money was taken." });
    else complete(p.method);
  }

  const paymentOptions = [
    {
      id: "upi",
      label: "UPI",
      description: "Google Pay, PhonePe, Paytm or any UPI ID",
      icon: <Smartphone />,
      offer: "₹50 cashback on first UPI payment · demo",
      content: (
        <UpiPayment
          amount={payable}
          apps={upiApps}
          savedIds={savedUpiIds}
          verify={async (vpa) => {
            await wait(700);
            if (vpa.toLowerCase().includes("unknown")) throw new Error("This UPI ID doesn’t exist. Check it and try again.");
            return address?.name ?? "Account holder";
          }}
          onPay={(d) =>
            runPayment(
              { kind: "upi", target: d.mode === "id" ? d.vpa : d.mode === "app" ? (upiApps.find((a) => a.id === d.app)?.name ?? "your UPI app") : "the QR code", method: `UPI · ${d.mode === "id" ? d.vpa : d.mode === "app" ? upiApps.find((a) => a.id === d.app)?.name : "QR"}`, fail: d.mode === "id" && d.vpa.toLowerCase().includes("fail") },
              4000,
            )
          }
        />
      ),
    },
    {
      id: "saved-cards",
      label: "Saved cards",
      description: `${savedCards.length} saved securely`,
      icon: <WalletCards />,
      content: (
        <SavedCardsList
          cards={savedCards}
          amount={payable}
          thisMonth={today.slice(0, 7)}
          onUseNewCard={() => setMethod("card")}
          onPay={({ cardId }) => {
            const c = savedCards.find((x) => x.id === cardId)!;
            return runPayment({ kind: "redirect", target: `${c.bank} secure page`, method: `${c.bank} card •••• ${c.last4}` }, 2500);
          }}
        />
      ),
    },
    {
      id: "card",
      label: "Credit / debit card",
      description: "RuPay, Visa, Mastercard, Amex",
      icon: <CreditCard />,
      offer: "10% instant discount on HDFC credit cards · demo",
      content: <CardPaymentForm amount={payable} onPay={(d) => runPayment({ kind: "redirect", target: "your bank’s secure page", method: `Card •••• ${d.last4}`, fail: d.last4 === "0002" }, 2500)} />,
    },
    {
      id: "netbanking",
      label: "Net banking",
      description: "All major Indian banks",
      icon: <Landmark />,
      content: <NetBankingSelector banks={banks} amount={payable} onPay={({ bankId }) => runPayment({ kind: "redirect", target: banks.find((b) => b.id === bankId)?.name ?? "your bank", method: `Net banking · ${banks.find((b) => b.id === bankId)?.name}` }, 2500)} />,
    },
    {
      id: "wallet",
      label: "Wallets",
      description: "Paytm, PhonePe, Amazon Pay, MobiKwik",
      icon: <Wallet />,
      content: <WalletSelector wallets={wallets} amount={payable} onPay={({ walletId }) => runPayment({ kind: "processing", target: wallets.find((w) => w.id === walletId)?.name ?? "wallet", method: wallets.find((w) => w.id === walletId)?.name ?? "Wallet" }, 2000)} />,
    },
    {
      id: "emi",
      label: "EMI",
      description: payable >= 3000 ? "No-cost EMI from 3 months" : "On orders of ₹3,000+",
      icon: <CreditCard />,
      unavailable: payable < 3000 ? "Available on orders of ₹3,000 and above" : undefined,
      content: <EmiPlanSelector banks={emiBanks} amount={payable} onContinue={({ bankId, months }) => runPayment({ kind: "redirect", target: `${banks.find((b) => b.id === bankId)?.name} EMI`, method: `EMI · ${months} months · ${banks.find((b) => b.id === bankId)?.name}` }, 2500)} />,
    },
    {
      id: "cod",
      label: "Cash on Delivery",
      description: "Pay by cash or UPI at your door",
      icon: <Banknote />,
      unavailable: pin && !pin.cod ? `Not available for PIN ${pin.pincode}` : undefined,
      content: (
        <CodOption
          amount={payable - totals.cod}
          pinEligible={Boolean(pin?.cod)}
          pincode={address?.pincode}
          onConfirm={async () => {
            await wait(900);
            complete("Cash on Delivery");
          }}
        />
      ),
    },
  ];

  return (
    <div className="grid gap-6 pb-24 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:pb-0">
      <div className="flex min-w-0 flex-col gap-4">
        <CheckoutStepper steps={steps} current={step} onStepClick={(i) => (i === 0 ? router.push("/bag") : goTo(i))} />

        {step === 1 && (
          <>
            <StepCard title="Delivery address" description="Choose where this order should go.">
              <AddressSelector
                addresses={addressList}
                value={addressId}
                onValueChange={setAddressId}
                lookup={lookupPincode}
                onRemove={(id) => {
                  setAddressList((l) => l.filter((a) => a.id !== id));
                  if (addressId === id) setAddressId(null);
                }}
                onSave={(value, id) => {
                  const nextId = id ?? `addr-${Date.now()}`;
                  const saved: Address = { ...value, id: nextId, landmark: value.landmark || undefined };
                  setAddressList((l) => {
                    const base = value.isDefault ? l.map((a) => ({ ...a, isDefault: false })) : l;
                    return id ? base.map((a) => (a.id === id ? saved : a)) : [...base, saved];
                  });
                  setAddressId(nextId);
                }}
              />
            </StepCard>
            <StepCard title="Delivery speed" description={pin ? `For ${pin.city} ${pin.pincode}` : "Choose an address first"}>
              <ShippingMethod options={shippingOptions} value={shippingId} onValueChange={setShippingId} />
              {shippingId === "scheduled" && <DeliverySlotPicker value={slot} onValueChange={setSlot} startInDays={pin?.etaDays ?? 2} slots={[{ id: "morning", label: "Morning", time: "9 AM – 12 PM" }, { id: "afternoon", label: "Afternoon", time: "12 – 4 PM" }, { id: "evening", label: "Evening", time: "4 – 9 PM" }]} />}
              <div className="flex flex-wrap justify-between gap-3 max-lg:hidden">
                <Button asChild variant="ghost" leadingIcon={<ArrowLeft aria-hidden />}>
                  <Link href="/bag">Back to bag</Link>
                </Button>
                <Button size="lg" trailingIcon={<ArrowRight aria-hidden />} disabled={!address || !pin?.serviceable || (shippingId === "scheduled" && !slot)} onClick={() => goTo(2)}>
                  Continue to payment
                </Button>
              </div>
            </StepCard>
            <StickyCheckoutBar
              total={totals.total}
              actionLabel="Continue"
              disabled={!address || !pin?.serviceable || (shippingId === "scheduled" && !slot)}
              onAction={() => goTo(2)}
            />
          </>
        )}

        {step === 2 && (
          <>
            {address && (
              <Inset className="flex items-center gap-4 rounded-xl py-3 text-body">
                <span className="w-20 shrink-0 text-fg-muted">Deliver to</span>
                <span className="min-w-0 flex-1 truncate">
                  {address.name}, {formatAddress(address)}
                </span>
                <Button variant="ghost" size="sm" onClick={() => goTo(1)}>
                  Change
                </Button>
              </Inset>
            )}
            {failed ? (
              <PaymentStatus
                status="failed"
                amount={payable}
                method={failed.method}
                reason={failed.reason}
                reference={failed.reference}
                actions={
                  <>
                    <Button onClick={() => setFailed(null)}>Try again</Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setFailed(null);
                        setMethod(method === "upi" ? "card" : "upi");
                      }}
                    >
                      Use another method
                    </Button>
                  </>
                }
              />
            ) : (
              <StepCard title="Payment" description={`Amount payable ${formatPrice(payable)}`}>
                <GiftCardRedeem
                  orderTotal={totals.total}
                  applied={giftCard}
                  onApply={setGiftCard}
                  checkBalance={async (number) => {
                    await wait(800);
                    if (number.endsWith("0000")) throw new Error("This gift card number isn’t valid");
                    return 1000;
                  }}
                />
                <PaymentOptionsList options={paymentOptions} value={method} onValueChange={setMethod} />
                <p className="text-caption text-fg-muted">Demo payments: a UPI ID with “fail” or a card ending 0002 shows a declined payment.</p>
              </StepCard>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col gap-4 lg:sticky lg:top-28">
        <OrderSummary items={items} details={totals} promo={<CouponSheet coupons={coupons} subtotal={subtotal} today={today} appliedCode={coupon?.code ?? null} onApply={bag.applyCoupon} />} />
        {giftCard && (
          <Alert tone="success" role="note" icon={false} className="py-3 figures">
            Gift card −{formatPrice(giftCard.amount)} · pay {formatPrice(payable)}
          </Alert>
        )}
        <SecureCheckoutBadges demo className={cardVariants({ variant: "outline", padding: "sm" })} />
      </div>

      <PaymentProcessingOverlay
        open={processing !== null}
        amount={payable}
        kind={processing?.kind}
        target={processing?.target}
        timeoutSeconds={processing?.kind === "upi" ? 300 : 120}
        onCancel={() => {
          processingRef.current = null;
          setProcessing(null);
          setFailed({ method: processing?.method ?? "Payment", reason: "You cancelled the payment. No money was taken." });
        }}
        onTimeout={() => {
          processingRef.current = null;
          setProcessing(null);
          setFailed({ method: processing?.method ?? "Payment", reason: "The payment request expired before it was approved." });
        }}
      />
    </div>
  );
}

/** Placeholder rendered on the server before the cart (localStorage) is available. */
export function CheckoutFlowSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-14 rounded-pill" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );
}
