import { CategoryGrid, sampleData } from "@bluesigns/ui";

const { categoryTiles } = sampleData;

export const CardTiles = () => (
  <div style={{ width: 1100 }}>
    <CategoryGrid items={categoryTiles} scrollOnMobile={false} className="grid-cols-6" />
  </div>
);

export const OverlayTiles = () => (
  <div style={{ width: 900 }}>
    <CategoryGrid items={categoryTiles.slice(0, 3)} variant="overlay" scrollOnMobile={false} columns={3} className="grid-cols-3" />
  </div>
);

export const SwipeRail = () => (
  <div className="overflow-hidden" style={{ width: 640 }}>
    <CategoryGrid items={categoryTiles} />
  </div>
);
