"use client";

import { useState } from "react";
import { AddressDialog } from "@/components/checkout/address-dialog";
import { AddressForm } from "@/components/checkout/address-form";
import { AddressSelector, SavedAddressCard } from "@/components/checkout/address-selector";
import { CheckoutStepper } from "@/components/checkout/checkout-stepper";
import { DeliverySlotPicker, type DeliverySlotValue } from "@/components/checkout/delivery-slot-picker";
import { OrderSummary } from "@/components/checkout/order-summary";
import { PaymentMethod, type PaymentMethodValue } from "@/components/checkout/payment-method";
import { ShippingMethod, shippingOptionsFor } from "@/components/checkout/shipping-method";
import { CouponSheet } from "@/components/cart/coupon-sheet";
import { DsGrid, DsPreview } from "@/components/docs/ds-section";
import type { CartItem } from "@/components/providers/cart-store";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { addresses, coupons, lookupPincode } from "@/lib/data/india";
import type { Address } from "@/lib/data/types";
import { computeBagTotals } from "@/lib/pricing";

const steps = [
  { id: "bag", label: "Bag" },
  { id: "address", label: "Address" },
  { id: "payment", label: "Payment" },
];

const extraAddress: Address = {
  id: "addr-blair",
  name: "Sujon Ahmed",
  mobile: "9876543210",
  pincode: "744101",
  house: "Quarters 12, Aberdeen Bazaar",
  locality: "Near Clock Tower",
  city: "Port Blair",
  state: "Andaman and Nicobar Islands",
  type: "home",
};

export function CheckoutBlocksDemo({ items }: { items: CartItem[] }) {
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState("express");
  const [payment, setPayment] = useState<PaymentMethodValue>("upi");
  const [code, setCode] = useState<string | null>(null);
  const [list, setList] = useState<Address[]>([...addresses, extraAddress]);
  const [selected, setSelected] = useState<string | null>("addr-home");
  const [slot, setSlot] = useState<DeliverySlotValue>(null);
  const [dialog, setDialog] = useState(false);
  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
  const totals = computeBagTotals(items, { coupon: coupons.find((c) => c.code === code), express: shipping === "express", cod: payment === "cod" });

  return (
    <div className="flex flex-col gap-5">
      <DsPreview label="Checkout stepper (click a completed step)" surface="canvas" className="flex-col items-stretch">
        <CheckoutStepper steps={steps} current={step} onStepClick={setStep} />
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))}>
            Back
          </Button>
          <Button size="sm" onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>
            Next step
          </Button>
        </div>
      </DsPreview>

      <DsPreview label="AddressSelector · SavedAddressCard" className="flex-col items-stretch">
        <AddressSelector
          addresses={list}
          value={selected}
          onValueChange={setSelected}
          lookup={lookupPincode}
          onRemove={(id) => setList((l) => l.filter((a) => a.id !== id))}
          onSave={(v, id) => {
            const nextId = id ?? `addr-${list.length + 1}`;
            setList((l) => (id ? l.map((a) => (a.id === id ? { ...v, id } : a)) : [...l, { ...v, id: nextId }]));
            setSelected(nextId);
            toast({ title: id ? "Address updated" : "Address added", tone: "success" });
          }}
        />
        <p className="text-caption text-fg-muted">The Port Blair address is not serviceable, so it can’t be selected.</p>
      </DsPreview>

      <DsGrid>
        <DsPreview label="AddressForm (try PIN 560066 or 744101)" className="flex-col items-stretch">
          <AddressForm id="demo-address" onSubmit={(a) => toast({ title: "Address valid", description: `${a.city}, ${a.state} ${a.pincode}`, tone: "success" })} />
          <div className="flex gap-2">
            <Button type="submit" form="demo-address">
              Validate
            </Button>
            <Button variant="secondary" onClick={() => setDialog(true)}>
              Open AddressDialog
            </Button>
          </div>
          <AddressDialog open={dialog} onOpenChange={setDialog} onSave={() => toast({ title: "Saved from dialog", tone: "success" })} />
        </DsPreview>
        <div className="flex flex-col gap-5">
          <DsPreview label="ShippingMethod" className="block">
            <ShippingMethod options={shippingOptionsFor(subtotal, { etaDays: 2 })} value={shipping} onValueChange={setShipping} />
          </DsPreview>
          <DsPreview label="PaymentMethod (compact)" className="block">
            <PaymentMethod value={payment} onValueChange={setPayment} />
          </DsPreview>
          <OrderSummary items={items} details={totals} promo={<CouponSheet coupons={coupons} subtotal={subtotal} today="2026-09-15" appliedCode={code} onApply={setCode} />} action={<Button size="lg" fullWidth>Continue</Button>} />
        </div>
      </DsGrid>

      <DsPreview label="DeliverySlotPicker" className="block">
        <DeliverySlotPicker value={slot} onValueChange={setSlot} startInDays={1} isFull={(d, s) => s === "morning" && d.endsWith("0")} />
      </DsPreview>

      <DsPreview label="SavedAddressCard · standalone (address book)" className="block">
        <SavedAddressCard address={addresses[1]!} pin={lookupPincode(addresses[1]!.pincode)} onEdit={() => toast({ title: "Edit" })} onRemove={() => toast({ title: "Removed (demo)" })} />
      </DsPreview>
    </div>
  );
}
