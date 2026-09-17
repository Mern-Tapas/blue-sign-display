import { CategoryTile, sampleData } from "@bluesigns/ui";

const { categoryTiles } = sampleData;

export const Card = () => (
  <div className="grid grid-cols-3 gap-4" style={{ width: 600 }}>
    {categoryTiles.slice(0, 3).map((c) => (
      <CategoryTile key={c.href} {...c} />
    ))}
  </div>
);

export const Overlay = () => (
  <div className="grid grid-cols-2 gap-4" style={{ width: 720 }}>
    {categoryTiles.slice(3, 5).map((c) => (
      <CategoryTile key={c.href} {...c} variant="overlay" />
    ))}
  </div>
);

export const Bento = () => (
  <div className="grid grid-cols-2 gap-4" style={{ width: 640 }}>
    <div style={{ gridRow: "span 2" }}>
      <CategoryTile {...categoryTiles[0]!} variant="overlay" className="h-full" />
    </div>
    {categoryTiles.slice(1, 3).map((c) => (
      <CategoryTile key={c.href} {...c} variant="overlay" />
    ))}
  </div>
);
