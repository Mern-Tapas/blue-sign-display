"use client";

import { useState } from "react";
import { LayoutGrid, Search } from "lucide-react";
import { AccountMenu } from "@/components/layout/account-menu";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { MobileCategoryMenu } from "@/components/layout/mobile-category-menu";
import { Navbar } from "@/components/layout/navbar";
import { recentSearches } from "@/components/providers/search-store";
import { DsGrid, DsPreview } from "@/components/docs/ds-section";
import { toast } from "@/components/providers/toast-store";
import { CategoryStrip } from "@/components/search/category-strip";
import { DeliverToPincode } from "@/components/search/deliver-to-pincode";
import { RecentSearches } from "@/components/search/recent-searches";
import { SearchOverlay } from "@/components/search/search-overlay";
import { TrendingSearches } from "@/components/search/trending-searches";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { addresses, lookupPincode, trendingSearches } from "@/lib/data/india";
import { demoUser, navCategories, searchSuggestions } from "@/lib/data/session";

const wait = (ms = 600) => new Promise((r) => setTimeout(r, ms));
const stripItems = navCategories.map((c, i) => ({ href: `/shop?category=${c.slug}`, label: c.name, image: c.image, tag: i === 2 ? "New" : undefined }));

function DemoNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex flex-wrap items-center gap-2 text-caption text-fg-muted">
      <Badge tone="accent" size="sm">
        Demo
      </Badge>
      {children}
    </p>
  );
}

export function HeaderDemo() {
  return (
    <div className="flex flex-col gap-5">
      <DsPreview label="Navbar · signed in" surface="canvas" overflowVisible className="block min-h-40 p-4">
        <Navbar className="static px-0 pt-0" categories={navCategories} suggestions={searchSuggestions} user={demoUser} savedAddresses={addresses} wishlistCount={3} />
        <DemoNote>Press “/” to open search · the delivery chip shows from 1280 px, the bar below it on smaller screens</DemoNote>
      </DsPreview>
      <DsPreview label="Navbar · signed out" surface="canvas" overflowVisible className="block p-4">
        <Navbar className="static px-0 pt-0" categories={navCategories} suggestions={searchSuggestions} showDeliverTo={false} mountPanels={false} />
      </DsPreview>
    </div>
  );
}

export function BottomNavDemo() {
  return (
    <DsPreview label="MobileBottomNav" surface="sunken" className="block p-0">
      <div className="mx-auto flex h-72 max-w-sm flex-col justify-end overflow-hidden rounded-t-2xl border-x border-t border-border bg-canvas">
        <p className="m-auto px-6 text-center text-body text-fg-muted">Phone viewport. Categories opens the category sheet, Bag opens the cart drawer.</p>
        <MobileBottomNav className="static lg:block" wishlistCount={3} />
      </div>
    </DsPreview>
  );
}

export function AccountMenuDemo() {
  return (
    <DsPreview label="AccountMenu" overflowVisible className="gap-6">
      <AccountMenu user={demoUser} onSignOut={() => toast({ title: "Signed out", tone: "info" })} />
      <AccountMenu user={{ name: "Ananya Iyer", mobile: "9812345678" }} appearance="avatar" onSignOut={() => toast({ title: "Signed out" })} />
      <AccountMenu onSignIn={() => toast({ title: "Opens sign-in" })} />
    </DsPreview>
  );
}

export function CategoryStripDemo() {
  return (
    <div className="flex flex-col gap-5">
      <DsPreview label="CategoryStrip · scroll" className="block">
        <CategoryStrip items={[...stripItems, ...stripItems.map((i) => ({ ...i, href: `${i.href}&sale=1`, label: `${i.label} sale`, tag: undefined }))]} activeHref={stripItems[0]!.href} className="[&_ul]:mx-0 [&_ul]:px-0" />
      </DsPreview>
      <DsGrid>
        <DsPreview label="Grid · large" className="block">
          <CategoryStrip items={stripItems} layout="grid" size="lg" />
        </DsPreview>
        <DsPreview label="Small" className="block">
          <CategoryStrip items={stripItems} size="sm" className="[&_ul]:mx-0 [&_ul]:px-0" />
        </DsPreview>
      </DsGrid>
    </div>
  );
}

