import { InventoryView, sampleData } from "@bluesigns/ui";

/** One row per variant, split from the admin products (same shape the /admin/inventory page passes). */
const inventoryRows = sampleData.adminProducts
  .filter((p) => p.status !== "archived")
  .flatMap((p) =>
    p.variants.map((v) => ({
      sku: v.sku,
      productId: p.id,
      productName: p.name,
      image: p.image,
      variant: v.label,
      category: p.category,
      onHand: v.stock,
      reorderPoint: p.variants.length > 1 ? Math.max(2, Math.ceil(p.reorderPoint / p.variants.length)) : p.reorderPoint,
      price: p.price,
      dailyRate: p.sold30d / 30 / p.variants.length,
    })),
  );

export const AllSkus = () => (
  <div className="flex flex-col gap-6" style={{ width: 1200 }}>
    <InventoryView initialRows={inventoryRows} initialFilter="all" />
  </div>
);

export const LowStockFilter = () => (
  <div className="flex flex-col gap-6" style={{ width: 1200 }}>
    <InventoryView initialRows={inventoryRows} initialFilter="low" />
  </div>
);
