import { SecurityView } from "@bluesigns/ui";

export const Desktop = () => (
  <div style={{ maxWidth: 820 }}>
    <SecurityView />
  </div>
);

export const WithPageHeading = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 820 }}>
    <h1 className="text-heading-lg">Login &amp; security</h1>
    <SecurityView />
  </div>
);
