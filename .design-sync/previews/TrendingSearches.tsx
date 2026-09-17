import { TrendingSearches, sampleData, toast } from "@bluesigns/ui";

const { trendingSearches } = sampleData;
const search = (q: string) => toast({ title: `Search: “${q}”` });

export const Chips = () => (
  <div style={{ maxWidth: 420 }}>
    <TrendingSearches items={trendingSearches} onSelect={search} />
  </div>
);

export const Ranked = () => (
  <div style={{ maxWidth: 420 }}>
    <TrendingSearches layout="ranked" title="Trending this week" items={trendingSearches} onSelect={search} />
  </div>
);

export const FestiveChips = () => (
  <div style={{ maxWidth: 420 }}>
    <TrendingSearches title="Popular for Diwali" items={["Silk sarees", "Diyas", "Dry fruit gift box", "Smart watch", "Kurta sets"]} onSelect={search} />
  </div>
);
