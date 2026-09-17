import { AdjustStockDialog, sampleData } from "@bluesigns/ui";

const product = sampleData.adminProducts.find((p) => p.variants.length > 1) ?? sampleData.adminProducts[0]!;
const variant = product.variants[0]!;

/** One inventory row (one SKU / variant), shaped like the inventory screen's rows. */
const row = {
  sku: variant.sku,
  productId: product.id,
  productName: product.name,
  image: product.image,
  variant: variant.label,
  category: product.category,
  onHand: 6,
  reorderPoint: 4,
  price: product.price,
  dailyRate: 1.4,
};

export const ReceiveStock = () => <AdjustStockDialog row={row} open onOpenChange={() => {}} onSave={() => {}} />;
