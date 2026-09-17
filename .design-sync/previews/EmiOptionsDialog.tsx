import { useEffect, useRef } from "react";
import { Button, EmiOptionsDialog, formatPrice, sampleData } from "@bluesigns/ui";

const { banks, emiAmount, emiPlans, getProduct } = sampleData;
const headphones = getProduct("aura-wireless-headphones")!;
const watch = getProduct("meridian-classic-watch")!;

// EmiBank[]: { id, name, plans } built from the bank list and per-bank plans.
const emiBanks = Object.entries(emiPlans).map(([id, plans]) => ({ id, name: banks.find((b) => b.id === id)?.name ?? id, plans }));

const lowestEmi = Math.min(...emiBanks.flatMap((b) => b.plans.map((p) => emiAmount(headphones.price, p.months, p.interestRate))));

// The dialog manages its own open state; this wrapper presses the trigger so the card shows it open.
function OpenOnMount({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    ref.current?.querySelector("button")?.click();
  }, []);
  return <span ref={ref}>{children}</span>;
}

export const Plans = () => (
  <OpenOnMount>
    <p className="text-body text-fg-muted">
      EMI from <span className="font-medium text-fg">{formatPrice(lowestEmi)}</span>/month <EmiOptionsDialog price={headphones.price} banks={emiBanks} demo />
    </p>
  </OpenOnMount>
);

export const CustomTrigger = () => (
  <OpenOnMount>
    <EmiOptionsDialog
      price={watch.price}
      banks={emiBanks.slice(1)}
      trigger={
        <Button variant="secondary" size="sm">
          Compare EMI plans
        </Button>
      }
    />
  </OpenOnMount>
);
