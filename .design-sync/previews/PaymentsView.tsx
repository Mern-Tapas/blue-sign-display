import { PaymentsView } from "@bluesigns/ui";

export const Desktop = () => (
  <div style={{ maxWidth: 820 }}>
    <PaymentsView />
  </div>
);

export const WithPageHeading = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 820 }}>
    <div className="flex flex-col gap-1">
      <h1 className="text-heading-lg">Saved payments</h1>
      <p className="text-body text-fg-muted">Cards are stored as secure tokens. We never keep your CVV.</p>
    </div>
    <PaymentsView />
  </div>
);
