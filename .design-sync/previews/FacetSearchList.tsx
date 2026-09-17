import { useState } from "react";
import { FacetSearchList } from "@bluesigns/ui";

const brands = ["Sonora", "Hale & Co", "Stride", "Common Thread", "Carry Supply", "Maison Lune", "Clear Days", "Form Studio", "Aurel", "Northwind", "Meridian", "Kinetic"].map((b, i) => ({
  value: b,
  count: [2, 2, 4, 3, 1, 1, 1, 2, 0, 5, 3, 2][i],
}));

function Demo({ name, options, initial, visibleCount }: { name: string; options: { value: string; count?: number }[]; initial: string[]; visibleCount?: number }) {
  const [selected, setSelected] = useState(initial);
  return (
    <FacetSearchList
      name={name}
      options={options}
      selected={selected}
      visibleCount={visibleCount}
      onToggle={(v) => setSelected((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]))}
    />
  );
}

export const Brands = () => (
  <div style={{ maxWidth: 300 }}>
    <Demo name="Brands" options={brands} initial={["Stride"]} />
  </div>
);

export const ShortList = () => (
  <div style={{ maxWidth: 300 }}>
    <Demo
      name="Fabrics"
      options={[
        { value: "Cotton", count: 42 },
        { value: "Linen", count: 12 },
        { value: "Silk", count: 8 },
        { value: "Rayon", count: 17 },
      ]}
      initial={[]}
    />
  </div>
);

export const MultipleSelected = () => (
  <div style={{ maxWidth: 300 }}>
    <Demo name="Brands" options={brands} initial={["Northwind", "Meridian", "Sonora"]} visibleCount={4} />
  </div>
);
