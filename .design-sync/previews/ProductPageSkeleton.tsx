import { ProductPageSkeleton } from "@bluesigns/ui";

// Below the lg breakpoint the gallery stacks above the details; a narrow column keeps both in view.
export const Default = () => (
  <div style={{ maxWidth: 300 }}>
    <ProductPageSkeleton />
  </div>
);
