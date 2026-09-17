import { useState } from "react";
import { CouponCard, sampleData } from "@bluesigns/ui";

const { coupons } = sampleData;
const [bluesigns20, first500, audio10, festive250] = coupons;
const today = "2026-09-15";

function ApplyableCoupons() {
  const [applied, setApplied] = useState<string | null>("FIRST500");
  return (
    <div className="grid grid-cols-2 gap-4" style={{ maxWidth: 760 }}>
      {[bluesigns20!, first500!].map((c) => (
        <CouponCard
          key={c.code}
          coupon={c}
          subtotal={4499}
          today={today}
          applied={applied === c.code}
          onApply={setApplied}
          onRemove={() => setApplied(null)}
        />
      ))}
    </div>
  );
}

export const AvailableAndApplied = () => <ApplyableCoupons />;

export const Locked = () => (
  <div style={{ maxWidth: 380 }}>
    <CouponCard coupon={audio10!} subtotal={2499} today={today} onApply={() => {}} />
  </div>
);

export const Expired = () => (
  <div style={{ maxWidth: 380 }}>
    <CouponCard coupon={festive250!} subtotal={2499} today={today} onApply={() => {}} />
  </div>
);

// Without onApply the coupon offers a copy-code action (product pages, offer banners).
export const CopyCode = () => (
  <div style={{ maxWidth: 380 }}>
    <CouponCard coupon={bluesigns20!} today={today} />
  </div>
);
