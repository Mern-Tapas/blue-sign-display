import { useEffect, useRef, useState } from "react";
import { Button, CouponSheet, icons, sampleData } from "@bluesigns/ui";

const { Ticket } = icons;
const { coupons } = sampleData;

// CouponSheet owns its open state; open it by clicking its trigger once mounted.
function AutoOpen({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const trigger = ref.current?.querySelector("button");
    if (!trigger || trigger.dataset.autoOpened) return;
    trigger.dataset.autoOpened = "1";
    trigger.click();
    setTimeout(() => (document.activeElement as HTMLElement | null)?.blur(), 80);
  }, []);
  return <div ref={ref}>{children}</div>;
}

export const OpenSheet = () => {
  const [code, setCode] = useState<string | null>("BLUESIGNS20");
  return (
    <AutoOpen>
      <div style={{ maxWidth: 380 }}>
        <CouponSheet coupons={coupons} subtotal={3497} today="2026-09-15" appliedCode={code} onApply={setCode} />
      </div>
    </AutoOpen>
  );
};

export const TriggerWithCouponApplied = () => {
  const [code, setCode] = useState<string | null>("BLUESIGNS20");
  return (
    <div style={{ maxWidth: 380 }}>
      <CouponSheet coupons={coupons} subtotal={18997} today="2026-09-15" appliedCode={code} onApply={setCode} />
    </div>
  );
};

export const TriggerNoCoupon = () => {
  const [code, setCode] = useState<string | null>(null);
  return (
    <div style={{ maxWidth: 380 }}>
      <CouponSheet coupons={coupons} subtotal={3497} today="2026-09-15" appliedCode={code} onApply={setCode} />
    </div>
  );
};

export const CustomTrigger = () => {
  const [code, setCode] = useState<string | null>(null);
  return (
    <CouponSheet
      coupons={coupons}
      subtotal={3497}
      today="2026-09-15"
      appliedCode={code}
      onApply={setCode}
      trigger={
        <Button variant="soft" size="sm" leadingIcon={<Ticket aria-hidden />}>
          View coupons
        </Button>
      }
    />
  );
};
