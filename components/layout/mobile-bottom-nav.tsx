"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, House, LayoutGrid, ShoppingBag, UserRound } from "lucide-react";
import { cart, useCart } from "@/components/providers/cart-store";
import { navUi } from "@/components/providers/nav-store";
import { useWishlist } from "@/components/providers/wishlist-store";
import { CountBadge } from "@/components/ui/count-badge";
import { cn } from "@/lib/cn";

export type BottomNavItem = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  /** Link destination; or use onSelect for panels (categories, bag). */
  href?: string;
  onSelect?: () => void;
  count?: number;
  /** Custom active check (defaults to pathname prefix match on href). */
  isActive?: (pathname: string) => boolean;
};

export type MobileBottomNavProps = {
  items?: BottomNavItem[];
  wishlistCount?: number;
  /** Where the bag item goes; defaults to opening the cart drawer. */
  onBagSelect?: () => void;
  className?: string;
};

/**
 * Thumb-reach navigation for phones (hidden from lg). Five destinations, each with an icon and
 * a text label; counts are announced with the label. Pads for the iOS home indicator.
 * Pages using it need bottom padding (≈ 5rem) so content isn't hidden.
 */
export function MobileBottomNav({ items, wishlistCount, onBagSelect, className }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { count, open } = useCart();
  const saved = useWishlist().length;

  const list: BottomNavItem[] = items ?? [
    { key: "home", label: "Home", icon: House, href: "/", isActive: (p) => p === "/" },
    { key: "categories", label: "Categories", icon: LayoutGrid, onSelect: () => navUi.open("categories"), isActive: (p) => p.startsWith("/shop") },
    { key: "wishlist", label: "Wishlist", icon: Heart, href: "/account/wishlist", count: wishlistCount ?? saved },
    { key: "bag", label: "Bag", icon: ShoppingBag, onSelect: onBagSelect ?? (() => cart.setOpen(true)), count, isActive: () => open },
    { key: "account", label: "Account", icon: UserRound, href: "/account/orders", isActive: (p) => p.startsWith("/account") && !p.startsWith("/account/wishlist") },
  ];

  return (
    <nav
      aria-label="Primary"
      data-slot="mobile-bottom-nav"
      className={cn(
        "fixed inset-x-0 bottom-0 z-(--z-sticky) border-t border-border-subtle bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden",
        className,
      )}
    >
      <ul className="mx-auto grid h-16 max-w-lg grid-cols-5">
        {list.map((item) => {
          const active = item.isActive ? item.isActive(pathname) : item.href ? pathname.startsWith(item.href) : false;
          const Icon = item.icon;
          const hasCount = typeof item.count === "number" && item.count > 0;
          const content = (
            <>
              <span
                className={cn(
                  "relative flex h-7 w-12 items-center justify-center rounded-pill transition-colors duration-(--dur-fast)",
                  active ? "bg-accent-soft text-accent-soft-fg" : "text-fg-muted group-hover:text-fg",
                )}
              >
                <Icon aria-hidden className="size-icon-lg" />
                {hasCount && (
                  <CountBadge aria-hidden count={item.count!} tone="accent" size="sm" className="absolute -top-1 right-1 ring-2 ring-surface" />
                )}
              </span>
              <span className={active ? "text-caption-strong text-fg" : "text-caption text-fg-muted"}>
                {item.label}
                {hasCount && <span className="sr-only">, {item.count} items</span>}
              </span>
            </>
          );
          const cls = "group flex h-full w-full flex-col items-center justify-center gap-1 focus-ring-row";
          return (
            <li key={item.key}>
              {item.href ? (
                <Link href={item.href} aria-current={active ? "page" : undefined} className={cls}>
                  {content}
                </Link>
              ) : (
                <button type="button" onClick={item.onSelect} aria-haspopup="dialog" className={cls}>
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
