import { Button, PriceDetails, computeBagTotals, sampleData } from "@bluesigns/ui";

const { coupons } = sampleData;

const bagLines = [
  { price: 12999, compareAt: 16999, quantity: 1 },
  { price: 2999, compareAt: 4499, quantity: 1 },
  { price: 1499, compareAt: 1999, quantity: 2 },
];

export const WithCoupon = () => (
  <div style={{ maxWidth: 380 }}>
    <PriceDetails id="bag-price-details" totals={computeBagTotals(bagLines, { coupon: coupons[0], giftWrap: true })} />
  </div>
);

export const CouponAction = () => (
  <div style={{ maxWidth: 380 }}>
    <PriceDetails
      totals={computeBagTotals([{ price: 399, compareAt: 599, quantity: 1 }])}
      couponAction={
        <Button variant="link" size="sm">
          Apply coupon
        </Button>
      }
    />
  </div>
);

export const ExpressAndCod = () => (
  <div style={{ maxWidth: 380 }}>
    <PriceDetails title="Order total" totals={computeBagTotals([{ price: 3499, quantity: 1 }], { express: true, cod: true })} />
  </div>
);

export const PlainCompact = () => (
  <div className="rounded-xl bg-surface-sunken p-4" style={{ maxWidth: 360 }}>
    <PriceDetails variant="plain" compact totals={computeBagTotals(bagLines, { coupon: coupons[1] })} />
  </div>
);
