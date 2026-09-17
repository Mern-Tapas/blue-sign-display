import { useState } from "react";
import { RecentSearches, toast } from "@bluesigns/ui";

const seed = ["Running shoes", "Aura headphones", "Oversized hoodie", "Perfume gift set", "Kurta set for Diwali"];
const search = (q: string) => toast({ title: `Search: “${q}”` });

function Controlled({ layout, title, max }: { layout?: "list" | "chips"; title?: string; max?: number }) {
  const [items, setItems] = useState(seed);
  return (
    <RecentSearches
      items={items}
      layout={layout}
      title={title}
      max={max}
      onSelect={search}
      onRemove={(q) => setItems((l) => l.filter((x) => x !== q))}
      onClear={() => setItems([])}
    />
  );
}

export const List = () => (
  <div style={{ maxWidth: 400 }}>
    <Controlled />
  </div>
);

export const Chips = () => (
  <div style={{ maxWidth: 400 }}>
    <Controlled layout="chips" title="Recent" />
  </div>
);

export const LatestThree = () => (
  <div style={{ maxWidth: 400 }}>
    <Controlled max={3} />
  </div>
);
