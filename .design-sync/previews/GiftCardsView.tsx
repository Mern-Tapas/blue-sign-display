import { GiftCardsView } from "@bluesigns/ui";

export const Desktop = () => (
  <div style={{ maxWidth: 820 }}>
    <GiftCardsView />
  </div>
);

export const WithPageHeading = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 820 }}>
    <div className="flex flex-col gap-1">
      <h1 className="text-heading-lg">Gift cards</h1>
      <p className="text-body text-fg-muted">Balances are applied on the payment step.</p>
    </div>
    <GiftCardsView />
  </div>
);
