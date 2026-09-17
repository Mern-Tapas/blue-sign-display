import { CouponsWallet, sampleData } from "@bluesigns/ui";

const { coupons } = sampleData;

export const ActiveCoupons = () => (
  <div style={{ maxWidth: 820 }}>
    <CouponsWallet coupons={coupons} today="2026-09-16" />
  </div>
);

export const AfterFestiveSeason = () => (
  <div style={{ maxWidth: 820 }}>
    <CouponsWallet coupons={coupons} today="2026-11-15" />
  </div>
);

export const NoActiveCoupons = () => (
  <div style={{ maxWidth: 820 }}>
    <CouponsWallet coupons={coupons.slice(3)} today="2026-09-16" />
  </div>
);
