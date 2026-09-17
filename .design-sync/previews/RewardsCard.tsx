import { RewardsCard, sampleData } from "@bluesigns/ui";

const { rewards } = sampleData;

export const GoldMember = () => (
  <div style={{ maxWidth: 520 }}>
    <RewardsCard {...rewards} />
  </div>
);

export const DemoBadge = () => (
  <div style={{ maxWidth: 520 }}>
    <RewardsCard {...rewards} demo />
  </div>
);

export const TopTier = () => (
  <div style={{ maxWidth: 520 }}>
    <RewardsCard points={6320} pointValue={0.1} tier="Platinum" />
  </div>
);

export const NewMember = () => (
  <div style={{ maxWidth: 520 }}>
    <RewardsCard points={120} pointValue={0.1} tier="Silver" nextTier="Gold" nextTierAt={1000} />
  </div>
);
