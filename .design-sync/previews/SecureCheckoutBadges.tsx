import { SecureCheckoutBadges } from "@bluesigns/ui";

export const Stack = () => (
  <div className="rounded-2xl border border-border-subtle bg-surface p-4" style={{ maxWidth: 360 }}>
    <SecureCheckoutBadges />
  </div>
);

export const RowWithDemoNote = () => (
  <div style={{ maxWidth: 720 }}>
    <SecureCheckoutBadges variant="row" demo />
  </div>
);

export const CustomMethods = () => (
  <div className="rounded-2xl border border-border-subtle bg-surface p-4" style={{ maxWidth: 360 }}>
    <SecureCheckoutBadges methods={["UPI", "RuPay", "Visa", "Net Banking"]} />
  </div>
);
