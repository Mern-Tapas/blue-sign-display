import { icons, SidebarNav } from "@bluesigns/ui";

const { BadgePercent, BarChart3, Boxes, LayoutDashboard, MessageSquareText, Package, RotateCcw, Settings, ShoppingBag, Users, Wallet } = icons;

const nav = [
  { items: [{ href: "/", label: "Overview", icon: LayoutDashboard, exact: true }] },
  {
    label: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag, count: 15 },
      { href: "/admin/returns", label: "Returns", icon: RotateCcw, count: 6 },
      { href: "/admin/customers", label: "Customers", icon: Users },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/inventory", label: "Inventory", icon: Boxes, count: 5 },
      { href: "/admin/reviews", label: "Reviews", icon: MessageSquareText },
    ],
  },
  {
    label: "Growth & money",
    items: [
      { href: "/admin/coupons", label: "Coupons", icon: BadgePercent },
      { href: "/admin/payouts", label: "Payouts & GST", icon: Wallet },
      { href: "/admin/reports", label: "Reports", icon: BarChart3 },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export const ExpandedAndCollapsed = () => (
  <div className="flex flex-wrap items-start gap-6">
    <div className="w-64 rounded-2xl bg-surface p-3 shadow-flat">
      <SidebarNav groups={nav} />
    </div>
    <div className="flex w-[4.5rem] justify-center rounded-2xl bg-surface p-3 shadow-flat">
      <SidebarNav groups={nav} collapsed />
    </div>
  </div>
);

export const Expanded = () => (
  <div className="w-64 rounded-2xl bg-surface p-3 shadow-flat">
    <SidebarNav groups={nav} />
  </div>
);
