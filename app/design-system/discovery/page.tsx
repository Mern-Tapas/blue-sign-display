import type { Metadata } from "next";
import {
  AccountMenuDemo,
  BottomNavDemo,
  CategoryStripDemo,
  DeliverToDemo,
  HeaderDemo,
  PanelsDemo,
  SearchListsDemo,
} from "@/components/docs/demos/discovery-demo";
import { DsPageHeader, DsProps, DsSection } from "@/components/docs/ds-section";

export const metadata: Metadata = { title: "Navigation & search" };

export default function DiscoveryPage() {
  return (
    <>
      <DsPageHeader
        title="Navigation"
        muted="& search"
        description="How shoppers move around the store and find things: the header, a thumb-reach bottom nav on phones, category browsing, full-screen search and the delivery PIN that shapes dates, COD and offers."
      />

      <DsSection
        title="Header"
        description="One integration point. Panels (category sheet, search, delivery location) are mounted once and opened through a shared store, so the bottom nav or a product page can open the same instance."
      >
        <HeaderDemo />
      </DsSection>

      <DsSection title="Bottom navigation" description="Phones only (below 1024 px). Five destinations with text labels, counts announced with the label, and home-indicator padding.">
        <BottomNavDemo />
      </DsSection>

      <DsSection title="Account menu" description="Grouped by task: shopping (orders, wishlist, notifications), money (coupons, gift cards, addresses, payments), then settings and help. Sign out sits last and is destructive-styled.">
        <AccountMenuDemo />
      </DsSection>

      <DsSection title="Category strip" description="Circular shortcuts with visible labels. Scroll on phones and headers, grid on landing pages; the current category is ringed and marked aria-current.">
        <CategoryStripDemo />
      </DsSection>

      <DsSection title="Category menu & search" description="Both open as dialogs: focus moves in, Escape closes, focus returns to the trigger.">
        <PanelsDemo />
      </DsSection>

      <DsSection title="Recent & trending" description="Building blocks of the search empty state, usable anywhere (zero-results pages, the search tab).">
        <SearchListsDemo />
      </DsSection>

      <DsSection title="Delivery location" description="PIN first, because it decides delivery dates, Cash on Delivery and offers. Signed-in shoppers pick a saved address; everyone can check a PIN code.">
        <DeliverToDemo />
      </DsSection>

      <DsSection title="Props">
        <div className="flex flex-col gap-5">
          <DsProps
            component="Navbar"
            rows={[
              { name: "categories · links · suggestions", type: "MegaMenuCategory[] · NavLink[] · (SearchSuggestion & { image? })[]", description: "Menu, category sheet and search overlay data." },
              { name: "user · signInHref", type: "AccountMenuUser · string", description: "Account menu when signed in, Sign in link otherwise." },
              { name: "wishlistCount · trending", type: "number · string[]", description: "Badge count and search empty-state queries." },
              { name: "showDeliverTo · savedAddresses", type: "boolean · Address[]", default: "true · —", description: "Delivery chip (xl) and bar (below xl); addresses only when signed in." },
            ]}
          />
          <DsProps
            component="MobileBottomNav"
            rows={[
              { name: "items", type: "BottomNavItem[]", description: "{ key, label, icon, href | onSelect, count?, isActive? } — defaults to Home, Categories, Wishlist, Bag, Account." },
              { name: "wishlistCount · onBagSelect", type: "number · () => void", description: "Wishlist badge; bag defaults to opening the cart drawer." },
            ]}
          />
          <DsProps
            component="AccountMenu"
            rows={[
              { name: "user", type: "{ name, email?, mobile?, avatar?, tier?, points? }", description: "Omit for the signed-out Sign in button." },
              { name: "links", type: "AccountMenuLink[][]", default: "defaultAccountLinks", description: "Groups separated by dividers; each link can show a count." },
              { name: "appearance · onSignIn · onSignOut", type: '"chip" | "avatar" · fn · fn', default: '"chip"', description: "Chip adds name and contact from md." },
            ]}
          />
          <DsProps
            component="CategoryStrip"
            rows={[
              { name: "items · activeHref", type: "{ href, label, image, tag? }[] · string", description: "Server-safe links; tag is a one-word overlay." },
              { name: "layout · size", type: '"scroll" | "grid" · "sm" | "md" | "lg"', default: '"scroll" · "md"', description: "56 / 72 / 96 px circles." },
            ]}
          />
          <DsProps
            component="SearchOverlay"
            rows={[
              { name: "open · onOpenChange", type: "boolean · fn", description: "Controlled dialog." },
              { name: "suggestions · categories · trending", type: "SearchOverlaySuggestion[] · SearchOverlayCategory[] · string[]", description: "Filtered locally here; swap for an API-backed list in production." },
              { name: "onSubmit · onSelectSuggestion · onSelectCategory", type: "fn", description: "Each saves the query to recent searches and closes the overlay." },
              { name: "maxSuggestions · placeholder", type: "number · string", default: "6", description: "Product rows after “See all results” and category matches." },
            ]}
          />
          <DsProps
            component="MobileCategoryMenu · RecentSearches · TrendingSearches"
            rows={[
              { name: "open · categories · links · userName · hrefFor", type: "MobileCategoryMenu", description: "Two-level sheet; hrefFor builds category / subcategory URLs." },
              { name: "onSelect · items · layout · max", type: 'RecentSearches — fn · string[] · "list" | "chips" · number', description: "Defaults to the stored list with remove and Clear all." },
              { name: "items · onSelect · layout", type: 'TrendingSearches — string[] · fn · "chips" | "ranked"', description: "One-tap queries." },
            ]}
          />
          <DsProps
            component="DeliverToPincode · PincodeInput"
            rows={[
              { name: "lookup", type: "(pin) => PincodeInfo | Promise<…>", description: "Resolves city, state, ETA, COD and serviceability." },
              { name: "addresses · onDetectLocation", type: "Address[] · () => Promise<string | undefined>", description: "Saved-address picker; geolocation button only when provided." },
              { name: "appearance · open · onOpenChange · onChange", type: '"chip" | "bar" · boolean · fn · fn', default: '"chip"', description: "Header chip or mobile bar; controllable for product pages." },
              { name: "value · onValueChange · onComplete", type: "PincodeInput — string · fn · fn", description: "Digits only, 6 max, auto-check on the 6th digit." },
            ]}
          />
        </div>
      </DsSection>
    </>
  );
}
