import { BagPageSkeleton } from "@bluesigns/ui";

export const SingleItem = () => <BagPageSkeleton items={1} />;

export const Narrow = () => (
  <div style={{ maxWidth: 420 }}>
    <BagPageSkeleton items={1} />
  </div>
);
