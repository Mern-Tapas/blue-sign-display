import { ProductCardSkeleton } from "@bluesigns/ui";

export const Grid = () => (
  <div className="grid grid-cols-3 gap-4" style={{ maxWidth: 720 }}>
    <ProductCardSkeleton />
    <ProductCardSkeleton />
    <ProductCardSkeleton />
  </div>
);

export const List = () => (
  <div className="flex flex-col gap-3" style={{ maxWidth: 640 }}>
    <ProductCardSkeleton layout="list" />
    <ProductCardSkeleton layout="list" />
  </div>
);
