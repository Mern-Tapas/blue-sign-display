"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BellRing, ChevronRight, Coins, CreditCard, Gift, Heart, HelpCircle, LogOut, MapPin, Package, ShieldCheck, Ticket, UserRound } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { CountBadge, countBadgeVariants } from "@/components/ui/count-badge";
import { IconTile } from "@/components/ui/icon-tile";
import { cn } from "@/lib/cn";

export type AccountNavItem = { href: string; label: string; icon: React.ReactNode; description?: string; badge?: string | number };
export type AccountNavGroup = { label: string; items: AccountNavItem[] };

export const accountNavGroups: AccountNavGroup[] = [
  {
    label: "Shopping",
    items: [
      { href: "/account/orders", label: "Orders", icon: <Package />, description: "Track, return or buy again" },
      { href: "/account/wishlist", label: "Wishlist", icon: <Heart />, description: "Saved items and price drops" },
      { href: "/account/notifications", label: "Notifications", icon: <Bell />, description: "Updates and offers" },
    ],
  },
  {
    label: "Money",
    items: [
      { href: "/account/coupons", label: "Coupons", icon: <Ticket />, description: "Active and expired" },
      { href: "/account/gift-cards", label: "Gift cards", icon: <Gift />, description: "Balance and add a card" },
      { href: "/account/rewards", label: "BlueSigns points", icon: <Coins />, description: "Points and tier" },
      { href: "/account/payments", label: "Saved payments", icon: <CreditCard />, description: "Cards, UPI and wallets" },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/account/profile", label: "Profile", icon: <UserRound />, description: "Name, contact and birthday" },
      { href: "/account/addresses", label: "Addresses", icon: <MapPin />, description: "Delivery addresses" },
      { href: "/account/security", label: "Login & security", icon: <ShieldCheck />, description: "Password and devices" },
      { href: "/account/notification-settings", label: "Notification settings", icon: <BellRing />, description: "SMS, email, WhatsApp, push" },
    ],
  },
];

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export type AccountSidebarProps = {
  user: { name: string; email?: string; avatar?: string };
  groups?: AccountNavGroup[];
  onSignOut?: () => void;
  className?: string;
};

/** Desktop account navigation: who's signed in, grouped destinations with the current page marked, help and sign out. */
export function AccountSidebar({ user, groups = accountNavGroups, onSignOut, className }: AccountSidebarProps) {
  const pathname = usePathname();
  return (
    <Card asChild variant="outline" padding="none" className={cn("gap-4 p-3", className)}>
      <nav aria-label="Account" data-slot="account-sidebar">
        <div className="flex items-center gap-3 px-2 pt-2">
          <Avatar name={user.name} src={user.avatar} size="md" />
          <div className="min-w-0">
            <p className="text-caption text-fg-muted">Hello,</p>
            <p className="truncate text-title">{user.name}</p>
          </div>
        </div>
        {groups.map((g) => (
          <div key={g.label} className="flex flex-col gap-0.5">
            <p className="px-3 pb-1 text-overline text-fg-muted">{g.label}</p>
            <ul className="flex flex-col gap-0.5">
              {g.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-row-md items-center gap-3 rounded-lg px-3 text-body transition-colors duration-(--dur-fast) focus-ring-row [&>svg]:size-icon-md [&>svg]:shrink-0",
                        active ? "bg-accent-soft font-medium text-accent-soft-fg" : "text-fg-muted hover:bg-highlight hover:text-fg [&>svg]:text-fg-muted",
                      )}
                    >
                      {item.icon}
                      <span className="flex-1 truncate">{item.label}</span>
                      {typeof item.badge === "number" ? (
                        <CountBadge count={item.badge} tone="accent" />
                      ) : (
                        item.badge !== undefined && <span className={countBadgeVariants({ tone: "accent" })}>{item.badge}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <div className="flex flex-col gap-0.5 border-t border-border-subtle pt-3">
          <Link href="/help" className="flex h-row-md items-center gap-3 rounded-lg px-3 text-body text-fg-muted transition-colors duration-(--dur-fast) hover:bg-highlight hover:text-fg focus-ring-row">
            <HelpCircle aria-hidden className="size-icon-md" /> Help centre
          </Link>
          <button type="button" onClick={onSignOut} className="flex h-row-md items-center gap-3 rounded-lg px-3 text-left text-body text-danger-fg transition-colors duration-(--dur-fast) hover:bg-danger-soft focus-ring-row">
            <LogOut aria-hidden className="size-icon-md" /> Sign out
          </button>
        </div>
      </nav>
    </Card>
  );
}

/** Phone account home: large tappable rows with a description, grouped like the sidebar. */
export function AccountMenuList({ groups = accountNavGroups, onSignOut, className }: Omit<AccountSidebarProps, "user">) {
  return (
    <nav aria-label="Account" data-slot="account-menu-list" className={cn("flex flex-col gap-4", className)}>
      {groups.map((g) => (
        <Card key={g.label} asChild variant="outline" padding="none" className="overflow-hidden">
          <section aria-label={g.label}>
            <ul className="divide-y divide-border-subtle">
              {g.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="flex min-h-14 items-center gap-3 px-4 py-2.5 transition-colors duration-(--dur-fast) hover:bg-highlight focus-ring-row">
                    <IconTile size="sm" tone="muted">
                      {item.icon}
                    </IconTile>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-body-strong">{item.label}</span>
                      {item.description && <span className="truncate text-caption text-fg-muted">{item.description}</span>}
                    </span>
                    <ChevronRight aria-hidden className="size-icon-md text-fg-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Card>
      ))}
      <Card asChild variant="outline" padding="none" className="min-h-row-lg flex-row items-center justify-center gap-2 text-body-strong text-danger-fg transition-colors duration-(--dur-fast) hover:bg-danger-soft">
        <button type="button" onClick={onSignOut}>
          <LogOut aria-hidden className="size-icon-md" /> Sign out
        </button>
      </Card>
    </nav>
  );
}
