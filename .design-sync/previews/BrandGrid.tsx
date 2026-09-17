import { BrandGrid, sampleData } from "@bluesigns/ui";

const { brandTiles } = sampleData;

export const TopBrands = () => (
  <div style={{ width: 1100 }}>
    <BrandGrid brands={brandTiles} />
  </div>
);

export const ThreeUp = () => (
  <div style={{ width: 720 }}>
    <BrandGrid brands={brandTiles.slice(0, 3)} aria-label="Featured brands" className="grid-cols-3" />
  </div>
);
