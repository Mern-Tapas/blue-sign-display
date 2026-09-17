import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DsPageHeader, DsSection } from "@/components/docs/ds-section";
import { adminOrders } from "@/lib/data/admin";

/** A customer with recent orders, so the profile demo isn't an empty state. */
const sampleCustomerId = adminOrders[0]!.customerId;

export const metadata: Metadata = { title: "Admin screens" };

const areas: { title: string; description: string; screens: { href: string; label: string; composes: string }[] }[] = [
  {
    title: "Overview",
    description: "What needs doing now and how the period is going.",
    screens: [{ href: "/admin", label: "Overview", composes: "PageHeader, DateRangePicker, Needs-attention list, KpiRow, LineChart, ShareBar, Heatmap, Funnel, BarChart, ActivityFeed" }],
  },
  {
    title: "Orders & fulfilment",
    description: "From confirmed to delivered, with COD, SLA and courier detail.",
    screens: [
      { href: "/admin/orders", label: "Orders", composes: "Status tabs, FilterBar, DataTable with bulk actions, StatusPill" },
      { href: "/admin/orders/LM-200600", label: "Order detail", composes: "Steps, fulfilment actions, ship dialog (courier + AWB), cancel & refund, DescriptionList, ActivityFeed" },
      { href: "/admin/returns", label: "Returns & refunds", composes: "KpiRow, DataTable, DetailPanel (approve / reject / pickup / refund), BarChart" },
    ],
  },
  {
    title: "Catalog & inventory",
    description: "Products, prices with GST, variants and stock.",
    screens: [
      { href: "/admin/products", label: "Products", composes: "Tabs, FilterBar, DataTable, stock cells, bulk publish / archive" },
      { href: "/admin/products/new", label: "Product editor", composes: "FileUpload, pricing & GST, variants matrix, SEO, FormActionsBar" },
      { href: "/admin/inventory", label: "Inventory", composes: "KpiRow, DataTable, adjust-stock dialog" },
      { href: "/admin/reviews", label: "Reviews moderation", composes: "Tabs, review queue, publish / hide / reply" },
    ],
  },
  {
    title: "Customers & marketing",
    description: "Who buys, how often, and what brings them back.",
    screens: [
      { href: "/admin/customers", label: "Customers", composes: "Segments, KpiRow, DataTable, send coupon" },
      { href: `/admin/customers/${sampleCustomerId}`, label: "Customer profile", composes: "KpiTiles, orders table, notes, tags, consent" },
      { href: "/admin/coupons", label: "Coupons", composes: "DataTable, usage meters, coupon builder sheet" },
    ],
  },
  {
    title: "Money, reports & settings",
    description: "Settlements and GST, analysis, and how the store runs.",
    screens: [
      { href: "/admin/payouts", label: "Payouts & GST", composes: "KpiRow, settlements DataTable, DetailPanel breakdown, bank account" },
      { href: "/admin/reports", label: "Reports", composes: "Filter row, LineChart, grouped BarChart, ShareBar, Funnel, Heatmap, top cities" },
      { href: "/admin/settings", label: "Settings", composes: "SettingsSection, useDraft + FormActionsBar, roles × permissions matrix" },
      { href: "/admin/settings/audit", label: "Audit log", composes: "FilterBar, ActivityFeed, table view" },
    ],
  },
];

export default function AdminScreensDocsPage() {
  return (
    <>
      <DsPageHeader
        title="Admin"
        muted="screens"
        description="The seller back office at /admin, built only from documented primitives on demo data. Each screen lists what it composes, so reviewers can trace any pattern back to its component page."
      />
      {areas.map((area) => (
        <DsSection key={area.title} title={area.title} description={area.description}>
          <ul className="divide-y divide-border-subtle overflow-hidden rounded-2xl bg-surface shadow-flat">
            {area.screens.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="state-layer focus-ring-row group relative flex items-center gap-4 px-5 py-4">
                  <span className="min-w-0 flex-1">
                    <span className="block text-body-strong">{s.label}</span>
                    <span className="block text-body text-fg-muted">{s.composes}</span>
                  </span>
                  <span className="hidden text-code text-fg-muted sm:block">{s.href}</span>
                  <ArrowUpRight aria-hidden className="size-icon-md shrink-0 text-fg-subtle transition-colors group-hover:text-fg" />
                </Link>
              </li>
            ))}
          </ul>
        </DsSection>
      ))}
    </>
  );
}
