"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, Menu, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BrandMark } from "@/components/layout/brand-mark";
import { Badge } from "@/components/ui/badge";
import { CountBadge } from "@/components/ui/count-badge";
import { IconButton } from "@/components/ui/icon-button";
import { Kbd } from "@/components/ui/kbd";
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { SkipLink } from "@/components/ui/skip-link";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";
import { createStore } from "@/lib/create-store";

export type AdminNavItem = { href: string; label: string; icon: LucideIcon; count?: number; exact?: boolean };
export type AdminNavGroup = { label?: string; items: AdminNavItem[] };

const sidebar = createStore<{ collapsed: boolean }>({ collapsed: false }, { storageKey: "ds-admin-sidebar" });
const palette = createStore(false);

/** Open the command palette from anywhere (⌘K / Ctrl K is also bound by AdminShell). */
export const openCommandPalette = () => palette.set(true);
export const useCommandPaletteOpen = () => [palette.useStore(), palette.set] as const;

function isActive(pathname: string, item: AdminNavItem) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/* ---------------------------------------------------------------- SidebarNav */

export type SidebarNavProps = {
  groups: AdminNavGroup[];
  collapsed?: boolean;
  onNavigate?: () => void;
  className?: string;
};

/** Grouped admin navigation. Collapsed: icon-only rows with tooltips; the current page is soft accent. */
export function SidebarNav({ groups, collapsed = false, onNavigate, className }: SidebarNavProps) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className={cn("flex flex-col gap-5", className)}>
      {groups.map((g, gi) => (
        <div key={g.label ?? gi} className="flex flex-col gap-1">
          {g.label && (collapsed ? <span aria-hidden className="mx-auto my-1 h-px w-6 bg-border-subtle" /> : <p className="px-3 pb-1 text-overline text-fg-muted">{g.label}</p>)}
          <ul className="flex flex-col gap-0.5">
            {g.items.map((item) => {
              const active = isActive(pathname, item);
              const Icon = item.icon;
              const link = (
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  aria-label={collapsed ? (item.count ? `${item.label}, ${item.count}` : item.label) : undefined}
                  className={cn(
                    "state-layer relative flex h-control-md items-center rounded-pill text-label transition-colors duration-(--dur-fast)",
                    collapsed ? "w-control-md justify-center" : "gap-3 px-3",
                    active ? "bg-accent-soft text-accent-soft-fg" : "text-fg-muted hover:text-fg",
                  )}
                >
                  <Icon aria-hidden className="size-icon-md shrink-0" />
                  {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
                  {item.count !== undefined && item.count > 0 && (collapsed ? <span aria-hidden className="absolute top-2 right-2 size-2 rounded-pill bg-accent ring-2 ring-surface" /> : <CountBadge count={item.count} tone={active ? "current" : "neutral"} />)}
                </Link>
              );
              return <li key={item.href}>{collapsed ? <Tooltip content={item.label} side="right">{link}</Tooltip> : link}</li>;
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/* ---------------------------------------------------------------- AdminShell */

export type AdminShellProps = {
  nav: AdminNavGroup[];
  /** Workspace / store name under the brand. */
  workspace: string;
  /** Right side of the top bar: notifications, account menu. */
  actions?: React.ReactNode;
  /** Command palette element (rendered once, opened with ⌘K). */
  commandPalette?: React.ReactNode;
  demo?: boolean;
  children: React.ReactNode;
};

/**
 * Admin app frame: a flat sidebar on the canvas (collapsible to icons from lg, a sheet on phones),
 * a slim top bar with search and account actions, and the page content. ⌘K / Ctrl K opens search.
 */
export function AdminShell({ nav, workspace, actions, commandPalette, demo = true, children }: AdminShellProps) {
  const { collapsed } = sidebar.useStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        palette.set(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const brand = (
    <Link href="/admin" className="flex min-w-0 items-center gap-2 rounded-pill">
      <BrandMark showName={!collapsed} />
      {!collapsed && <span className="truncate text-caption text-fg-muted">{workspace}</span>}
    </Link>
  );

  return (
    <div data-slot="admin-shell" className="flex min-h-dvh flex-1 bg-canvas">
      <SkipLink />
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 flex-col gap-6 border-r border-border-subtle bg-surface px-3 py-4 transition-[width] duration-(--dur-base) lg:flex",
          collapsed ? "w-[4.5rem] items-center" : "w-64",
        )}
      >
        <div className={cn("flex h-control-md items-center", collapsed ? "justify-center" : "px-2")}>{brand}</div>
        <div className="scrollbar-none -mx-1 min-h-0 flex-1 overflow-y-auto px-1">
          <SidebarNav groups={nav} collapsed={collapsed} />
        </div>
        <IconButton
          label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          variant="ghost"
          size="sm"
          className={cn(!collapsed && "self-end")}
          onClick={() => sidebar.set((s) => ({ collapsed: !s.collapsed }))}
        >
          {collapsed ? <ChevronsRight aria-hidden /> : <ChevronsLeft aria-hidden />}
        </IconButton>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-(--z-sticky) flex h-(--nav-h) items-center gap-2 border-b border-border-subtle bg-surface px-(--gutter)">
          <Sheet>
            <SheetTrigger asChild>
              <IconButton label="Open admin menu" variant="ghost" className="lg:hidden">
                <Menu aria-hidden />
              </IconButton>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader title={workspace} description="Admin navigation" />
              <SheetBody className="pb-6">
                <SidebarNav groups={nav} />
              </SheetBody>
            </SheetContent>
          </Sheet>
          <div className="lg:hidden">
            <BrandMark showName={false} />
          </div>
          <button
            type="button"
            onClick={() => palette.set(true)}
            aria-haspopup="dialog"
            aria-keyshortcuts="Control+K Meta+K"
            className="state-layer relative flex h-control-md w-full max-w-md min-w-0 items-center gap-2 rounded-pill bg-surface-sunken px-4 text-body text-fg-muted"
          >
            <Search aria-hidden className="size-icon-md shrink-0" />
            <span className="min-w-0 flex-1 truncate text-left">Search orders, products, customers</span>
            <Kbd size="sm" className="max-sm:hidden">
              Ctrl K
            </Kbd>
          </button>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            {demo && (
              <Badge tone="warning" size="sm" className="max-md:hidden">
                Demo admin
              </Badge>
            )}
            {actions}
          </div>
        </header>
        <main id="main" className="flex min-w-0 flex-1 flex-col gap-6 px-(--gutter) pt-6 pb-16">
          {children}
        </main>
      </div>
      {commandPalette}
    </div>
  );
}
