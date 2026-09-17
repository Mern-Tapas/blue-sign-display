import { Field, PhoneInput } from "@bluesigns/ui";

export const MobileNumber = () => (
  <div style={{ maxWidth: 360 }}>
    <Field label="Mobile number" hint="We’ll send a one-time password to this number." required>
      <PhoneInput defaultValue="9876543210" />
    </Field>
  </div>
);

export const States = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 360 }}>
    <Field label="Mobile number">
      <PhoneInput />
    </Field>
    <Field label="Mobile number" error="Enter a valid 10-digit mobile number" required>
      <PhoneInput defaultValue="98765" />
    </Field>
    <Field label="Registered mobile" hint="Contact support to change it">
      <PhoneInput defaultValue="9876543210" disabled />
    </Field>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-col gap-3" style={{ maxWidth: 360 }}>
    <PhoneInput aria-label="Mobile, small" size="sm" defaultValue="9123456780" />
    <PhoneInput aria-label="Mobile, large" size="lg" variant="sunken" defaultValue="9123456780" />
  </div>
);
