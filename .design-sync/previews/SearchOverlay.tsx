import { useState } from "react";
import { SearchOverlay, recentSearches, sampleData, toast } from "@bluesigns/ui";

const { searchSuggestions, navCategories, trendingSearches } = sampleData;

// Recent searches are stored per device; seed a few so the empty state shows them.
["Perfume gift set", "Hoodie", "Aura headphones", "Running shoes"].forEach((q) => recentSearches.add(q));

function Open({ trending = true, categories = true }: { trending?: boolean; categories?: boolean }) {
  const [open, setOpen] = useState(true);
  return (
    <SearchOverlay
      open={open}
      onOpenChange={setOpen}
      suggestions={searchSuggestions}
      categories={categories ? navCategories : undefined}
      trending={trending ? trendingSearches : undefined}
      placeholder="Search for products, brands and more"
      onSubmit={(q) => toast({ title: `Search: “${q}”` })}
      onSelectSuggestion={(s) => toast({ title: `Open ${s.label}` })}
      onSelectCategory={(slug) => toast({ title: `Open category ${slug}` })}
    />
  );
}

export const EmptyState = () => <Open />;

export const RecentOnly = () => <Open trending={false} categories={false} />;
