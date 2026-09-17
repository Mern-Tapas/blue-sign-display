import { useEffect, useRef } from "react";
import { Button, CancelOrderDialog, icons } from "@bluesigns/ui";

const { PackageX } = icons;
const wait = (ms = 900) => new Promise<void>((r) => setTimeout(r, ms));

// CancelOrderDialog owns its open state; open it by clicking its trigger once mounted.
function AutoOpen({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const trigger = ref.current?.querySelector("button");
    if (!trigger || trigger.dataset.autoOpened) return;
    trigger.dataset.autoOpened = "1";
    trigger.click();
    setTimeout(() => (document.activeElement as HTMLElement | null)?.blur(), 120);
  }, []);
  return <div ref={ref}>{children}</div>;
}

export const PrepaidOrder = () => (
  <AutoOpen>
    <CancelOrderDialog orderId="LM-100482" amount={21596} paymentMethod="UPI · sujon@okaxis" onConfirm={() => wait()} />
  </AutoOpen>
);

export const CashOnDeliveryOrder = () => (
  <AutoOpen>
    <CancelOrderDialog orderId="LM-100251" amount={3499} paymentMethod="Cash on Delivery" isCod onConfirm={() => wait()} />
  </AutoOpen>
);

export const Triggers = () => (
  <div className="flex flex-wrap items-center gap-3">
    <CancelOrderDialog orderId="LM-100251" amount={3499} paymentMethod="Cash on Delivery" isCod onConfirm={() => wait()} />
    <CancelOrderDialog
      orderId="LM-100482"
      amount={21596}
      paymentMethod="UPI · sujon@okaxis"
      onConfirm={() => wait()}
      trigger={
        <Button variant="danger" size="sm" leadingIcon={<PackageX aria-hidden />}>
          Cancel entire order
        </Button>
      }
    />
  </div>
);
