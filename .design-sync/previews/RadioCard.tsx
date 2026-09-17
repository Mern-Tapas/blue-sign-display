import { Badge, RadioCard, RadioCardGroup, formatPrice, icons } from "@bluesigns/ui";

const { Truck, Zap, MapPin } = icons;

export const WithAside = () => (
  <div style={{ maxWidth: 420 }}>
    <RadioCardGroup defaultValue="express" aria-label="Shipping method">
      <RadioCard value="standard" icon={<Truck aria-hidden />} title="Standard" description="Delivery in 3–5 days" aside="Free" />
      <RadioCard value="express" icon={<Zap aria-hidden />} title="Express" description="Tomorrow by 9 PM" aside={formatPrice(99)} />
    </RadioCardGroup>
  </div>
);

export const MultiLine = () => (
  <div style={{ maxWidth: 420 }}>
    <RadioCardGroup defaultValue="home" aria-label="Delivery address">
      <RadioCard value="home" align="start" icon={<MapPin aria-hidden />} title="Priya Sharma" description="Flat 402, Prestige Lakeside, Varthur Road, Bengaluru 560087">
        <span className="mt-2 flex gap-2">
          <Badge size="sm">Home</Badge>
          <Badge size="sm" tone="success">
            Default
          </Badge>
        </span>
      </RadioCard>
    </RadioCardGroup>
  </div>
);

export const States = () => (
  <div className="flex flex-col gap-3" style={{ maxWidth: 320 }}>
    <RadioCardGroup defaultValue="upi" aria-label="Selected">
      <RadioCard value="upi" size="sm" title="UPI" description="GPay, PhonePe" />
    </RadioCardGroup>
    <RadioCardGroup aria-label="Unselected">
      <RadioCard value="card" size="sm" title="Card" description="RuPay, Visa, Mastercard" />
    </RadioCardGroup>
    <RadioCardGroup aria-label="Disabled">
      <RadioCard value="cod" size="sm" title="Cash on Delivery" description="Not for this PIN" disabled />
    </RadioCardGroup>
    <RadioCardGroup aria-label="Invalid">
      <RadioCard value="emi" size="sm" title="EMI" description="Choose a plan to continue" aria-invalid />
    </RadioCardGroup>
  </div>
);
