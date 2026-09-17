import { Button, ZeroResults, icons, sampleData } from "@bluesigns/ui";

const { navCategories, trendingSearches } = sampleData;
const { X } = icons;
const strip = navCategories.map((c) => ({ href: `/shop?category=${c.slug}`, label: c.name, image: c.image }));

export const NoSearchResults = () => (
  <div style={{ maxWidth: 820 }}>
    <ZeroResults query="bluetooth tie" popularSearches={trendingSearches} categories={strip} />
  </div>
);

export const WithCorrection = () => (
  <div style={{ maxWidth: 820 }}>
    <ZeroResults query="snekers" correction="sneakers" popularSearches={trendingSearches.slice(0, 4)} />
  </div>
);

export const FiltersTooNarrow = () => (
  <div style={{ maxWidth: 820 }}>
    <ZeroResults
      hasFilters
      clearAction={
        <Button variant="secondary" leadingIcon={<X aria-hidden />}>
          Clear all filters
        </Button>
      }
      categories={strip}
    />
  </div>
);
