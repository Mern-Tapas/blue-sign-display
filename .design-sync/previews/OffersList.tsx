import { OffersList, sampleData } from "@bluesigns/ui";

const { bankOffers, coupons } = sampleData;

const offers = [
  ...bankOffers.map((o) => ({ id: o.id, kind: o.kind, title: o.title, detail: o.detail, terms: o.terms })),
  ...coupons.slice(0, 2).map((c) => ({ id: c.code, kind: "coupon" as const, title: `Use ${c.code}: ${c.title}`, detail: c.description, terms: c.terms })),
];

export const ProductPage = () => (
  <div style={{ maxWidth: 520 }}>
    <OffersList demo offers={offers} />
  </div>
);

export const AllVisible = () => (
  <div style={{ maxWidth: 520 }}>
    <OffersList title="Bank & wallet offers" offers={offers} visibleCount={offers.length} />
  </div>
);

export const Kinds = () => (
  <div style={{ maxWidth: 520 }}>
    <OffersList
      title="Ways to save"
      offers={[
        { id: "k1", kind: "bank", title: "10% off with HDFC Bank credit cards", detail: "Up to ₹1,250" },
        { id: "k2", kind: "emi", title: "No-cost EMI on 3 and 6 month plans" },
        { id: "k3", kind: "upi", title: "₹50 cashback on UPI" },
        { id: "k4", kind: "wallet", title: "Paytm Wallet: 5% back up to ₹100" },
        { id: "k5", kind: "partner", title: "5% unlimited cashback with BlueSigns Axis Bank card" },
        { id: "k6", kind: "coupon", title: "Use FIRST500: Flat ₹500 off", detail: "On your first order above ₹1,999" },
      ]}
      visibleCount={6}
    />
  </div>
);
