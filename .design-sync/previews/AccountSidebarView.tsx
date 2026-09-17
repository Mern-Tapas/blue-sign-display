import { AccountSidebarView, RewardsCard, sampleData } from "@bluesigns/ui";

const { rewards } = sampleData;

export const Desktop = () => (
  <div style={{ maxWidth: 256 }}>
    <AccountSidebarView />
  </div>
);

export const BesidePageContent = () => (
  <div className="grid gap-5" style={{ gridTemplateColumns: "240px 1fr", maxWidth: 760 }}>
    <AccountSidebarView />
    <div className="flex flex-col gap-4">
      <h1 className="text-heading-lg">BlueSigns points</h1>
      <RewardsCard {...rewards} />
    </div>
  </div>
);
