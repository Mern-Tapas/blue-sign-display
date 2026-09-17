import { ListingPageSkeleton } from "@bluesigns/ui";

// Page-level skeleton: the grid columns follow the viewport, so keep the row count small for a preview cell.
export const OneRow = () => <ListingPageSkeleton items={3} />;

export const NarrowColumn = () => (
  <div style={{ maxWidth: 420 }}>
    <ListingPageSkeleton items={6} />
  </div>
);
