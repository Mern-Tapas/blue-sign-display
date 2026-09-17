import { RadioCard, RadioCardGroup, formatPrice, icons } from "@bluesigns/ui";

const { Truck, Zap, Store, Smartphone, CreditCard, Banknote } = icons;

export const ShippingMethod = () => (
  <div style={{ maxWidth: 420 }}>
    <RadioCardGroup defaultValue="standard" aria-label="Shipping method">
      <RadioCard value="standard" icon={<Truck aria-hidden />} title="Standard" description="Delivery in 3–5 days" aside="Free" />
      <RadioCard value="express" icon={<Zap aria-hidden />} title="Express" description="Tomorrow by 9 PM" aside={formatPrice(99)} />
      <RadioCard value="pickup" icon={<Store aria-hidden />} title="Store pickup" description="Ready in 2 hours at Whitefield" aside="Free" />
    </RadioCardGroup>
  </div>
);

export const Compact = () => (
  <div style={{ maxWidth: 360 }}>
    <RadioCardGroup defaultValue="upi" aria-label="Payment">
      <RadioCard value="upi" size="sm" icon={<Smartphone aria-hidden />} title="UPI" description="GPay, PhonePe, Paytm" />
      <RadioCard value="card" size="sm" icon={<CreditCard aria-hidden />} title="Card" description="RuPay, Visa, Mastercard" />
      <RadioCard value="cod" size="sm" icon={<Banknote aria-hidden />} title="Cash on Delivery" description="Not for this PIN" disabled />
    </RadioCardGroup>
  </div>
);

export const SlotGrid = () => (
  <div style={{ maxWidth: 420 }}>
    <RadioCardGroup defaultValue="12" aria-label="Delivery slot" className="grid-cols-3">
      {[
        { value: "9", title: "9–12", description: "Morning" },
        { value: "12", title: "12–3", description: "Afternoon" },
        { value: "3", title: "3–6", description: "Evening" },
      ].map((s) => (
        <RadioCard key={s.value} value={s.value} size="sm" indicator={false} title={s.title} description={s.description} />
      ))}
    </RadioCardGroup>
  </div>
);
