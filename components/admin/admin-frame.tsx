"use client";

import {
  BadgePercent,
  BarChart3,
  Boxes,
  LayoutDashboard,
  MessageSquareText,
  Package,
  RotateCcw,
  Settings,
  ShoppingBag,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { AccountMenu } from "@/components/layout/account-menu";
import { adminCustomers, adminOrders, adminProducts, pendingWork } from "@/lib/data/admin";
import { notifications } from "@/lib/data/notifications";
import { AdminShell, type AdminNavGroup } from "./admin-shell";
import { CommandPalette, type CommandItem } from "./command-palette";

export const adminNav: AdminNavGroup[] = [
  {
    items: [{ href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag, count: pendingWork.toPack + pendingWork.toShip },
      { href: "/admin/returns", label: "Returns", icon: RotateCcw, count: pendingWork.returnsToReview },
      { href: "/admin/customers", label: "Customers", icon: Users },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/inventory", label: "Inventory", icon: Boxes, count: pendingWork.lowStock },
      { href: "/admin/reviews", label: "Reviews", icon: MessageSquareText },
    ],
  },
  {
    label: "Growth & money",
    items: [
      { href: "/admin/coupons", label: "Coupons", icon: BadgePercent },
      { href: "/admin/payouts", label: "Payouts & GST", icon: Wallet },
      { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    label: "Store",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
      { href: "/", label: "View storefront", icon: Store, exact: true },
    ],
  },
];

const commandItems: CommandItem[] = [
  ...adminNav.flatMap((g) => g.items.map((i) => ({ id: `nav-${i.href}`, label: i.label, group: "Pages", href: i.href, icon: <i.icon aria-hidden /> }))),
  { id: "act-product", label: "Add a product", group: "Actions", href: "/admin/products/new", icon: <Package aria-hidden />, keywords: ["create", "new"] },
  { id: "act-coupon", label: "Create a coupon", group: "Actions", href: "/admin/coupons?new=1", icon: <BadgePercent aria-hidden />, keywords: ["discount", "new"] },
  ...adminOrders.slice(0, 40).map((o) => ({ id: `o-${o.id}`, label: o.id, hint: `${o.customerName} · ${o.city}`, group: "Orders", href: `/admin/orders/${o.id}`, icon: <ShoppingBag aria-hidden />, keywords: [o.customerName, o.awb ?? ""] })),
  ...adminProducts.map((p) => ({ id: `p-${p.id}`, label: p.name, hint: p.sku, group: "Products", href: `/admin/products/${p.id}`, icon: <Package aria-hidden />, keywords: [p.sku, p.brand] })),
  ...adminCustomers.slice(0, 30).map((c) => ({ id: `c-${c.id}`, label: c.name, hint: `${c.city} · ${c.orders} orders`, group: "Customers", href: `/admin/customers/${c.id}`, icon: <Users aria-hidden />, keywords: [c.email, c.phone] })),
];

/** The /admin application frame with navigation, search and account actions (demo store). */
export function AdminFrame({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell
      nav={adminNav}
      workspace="Seller admin"
      commandPalette={<CommandPalette items={commandItems} />}
      actions={
        <>
          <NotificationBell notifications={notifications} viewAllHref="/admin" />
          <AccountMenu user={{ name: "Sujon Ahmed", email: "sujon@bluesigns.shop", tier: "Owner" }} appearance="avatar" />
        </>
      }
    >
      {children}
    </AdminShell>
  );
}
