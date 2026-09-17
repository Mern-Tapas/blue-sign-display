import { AddressesView } from "@bluesigns/ui";

export const Desktop = () => (
  <div style={{ maxWidth: 820 }}>
    <AddressesView />
  </div>
);

export const WithPageHeading = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 820 }}>
    <div className="flex flex-col gap-1">
      <h1 className="text-heading-lg">Addresses</h1>
      <p className="text-body text-fg-muted">Your default address is used first at checkout.</p>
    </div>
    <AddressesView />
  </div>
);
