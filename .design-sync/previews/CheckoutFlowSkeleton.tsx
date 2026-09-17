import { CheckoutFlowSkeleton } from "@bluesigns/ui";

export const Loading = () => (
  <div className="p-4">
    <CheckoutFlowSkeleton />
  </div>
);

export const NarrowColumn = () => (
  <div className="p-4" style={{ maxWidth: 420 }}>
    <CheckoutFlowSkeleton />
  </div>
);