export function PanelsDemo() {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  return (
    <DsGrid>
      <DsPreview label="MobileCategoryMenu" className="flex-col items-start">
        <Button variant="secondary" leadingIcon={<LayoutGrid aria-hidden />} onClick={() => setMenu(true)}>
          Open category menu
        </Button>
        <p className="text-caption text-fg-muted">Two levels: category, then subcategories with “Shop all”. Focus follows each level.</p>
        <MobileCategoryMenu open={menu} onOpenChange={setMenu} categories={navCategories} links={[{ href: "/shop?sort=newest", label: "New in" }]} userName={demoUser.name} />
      </DsPreview>
      <DsPreview label="SearchOverlay" className="flex-col items-start">
        <Button variant="secondary" leadingIcon={<Search aria-hidden />} onClick={() => setSearch(true)}>
          Open search
        </Button>
        <p className="text-caption text-fg-muted">Full screen on phones, top panel from 640 px. Try “head”, “aud” or “sonora”.</p>
        <SearchOverlay
          open={search}
          onOpenChange={setSearch}
          suggestions={searchSuggestions}
          categories={navCategories}
          trending={trendingSearches}
          onSubmit={(q) => toast({ title: `Search: “${q}”`, description: "Saved to recent searches" })}
          onSelectSuggestion={(s) => toast({ title: `Open ${s.label}` })}
          onSelectCategory={(slug) => toast({ title: `Open category ${slug}` })}
        />
      </DsPreview>
    </DsGrid>
  );
}

export function SearchListsDemo() {
  return (
    <DsGrid>
      <DsPreview label="RecentSearches" className="flex-col items-stretch">
        <RecentSearches onSelect={(q) => toast({ title: `Search: “${q}”` })} />
        <RecentSearches layout="chips" title="Recent (chips)" onSelect={(q) => toast({ title: `Search: “${q}”` })} />
        <Button
          variant="ghost"
          size="sm"
          className="self-start"
          onClick={() => ["Running shoes", "Aura headphones", "Hoodie", "Perfume gift set"].forEach((q) => recentSearches.add(q))}
        >
          Add sample searches
        </Button>
        <p className="text-caption text-fg-muted">Stored on this device only. Hidden when empty.</p>
      </DsPreview>
      <DsPreview label="TrendingSearches" className="flex-col items-stretch">
        <TrendingSearches items={trendingSearches} onSelect={(q) => toast({ title: `Search: “${q}”` })} />
        <TrendingSearches layout="ranked" title="Trending (ranked)" items={trendingSearches} onSelect={(q) => toast({ title: `Search: “${q}”` })} />
        <DemoNote>Illustrative list — use real search analytics in production</DemoNote>
      </DsPreview>
    </DsGrid>
  );
}

export function DeliverToDemo() {
  return (
    <DsGrid>
      <DsPreview label="DeliverToPincode · chip" className="flex-col items-start">
        <DeliverToPincode
          lookup={async (pin) => {
            await wait();
            return lookupPincode(pin);
          }}
          addresses={addresses}
          onDetectLocation={async () => {
            await wait(900);
            return "560001";
          }}
        />
        <DemoNote>Try 560066 · 600001 (no COD) · 744101 (not serviceable) · 123456 (unknown)</DemoNote>
      </DsPreview>
      <DsPreview label="Bar · signed out" className="block p-0">
        <DeliverToPincode appearance="bar" lookup={lookupPincode} />
        <p className="p-5 text-caption text-fg-muted">Both instances share one stored location, so choosing a PIN in either updates the other.</p>
      </DsPreview>
    </DsGrid>
  );
}
