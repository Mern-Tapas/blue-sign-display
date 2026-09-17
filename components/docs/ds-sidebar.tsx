"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { CountBadge } from "@/components/ui/count-badge";
import { Sheet, SheetBody, SheetClose, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/cn";
import { dsNavGroups, dsNavItems } from "./ds-nav-items";

function NavList({ onNavigate, className }: { onNavigate?: boolean; className?: string }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const groups = dsNavGroups
    .map((g) => ({ ...g, items: q ? g.items.filter((i) => `${i.label} ${i.description}`.toLowerCase().includes(q)) : g.items }))
    .filter((g) => g.items.length > 0);

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="focus-ring-inset relative flex h-control-sm items-center gap-2 rounded-pill bg-surface px-3 shadow-flat">
        <Search aria-hidden className="size-icon-sm shrink-0 text-fg-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter pages"
          aria-label="Filter design system pages"
          className="h-full min-w-0 flex-1 bg-transparent text-label outline-none placeholder:text-fg-placeholder [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button type="button" aria-label="Clear filter" onClick={() => setQuery("")} className="hit-area relative flex size-5 items-center justify-center rounded-pill text-fg-muted hover:text-fg">
            <X aria-hidden className="size-icon-sm" />
          </button>
        )}
      </div>
      {groups.length === 0 && <p className="px-3.5 text-caption text-fg-muted">No pages match “{query}”.</p>}
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 px-3.5 text-overline text-fg-muted">{group.label}</p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map(({ href, label, icon: Icon, count }) => {
              const active = pathname === href;
              const link = (
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "state-layer relative flex h-control-md items-center gap-3 rounded-pill px-3.5 text-label transition-colors duration-(--dur-fast)",
                    active ? "bg-accent-soft text-accent-soft-fg" : "text-fg-muted hover:text-fg",
                  )}
                >
                  <Icon aria-hidden className="size-icon-md shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  {count > 0 && (
                    <CountBadge count={count} tone={active ? "current" : "neutral"} className={cn(!active && "bg-transparent text-fg-muted")} />
                  )}
                </Link>
              );
              return <li key={href}>{onNavigate ? <SheetClose asChild>{link}</SheetClose> : link}</li>;
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function DsSidebar({ className }: { className?: string }) {
  return (
    <nav aria-label="Design system sections" className={className}>
      <NavList />
    </nav>
  );
}

/** Mobile: current page + grouped navigation in a left sheet. */
export function DsMobileNav() {
  const pathname = usePathname();
  const current = dsNavItems.find((i) => i.href === pathname);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="press state-layer relative flex h-control-md w-full items-center gap-3 rounded-pill bg-surface px-4 text-label text-fg shadow-flat transition-transform duration-(--dur-fast) lg:hidden"
        >
          <Menu aria-hidden className="size-icon-md text-fg-muted" />
          <span className="text-fg-muted">Design system</span>
          <span aria-hidden className="text-fg-subtle">/</span>
          <span>{current?.label ?? "Overview"}</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader title="Design system" description="Foundations, components and commerce patterns" />
        <SheetBody className="pb-6">
          <nav aria-label="Design system sections">
            <NavList onNavigate />
          </nav>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
