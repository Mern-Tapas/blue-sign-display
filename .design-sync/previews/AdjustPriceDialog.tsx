import { AdjustPriceDialog, sampleData } from "@bluesigns/ui";

const { adminProducts } = sampleData;

export const BulkDecrease = () => (
  <AdjustPriceDialog open onOpenChange={() => {}} products={adminProducts.slice(0, 6)} onApply={() => {}} />
);

export const SingleProduct = () => (
  <AdjustPriceDialog open onOpenChange={() => {}} products={adminProducts.slice(4, 5)} onApply={() => {}} />
);
