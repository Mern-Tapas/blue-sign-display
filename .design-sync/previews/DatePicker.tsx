import { useEffect, useRef } from "react";
import { DatePicker, Field } from "@bluesigns/ui";

// Fixed reference date so the preview always shows the same month.
const REF = new Date(2026, 8, 15);
const day = (n: number) => new Date(2026, 8, 15 + n);

// DatePicker keeps its open state internally; for this static preview we click the trigger once on mount.
function OpenOnMount({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"], button')?.click();
  }, []);
  return <div ref={ref}>{children}</div>;
}

export const PickupDate = () => (
  <div style={{ maxWidth: 340 }}>
    <OpenOnMount>
      <Field label="Pickup date" required>
        <DatePicker defaultValue={day(3)} min={day(1)} max={day(7)} defaultMonth={REF} format={{ weekday: "short", day: "numeric", month: "short" }} />
      </Field>
    </OpenOnMount>
  </div>
);

export const States = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 340 }}>
    <Field label="Date of birth" hint="Used for birthday offers only.">
      <DatePicker captionLayout="dropdown" defaultMonth={new Date(1995, 5, 1)} fromYear={1930} toYear={2012} max={new Date(2012, 11, 31)} placeholder="DD MMM YYYY" clearable />
    </Field>
    <Field label="Return pickup">
      <DatePicker defaultValue={day(2)} defaultMonth={REF} clearable />
    </Field>
    <Field label="Delivery date" error="Pick a date within the next 7 days">
      <DatePicker defaultMonth={REF} placeholder="Select a date" />
    </Field>
    <Field label="Disabled">
      <DatePicker disabled placeholder="Not editable" />
    </Field>
  </div>
);
