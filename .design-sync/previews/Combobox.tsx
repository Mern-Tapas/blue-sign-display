import { useEffect, useRef } from "react";
import { Combobox, Field, icons, sampleData } from "@bluesigns/ui";

const { Landmark } = icons;
const { INDIAN_STATES, banks } = sampleData;

const stateOptions = INDIAN_STATES.map((s) => ({ value: s, label: s }));
const bankOptions = banks.map((b) => ({ value: b.id, label: b.name, icon: <Landmark aria-hidden /> }));
const brandOptions = ["Sonora", "Aurel", "Northwind", "Meridian", "Kinetic", "Halden"].map((b, i) => ({
  value: b,
  label: b,
  description: `${[128, 96, 74, 61, 40, 33][i]} products`,
}));

// Combobox keeps its open state internally; for this static preview we click the trigger once on mount.
function OpenOnMount({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>('[data-slot="combobox-trigger"]')?.click();
  }, []);
  return <div ref={ref}>{children}</div>;
}

export const BankPicker = () => (
  <div style={{ maxWidth: 360 }}>
    <OpenOnMount>
      <Field label="Bank" hint="Popular banks are pinned until you search.">
        <Combobox
          options={bankOptions}
          popularValues={banks.filter((b) => b.popular).map((b) => b.id)}
          placeholder="Choose your bank"
          searchPlaceholder="Search banks"
        />
      </Field>
    </OpenOnMount>
  </div>
);

export const States = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 360 }}>
    <Field label="State" required>
      <Combobox options={stateOptions} defaultValue="Karnataka" placeholder="Select state" searchPlaceholder="Search states" required />
    </Field>
    <Field label="Brand">
      <Combobox multiple options={brandOptions} defaultValue={["Sonora", "Aurel", "Meridian"]} placeholder="Any brand" searchPlaceholder="Search brands" />
    </Field>
    <Field label="Disabled">
      <Combobox options={stateOptions} defaultValue="Delhi" disabled />
    </Field>
    <Field label="Shipping state" error="Select a state to continue">
      <Combobox options={stateOptions} placeholder="Select state" />
    </Field>
  </div>
);
