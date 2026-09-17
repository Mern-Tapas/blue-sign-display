import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CardVariantsDemo, CompareTableDemo, FacetSearchDemo, MobileFiltersDemo } from "@/components/docs/demos/listing-demo";
import { DsPageHeader, DsPreview, DsProps, DsSection } from "@/components/docs/ds-section";
import { ListingHeader } from "@/components/listing/listing-header";
import { SearchResultsHeader } from "@/components/listing/search-results-header";
import { ZeroResults } from "@/components/listing/zero-results";
import { RatingPill } from "@/components/reviews/rating-pill";
import { trendingSearches } from "@/lib/data/india";
import { categories, priceBounds, products } from "@/lib/data/products";
import { FilterableGrid } from "@/components/docs/demos/filters-demo";
import { ProductCard, ProductCardSkeleton } from "@/components/commerce/product-card";

export const metadata: Metadata = { title: "Listing & search" };

export default function ListingPage() {
  const strip = categories.map((c) => ({ href: `/shop?category=${c.slug}`, label: c.name, image: c.image }));
  return (
    <>
      <DsPageHeader
        title="Listing"
        muted="& search results"
        description="Everything between a category link or a search and a product page. The live version is the store’s /shop route — try /shop?q=hedphones for the spelling fallback."
      />

      <DsSection title="Headers" description="Category pages lead with breadcrumbs, the name and a live item count; search pages repeat the query, correct spelling and suggest related searches.">
        <div className="flex flex-col gap-5">
          <DsPreview label="ListingHeader" className="block">
            <ListingHeader
              breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Audio" }]}
              title="Audio"
              muted="collection"
              count={128}
              description="Headphones and speakers tuned for everyday listening."
              subcategories={[
                { href: "/shop?category=audio", label: "All audio", active: true },
                { href: "/shop?category=audio&q=over-ear", label: "Over-ear" },
                { href: "/shop?category=audio&q=in-ear", label: "In-ear" },
                { href: "/shop?category=audio&q=speaker", label: "Speakers" },
              ]}
            />
          </DsPreview>
          <DsPreview label="SearchResultsHeader" className="flex-col items-stretch gap-8">
            <SearchResultsHeader query="hedphones" correction="headphones" autoCorrected count={2} related={["Noise cancelling headphones", "Earbuds"]} />
            <SearchResultsHeader query="sneker" correction="sneaker" count={3} />
          </DsPreview>
        </div>
      </DsSection>

      <DsSection title="Product card" description="Listing cards now carry the Indian price line (price · MRP · % off), a rating pill, delivery speed, stock warnings, a Sponsored label for paid placements, and slots for quick view and compare.">
        <CardVariantsDemo />
      </DsSection>

      <DsSection title="Rating pill" description="Score first, star second, count after a divider. Soft tones keep AA contrast; the number carries the meaning.">
        <DsPreview>
          <RatingPill value={4.6} count={1284} />
          <RatingPill value={3.4} count={87} size="md" />
          <RatingPill value={2.1} count={12} size="lg" />
          <RatingPill value={4.2} />
        </DsPreview>
      </DsSection>

      <DsSection title="Facets" description="Facets are defined once (buildFacetSections) and rendered as the desktop accordion or the phone two-pane sheet. Long lists get search and “+N more”.">
        <div className="flex flex-col gap-5">
          <FacetSearchDemo />
          <MobileFiltersDemo />
        </div>
      </DsSection>

      <DsSection title="Compare" description="Up to four products from one category. The tray floats above the phone bottom nav; the table can hide rows where every product matches.">
        <CompareTableDemo />
      </DsSection>

      <DsSection title="Zero results" description="Never a dead end: say why, offer the correction or clearing filters, then popular searches and categories.">
        <div className="flex flex-col gap-5">
          <ZeroResults query="purple toaster" popularSearches={trendingSearches} categories={strip} />
          <ZeroResults hasFilters clearAction={<Button variant="secondary">Clear filters</Button>} />
        </div>
      </DsSection>

      <DsSection title="Product card" description="Grid cards swap the image and reveal Quick add on hover-capable pointers; list cards suit comparison. Badges, colour dots, stock notes and sale pricing are data-driven; skeletons hold the same shape while loading.">
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[products[0]!, products[3]!, products[6]!, products[9]!].map((p, i) => (
              <ProductCard key={p.id} product={p} preload={i < 2} />
            ))}
          </div>
          <ProductCard product={products[4]!} layout="list" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        </div>
      </DsSection>

      <DsSection title="Filterable product grid" description="FilterSidebar, PriceRange, ActiveFilterChips, SortSelect and FilterBar share one FilterState (lib/filters.ts) with parse / serialize helpers for URL sync. Fully interactive with local state; below lg, filters move into a sheet.">
        <FilterableGrid products={products} categories={categories} priceBounds={priceBounds} initial={{ categories: ["footwear", "audio"] }} />
      </DsSection>

      <DsSection title="Props">
        <div className="flex flex-col gap-5">
          <DsProps
            component="ProductCard (updated)"
            rows={[
              { name: "ratingStyle", type: '"pill" | "stars"', default: '"pill"', description: "Rating pill with compact count, or the previous star row." },
              { name: "imageActions · footer", type: "ReactNode", description: "Quick view trigger beside Quick add; compare toggle under the price." },
              { name: "product.sponsored · product.deliveryDays", type: "boolean · number", description: "Sponsored label; “Get it by tomorrow” when 1." },
            ]}
          />
          <DsProps
            component="FilterSidebar (updated) · buildFacetSections"
            rows={[
              { name: "facets · categoryNames · priceBounds · value · onChange", type: "as before", description: "Adds Discount (10/30/50/70% and above) and Delivery time facets; brands use FacetSearchList." },
              { name: "defaultOpen", type: "string[]", default: '["category","brand","price","discount","delivery"]', description: "Sections expanded initially." },
              { name: "FilterState.discount · FilterState.delivery", type: "number | null", description: "URL params ?discount=30&delivery=1." },
            ]}
          />
          <DsProps
            component="ListingHeader · SearchResultsHeader"
            rows={[
              { name: "breadcrumbs · title · muted · count · description · subcategories", type: "ListingHeader", description: "Only pass subcategory links that really filter." },
              { name: "query · count · correction · autoCorrected · related · hrefFor", type: "SearchResultsHeader", description: "autoCorrected shows corrected results with “Search instead for”." },
            ]}
          />
          <DsProps
            component="FacetSearchList · MobileFilterSheet · SortSheet · MobileListingToolbar"
            rows={[
              { name: "name · options · selected · onToggle · visibleCount · searchThreshold", type: "FacetSearchList", description: "Search appears above the threshold; selected pinned first." },
              { name: "trigger · value · onApply · countResults", type: "MobileFilterSheet", description: "Drafts changes; Apply button shows the live count." },
              { name: "trigger · value · onValueChange · options", type: "SortSheet", description: "Applies and closes on tap." },
              { name: "value · onChange · facets · categoryNames · priceBounds · countResults", type: "MobileListingToolbar", description: "Sticky Sort | Filter halves, hidden from lg." },
            ]}
          />
          <DsProps
            component="QuickViewDialog · CompareToggle · CompareTray · CompareTable · ZeroResults"
            rows={[
              { name: "product · trigger", type: "QuickViewDialog", description: "Gallery, price, variants, add to bag and a full-details link." },
              { name: "product · categoryName", type: "CompareToggle", description: "Same-category rule with a “Start new” toast action; max 4." },
              { name: "products", type: "CompareTray · CompareTable", description: "Tray resolves stored slugs; table has a differences-only switch." },
              { name: "query · correction · hasFilters · clearAction · popularSearches · categories", type: "ZeroResults", description: "Tips for searches, clear action for over-filtering." },
            ]}
          />
        </div>
      </DsSection>
    </>
  );
}
