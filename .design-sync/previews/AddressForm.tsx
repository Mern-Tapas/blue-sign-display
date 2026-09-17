import { useEffect, useRef } from "react";
import { AddressForm, Button, sampleData, toast } from "@bluesigns/ui";

const { addresses } = sampleData;
const home = addresses[0]!;

// The form has no submit button of its own: submit it from anywhere with `form={id}`.
export const NewAddress = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 640 }}>
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-title">New delivery address</h2>
      <Button type="submit" form="new-address" size="sm">
        Save address
      </Button>
    </div>
    <AddressForm id="new-address" onSubmit={(a) => toast({ title: "Address saved", description: `${a.city}, ${a.state} ${a.pincode}`, tone: "success" })} />
  </div>
);

export const Prefilled = () => (
  <div style={{ maxWidth: 640 }}>
    <AddressForm
      defaultValue={{ ...home, landmark: home.landmark ?? "", isDefault: true, alternateMobile: "" }}
      onSubmit={() => toast({ title: "Address updated", tone: "success" })}
    />
  </div>
);

// Submits once on mount so the inline validation messages are visible.
export const ValidationErrors = () => {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const btn = ref.current;
    if (!btn || btn.dataset.submitted) return;
    btn.dataset.submitted = "1";
    btn.click();
    setTimeout(() => (document.activeElement as HTMLElement | null)?.blur(), 80);
  }, []);
  return (
    <div className="flex flex-col gap-4" style={{ maxWidth: 640 }}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-title">New delivery address</h2>
        <Button ref={ref} type="submit" form="invalid-address" size="sm">
          Save address
        </Button>
      </div>
      <AddressForm id="invalid-address" defaultValue={{ name: "Sujon Ahmed", mobile: "98765", house: "4B" }} onSubmit={() => {}} />
    </div>
  );
};

export const WorkAddress = () => (
  <div style={{ maxWidth: 640 }}>
    <AddressForm
      defaultValue={{ ...addresses[1]!, landmark: "Opposite Embassy Tech Square", isDefault: false, alternateMobile: "9123456780" }}
      onSubmit={() => {}}
    />
  </div>
);
