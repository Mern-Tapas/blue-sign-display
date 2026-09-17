import { AccountMenu, AdminShell, Button, icons, KpiRow, KpiTile, NotificationBell, PageHeader, sampleData } from "@bluesigns/ui";

const { BadgePercent, Boxes, Download, LayoutDashboard, Package, RotateCcw, Settings, ShoppingBag, Users, Wallet } = icons;

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
    ],
  },
  {
    label: "Money",
    items: [
      { href: "/admin/coupons", label: "Coupons", icon: BadgePercent },
      { href: "/admin/payouts", label: "Payouts & GST", icon: Wallet },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

const last14 = sampleData.dailySales.slice(-14);

export const SellerAdmin = () => (
  <div style={{ width: "100%", height: 720, overflow: "hidden" }}>
    <AdminShell
      nav={nav}
      workspace="Seller admin"
      actions={
        <>
          <NotificationBell notifications={sampleData.notifications} viewAllHref="/admin" />
          <AccountMenu user={{ name: "Sujon Ahmed", email: "sujon@bluesigns.shop", tier: "Owner" }} appearance="avatar" />
        </>
      }
    >
      <PageHeader
        title="Overview"
        meta={<span>BlueSigns · Bengaluru warehouse · demo data</span>}
        actions={
          <Button variant="secondary" leadingIcon={<Download aria-hidden />}>
            Export
          </Button>
        }
      />
      <KpiRow>
        <KpiTile label="Net sales" value="₹1.01Cr" delta={{ value: 9.1, period: "vs previous 30 days" }} trend={last14.map((d) => d.revenue)} />
        <KpiTile label="Orders" value="3,810" delta={{ value: 7.7, period: "vs previous 30 days" }} trend={last14.map((d) => d.orders)} />
        <KpiTile label="Average order value" value="₹2,652" delta={{ value: 1.3, period: "vs previous 30 days" }} />
        <KpiTile label="Return rate" value="6.4%" delta={{ value: 1.2, period: "vs previous 30 days", goodDirection: "down" }} />
      </KpiRow>
    </AdminShell>
  </div>
);
