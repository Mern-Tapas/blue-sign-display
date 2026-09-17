import { useEffect } from "react";
import { AdminShell, CommandPalette, icons, PageHeader, sampleData, toast } from "@bluesigns/ui";

const { BadgePercent, LayoutDashboard, Package, PackageCheck, ShoppingBag, Truck, Users, Wallet } = icons;

const nav = [
  { items: [{ href: "/", label: "Overview", icon: LayoutDashboard, exact: true }] },
  {
    label: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag, count: 15 },
      { href: "/admin/customers", label: "Customers", icon: Users },
    ],
  },
  {
    label: "Catalog & money",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/coupons", label: "Coupons", icon: BadgePercent },
      { href: "/admin/payouts", label: "Payouts & GST", icon: Wallet },
    ],
  },
];

const items = [
  ...nav.flatMap((g) => g.items.map((i) => ({ id: i.href, label: i.label, group: "Pages", href: i.href, icon: <i.icon aria-hidden /> }))),
  { id: "a1", label: "Mark LM-200599 as packed", group: "Actions", icon: <PackageCheck aria-hidden />, onSelect: () => toast({ title: "LM-200599 marked as packed", tone: "success" }) },
  { id: "a2", label: "Ship LM-200594", group: "Actions", icon: <Truck aria-hidden />, onSelect: () => toast({ title: "Opening ship dialog" }) },
  ...sampleData.adminOrders.slice(0, 6).map((o) => ({ id: o.id, label: o.id, hint: `${o.customerName} · ${o.city}`, group: "Orders", href: `/admin/orders/${o.id}`, icon: <ShoppingBag aria-hidden />, keywords: [o.customerName] })),
];

/**
 * The palette opens from AdminShell's search button or Ctrl K / ⌘K. Here the shortcut is
 * dispatched on mount so the card shows the open palette.
 */
export const OpenInAdmin = () => {
  useEffect(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
  }, []);
  return (
    <div style={{ width: "100%", height: 700, overflow: "hidden" }}>
      <AdminShell nav={nav} workspace="Seller admin" commandPalette={<CommandPalette items={items} />}>
        <PageHeader title="Orders" meta={<span>120 orders · last 30 days · demo data</span>} />
      </AdminShell>
    </div>
  );
};
