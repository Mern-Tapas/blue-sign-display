"use client";

import Link from "next/link";
import { Bell, ChevronDown, CreditCard, Gift, Heart, HelpCircle, LayoutDashboard, LogOut, MapPin, Monitor, Moon, Package, Settings, ShieldCheck, Sun, Ticket, UserRound } from "lucide-react";
import { useThemePreference } from "@/components/providers/theme-store";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import type { ThemePreference } from "@/lib/theme";

const themeOptions: { value: ThemePreference; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Light", icon: <Sun /> },
  { value: "dark", label: "Dark", icon: <Moon /> },
  { value: "system", label: "Match device", icon: <Monitor /> },
];

export type AccountMenuUser = {
  name: string;
  email?: string;
  mobile?: string;
  avatar?: string;
  tier?: string;
  points?: number;
};

export type AccountMenuLink = { href: string; label: string; icon: React.ReactNode; count?: number };

export const defaultAccountLinks: AccountMenuLink[][] = [
  [
    { href: "/account/orders", label: "Orders", icon: <Package /> },
    { href: "/account/wishlist", label: "Wishlist", icon: <Heart /> },
    { href: "/account/notifications", label: "Notifications", icon: <Bell /> },
  ],
  [
    { href: "/account/coupons", label: "Coupons", icon: <Ticket /> },
    { href: "/account/gift-cards", label: "Gift cards", icon: <Gift /> },
    { href: "/account/addresses", label: "Saved addresses", icon: <MapPin /> },
    { href: "/account/payments", label: "Saved cards & UPI", icon: <CreditCard /> },
  ],
  [
    { href: "/account/profile", label: "Profile & settings", icon: <Settings /> },
    { href: "/account/security", label: "Login & security", icon: <ShieldCheck /> },
    { href: "/help", label: "Help centre", icon: <HelpCircle /> },
  ],
  [{ href: "/admin", label: "Seller admin (demo)", icon: <LayoutDashboard /> }],
];

export type AccountMenuProps = {
  /** Omit when signed out: renders a Sign in button instead. */
  user?: AccountMenuUser;
  links?: AccountMenuLink[][];
  onSignIn?: () => void;
  onSignOut?: () => void;
  /** `chip` shows name + email next to the avatar (md+); `avatar` is the avatar alone. */
  appearance?: "chip" | "avatar";
  className?: string;
};

/** Header account entry: avatar trigger with the shopper's destinations grouped by task, and sign-out last. */
export function AccountMenu({ user, links = defaultAccountLinks, onSignIn, onSignOut, appearance = "chip", className }: AccountMenuProps) {
  if (!user) {
    return (
      <Button variant="neutral" size="md" leadingIcon={<UserRound aria-hidden />} onClick={onSignIn} className={className}>
        Sign in
      </Button>
    );
  }

  const contact = user.email ?? (user.mobile ? `+91 ${user.mobile}` : undefined);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Account menu for ${user.name}`}
        className={cn(
          "group state-layer relative flex shrink-0 items-center gap-2.5 rounded-pill",
          appearance === "chip" ? "py-1 pr-2.5 pl-1" : "p-0.5",
          className,
        )}
      >
        <Avatar name={user.name} src={user.avatar} size="sm" />
        {appearance === "chip" && (
          <>
            <span className="hidden flex-col text-left leading-tight xl:flex">
              <span className="text-label text-fg">{user.name}</span>
              {contact && <span className="max-w-28 truncate text-caption text-fg-muted">{contact}</span>}
            </span>
            <ChevronDown aria-hidden className="hidden size-icon-sm text-fg-muted transition-transform duration-(--dur-fast) group-data-[state=open]:rotate-180 xl:block" />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        <DropdownMenuLabel className="flex items-center gap-3 px-3 py-2.5">
          <Avatar name={user.name} src={user.avatar} size="md" />
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-title text-fg">{user.name}</span>
            {contact && <span className="truncate text-caption text-fg-muted">{contact}</span>}
            {(user.tier || user.points !== undefined) && (
              <span className="mt-1 flex items-center gap-1.5">
                {user.tier && (
                  <Badge tone="accent" size="sm">
                    {user.tier}
                  </Badge>
                )}
                {user.points !== undefined && <span className="text-caption text-fg-muted figures">{formatNumber(user.points)} points</span>}
              </span>
            )}
          </span>
        </DropdownMenuLabel>
        {links.map((group, gi) => (
          <DropdownMenuGroup key={gi}>
            <DropdownMenuSeparator />
            {group.map((l) => (
              <DropdownMenuItem key={l.href} asChild>
                <Link href={l.href}>
                  {l.icon}
                  <span className="flex-1">{l.label}</span>
                  {l.count !== undefined && l.count > 0 && (
                    <span className="rounded-pill bg-accent-soft px-1.5 text-caption-strong text-accent-soft-fg figures">{l.count}</span>
                  )}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="px-3 pt-1.5 pb-1 text-overline text-fg-muted">Appearance</DropdownMenuLabel>
        <ThemeRadioItems />
        {onSignOut && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={onSignOut}>
              <LogOut aria-hidden />
              Sign out
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeRadioItems() {
  const { preference, setPreference } = useThemePreference();
  return (
    <DropdownMenuRadioGroup value={preference ?? "system"} onValueChange={(v) => setPreference(v as ThemePreference)}>
      {themeOptions.map((o) => (
        <DropdownMenuRadioItem key={o.value} value={o.value} onSelect={(e) => e.preventDefault()}>
          {o.icon}
          {o.label}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );
}
