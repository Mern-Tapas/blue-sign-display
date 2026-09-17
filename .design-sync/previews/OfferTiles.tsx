import { icons, OfferTiles, sampleData } from "@bluesigns/ui";

const { bankOffers } = sampleData;
const { Banknote, BadgePercent, CreditCard, Gift, Landmark, Smartphone, Truck, Wallet } = icons;

const kindIcon = { bank: <CreditCard />, emi: <Landmark />, upi: <Smartphone />, wallet: <Wallet />, partner: <BadgePercent /> };

export const BankOffers = () => (
  <div style={{ width: 1100 }}>
    <OfferTiles
      demo
      termsHref="/help"
      offers={bankOffers.map((o) => ({ id: o.id, title: o.title, description: o.detail, source: o.bank, icon: kindIcon[o.kind], tone: "surface" as const }))}
    />
  </div>
);

export const Promotions = () => (
  <div style={{ width: 1100 }}>
    <OfferTiles
      demo
      offers={[
        { id: "first", title: "₹500 off your first order", description: "On orders above ₹2,999 · new accounts", code: "FIRST500", icon: <Gift />, tone: "accent", featured: true },
        { id: "cod", title: "Pay on delivery", description: "Cash or UPI at your door, ₹19 fee", icon: <Banknote />, tone: "contrast" },
        { id: "ship", title: "Free delivery", description: "Above ₹499 on every order", icon: <Truck />, tone: "surface", href: "/shop" },
      ]}
    />
  </div>
);
