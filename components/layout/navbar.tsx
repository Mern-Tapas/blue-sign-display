"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { cart, useCart } from "@/components/providers/cart-store";
import { navUi, useNavUi } from "@/components/providers/nav-store";
import { useWishlist } from "@/components/providers/wishlist-store";
import { DeliverToPincode } from "@/components/search/deliver-to-pincode";
import { SearchOverlay } from "@/components/search/search-overlay";
import { IconButton } from "@/components/ui/icon-button";
import { Kbd } from "@/components/ui/kbd";
import type { SearchSuggestion } from "@/components/ui/search-bar";
import { cn } from "@/lib/cn";
import { lookupPincode, trendingSearches } from "@/lib/data/india";
import type { Address } from "@/lib/data/types";
import { AccountMenu, type AccountMenuUser } from "./account-menu";
import { BrandMark } from "./brand-mark";
import { MegaMenu, type MegaMenuCategory, type NavLink } from "./mega-menu";
import { MobileCategoryMenu } from "./mobile-category-menu";

export type NavbarProps = {
  categories: MegaMenuCategory[];
  links?: NavLink[];
  /** Search suggestions; add `image` for thumbnails in the search overlay. */
  suggestions: (SearchSuggestion & { image?: string })[];
  trending?: string[];
  /** Signed-in shopper; omit to show "Sign in". */
  user?: AccountMenuUser;
  signInHref?: string;
  wishlistCount?: number;
  /** Delivery location chip (xl) and mobile "Deliver to" bar. */
  showDeliverTo?: boolean;
  savedAddresses?: Address[];
  /**
   * Mount the shared panels (category sheet, search overlay, location dialog) and the "/" shortcut.
   * Exactly one Navbar per page should do this; extra instances (docs) pass false and reuse them.
   */
  mountPanels?: boolean;
  className?: string;
};

const defaultLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/shop?sort=newest", label: "New in" },
  { href: "/account/orders", label: "Orders" },
];

/**
 * Storefront header. Desktop: pill bar with mega menu, delivery chip, search, wishlist, bag and
 * account menu. Phones: menu (category sheet), search overlay and bag, plus a "Deliver to" bar
 * that scrolls away. Press "/" anywhere to search.
 */
export function Navbar({
  categories,
  links = defaultLinks,
  suggestions,
  trending = trendingSearches,
  user,
  signInHref = "/design-system/auth",
  wishlistCount: wishlistCountProp,
  showDeliverTo = true,
  savedAddresses,
  mountPanels = true,
  className,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const panels = useNavUi();
  const savedCount = useWishlist().length;
  const wishlistCount = wishlistCountProp ?? savedCount;

  // "/" opens search unless the shopper is typing somewhere
  useEffect(() => {
    if (!mountPanels) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName))
      )
        return;
      e.preventDefault();
      navUi.open("search");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mountPanels]);

  const lookup = (pin: string) => lookupPincode(pin);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-(--z-sticky) px-(--gutter) pt-4",
          className,
        )}
      >
        <div className="mx-auto flex h-(--nav-h) max-w-(--container-max) items-center gap-2 rounded-pill bg-surface pr-2 pl-2 shadow-card sm:pl-5 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
          <div className="flex shrink-0 items-center gap-2">
          <IconButton
            label="Open categories menu"
            variant="ghost"
            className="lg:hidden"
            aria-haspopup="dialog"
            onClick={() => navUi.open("categories")}
          >
            <Menu aria-hidden />
          </IconButton>

          <Link href="/" aria-label="BlueSigns home" className="rounded-pill">
            <BrandMark />
          </Link>

          {showDeliverTo && (
            <DeliverToPincode
              lookup={lookup}
              addresses={user ? savedAddresses : undefined}
              open={mountPanels ? panels.location : undefined}
              onOpenChange={
                mountPanels ? (o) => navUi.set("location", o) : undefined
              }
              className="ml-1 hidden xl:flex"
            />
          )}
          </div>

          <MegaMenu
            categories={categories}
            links={links}
            pathname={pathname}
            className="hidden lg:block"
          />

          <div className="ml-auto flex items-center gap-1.5 lg:ml-0 lg:justify-self-end">
            <button
              type="button"
              onClick={() => navUi.open("search")}
              aria-haspopup="dialog"
              aria-keyshortcuts="/"
              className="press state-layer relative hidden h-control-md items-center gap-2 rounded-pill border border-border bg-surface pr-2 pl-3.5 text-body text-fg-muted transition-transform duration-(--dur-fast) xl:flex"
            >
              <Search aria-hidden className="size-icon-md" />
              <span className="w-24 text-left">Search</span>
              <Kbd size="sm">/</Kbd>
            </button>
            <IconButton
              label="Search"
              variant="secondary"
              aria-haspopup="dialog"
              aria-keyshortcuts="/"
              onClick={() => navUi.open("search")}
              className="xl:hidden"
            >
              <Search aria-hidden />
            </IconButton>
            <IconButton
              asChild
              label={
                wishlistCount ? `Wishlist, ${wishlistCount} items` : "Wishlist"
              }
              variant="secondary"
              badge={wishlistCount}
              className="hidden sm:inline-flex"
            >
              <Link href="/account/wishlist">
                <Heart aria-hidden />
              </Link>
            </IconButton>
            <IconButton
              label={`Bag, ${count} items`}
              variant="secondary"
              badge={count}
              onClick={() => cart.setOpen(true)}
            >
              <ShoppingBag aria-hidden />
            </IconButton>
            {user ? (
              <AccountMenu
                user={user}
                appearance="chip"
                className="ml-1 max-md:hidden"
              />
            ) : (
              <Link
                href={signInHref}
                className="press ml-1 hidden h-control-md items-center rounded-pill bg-surface-inverse px-4 text-label text-fg-inverse transition-transform duration-(--dur-fast) md:inline-flex"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      {showDeliverTo && (
        <div className="px-(--gutter) pt-2 xl:hidden">
          <DeliverToPincode
            appearance="bar"
            lookup={lookup}
            addresses={user ? savedAddresses : undefined}
            className="mx-auto max-w-(--container-max) rounded-pill bg-surface px-4 shadow-flat"
          />
        </div>
      )}

      {mountPanels && (
        <>
          <MobileCategoryMenu
            open={panels.categories}
            onOpenChange={(o) => navUi.set("categories", o)}
            categories={categories}
            links={links.filter((l) => l.href !== "/")}
            userName={user?.name}
            onSignIn={() => {
              navUi.set("categories", false);
              router.push(signInHref);
            }}
          />

          <SearchOverlay
            open={panels.search}
            onOpenChange={(o) => navUi.set("search", o)}
            suggestions={suggestions.map((s) => ({
              id: s.id,
              label: s.label,
              meta: s.meta,
              image: s.image,
            }))}
            categories={categories}
            trending={trending}
            onSubmit={(q) => router.push(`/shop?q=${encodeURIComponent(q)}`)}
            onSelectSuggestion={(s) => router.push(`/products/${s.id}`)}
            onSelectCategory={(slug) => router.push(`/shop?category=${slug}`)}
          />
        </>
      )}
    </>
  );
}
