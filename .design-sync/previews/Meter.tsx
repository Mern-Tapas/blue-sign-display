import { Meter } from "@bluesigns/ui";

export const Thresholds = () => (
  <div className="flex flex-col gap-5" style={{ width: 420 }}>
    <Meter label="COD exposure today" value={38400} max={100000} valueLabel="₹38,400 of ₹1,00,000" />
    <Meter label="Shipping credits used" value={8200} max={10000} valueLabel="8,200 of 10,000" />
    <Meter label="Coupon BLUESIGNS20 redemptions" value={4720} max={5000} valueLabel="4,720 of 5,000" />
  </div>
);

export const Percentage = () => (
  <div style={{ width: 420 }}>
    <Meter label="Catalogue image storage" value={3.1} max={10} />
  </div>
);
