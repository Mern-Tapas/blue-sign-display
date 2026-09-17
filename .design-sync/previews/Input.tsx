import { Field, Input, icons } from "@bluesigns/ui";

const { Mail, AtSign, Search } = icons;

export const Variants = () => (
  <div className="flex flex-col gap-3" style={{ maxWidth: 380 }}>
    <Input aria-label="Full name" placeholder="Full name" />
    <Input aria-label="Search orders" variant="sunken" placeholder="Search orders" startSlot={<Search aria-hidden />} />
    <Input aria-label="Company" shape="rounded" placeholder="Company (optional)" />
  </div>
);

export const Sizes = () => (
  <div className="flex flex-col gap-3" style={{ maxWidth: 380 }}>
    <Input aria-label="Small" size="sm" placeholder="Small · 32px" />
    <Input aria-label="Medium" size="md" placeholder="Medium · 40px" />
    <Input aria-label="Large" size="lg" placeholder="Large · 48px" />
  </div>
);

export const States = () => (
  <div className="flex flex-col gap-3" style={{ maxWidth: 380 }}>
    <Input aria-label="Filled" defaultValue="maria@bluesigns.shop" startSlot={<Mail aria-hidden />} />
    <Input aria-label="Invalid" aria-invalid defaultValue="maria@" startSlot={<Mail aria-hidden />} />
    <Input aria-label="Disabled" disabled placeholder="Unavailable" startSlot={<AtSign aria-hidden />} />
    <Input aria-label="Order ID" value="LM-200600" readOnly />
  </div>
);

export const ClearableAndStatus = () => (
  <div className="grid grid-cols-2 gap-4" style={{ maxWidth: 560 }}>
    <Field label="Handle" hint="Clears, then re-checks">
      <Input value="everyday-sneaker" onChange={() => {}} clearable onClear={() => {}} status="valid" statusLabel="Available" />
    </Field>
    <Field label="SKU" hint="Checking the catalog">
      <Input defaultValue="BS-SNK-042" status="checking" statusLabel="Checking availability" />
    </Field>
  </div>
);
