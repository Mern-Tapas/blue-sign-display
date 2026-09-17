import { CouponsView } from "@bluesigns/ui";

export const Desktop = () => (
  <div style={{ maxWidth: 820 }}>
    <CouponsView />
  </div>
);

export const WithPageHeading = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 820 }}>
    <div className="flex flex-col gap-1">
      <h1 className="text-heading-lg">Coupons</h1>
      <p className="text-body text-fg-muted">Copy a code and apply it on the bag or payment step.</p>
    </div>
    <CouponsView />
  </div>
);
