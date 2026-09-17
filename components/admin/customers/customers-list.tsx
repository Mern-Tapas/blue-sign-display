"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BadgePercent, Download } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminDateShort } from "@/lib/admin-format";
import { ADMIN_DEMO_NOTE, adminCustomers, type AdminCustomer } from "@/lib/data/admin";
import { formatNumber, formatPrice } from "@/lib/format";
import { FilterBar, type FilterValues } from "../admin-parts";
import { DataTable, type DataColumn } from "../data-table";
import { KpiRow, KpiTile } from "../metrics";
import { PageHeader } from "../page-header";
import { segmentMeta, segmentOrder, type CustomerSegment } from "./customer-data";
import { SegmentBadge } from "./segment-badge";
import { SendCouponDialog } from "./send-coupon-dialog";

type SegmentTab = "all" | CustomerSegment;

const states = [...new Set(adminCustomers.map((c) => c.state))].sort();

const emptyCopy: Record<SegmentTab, { title: string; description: string }> = {
  all: { title: "No customers match", description: "Try a shorter search, or clear the state and marketing filters." },
  new: { title: "No new customers match", description: "New customers have placed one or two orders. Clear filters to see them all." },
  repeat: { title: "No repeat customers match", description: "Repeat customers have 3–8 orders. Clear filters, or check the VIP tab for your most loyal buyers." },
  vip: { title: "No VIP customers match", description: "VIPs have 9 or more orders. Clear filters to see them all." },
  "at-risk": { title: "No at-risk customers match", description: "At-risk customers haven’t ordered in 120+ days. Send them a win-back coupon before they lapse." },
};

/** /admin/customers: segments, search and filters over the customer list, with bulk coupon sends. */
export function CustomersList() {
  const [tab, setTab] = useState<SegmentTab>("all");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [sendTo, setSendTo] = useState<{ customers: AdminCustomer[]; clear: () => void } | null>(null);

  const total = adminCustomers.length;
  const repeatRate = (adminCustomers.filter((c) => c.orders >= 2).length / total) * 100;
  const avgLtv = Math.round(adminCustomers.reduce((s, c) => s + c.lifetimeValue, 0) / total);
  const atRisk = adminCustomers.filter((c) => c.segment === "at-risk").length;

  // Search and filters scope every tab; the tab adds the segment on top.
  const matching = useMemo(() => {
    const q = search.trim().toLowerCase();
    const digits = q.replace(/\D/g, "");
    const stateSel = filters.state ?? [];
    const optSel = filters.marketing ?? [];
    return adminCustomers.filter(
      (c) =>
        (!q || c.name.toLowerCase().includes(q) || c.email.includes(q) || (digits.length >= 3 && c.phone.includes(digits))) &&
        (stateSel.length === 0 || stateSel.includes(c.state)) &&
        (optSel.length === 0 || optSel.includes(c.marketingOptIn ? "yes" : "no")),
    );
  }, [search, filters]);

  const counts = segmentOrder.reduce<Record<SegmentTab, number>>(
    (acc, s) => ({ ...acc, [s]: matching.filter((c) => c.segment === s).length }),
    { all: matching.length, new: 0, repeat: 0, vip: 0, "at-risk": 0 },
  );

  const columns: DataColumn<AdminCustomer>[] = [
    {
      id: "customer",
      header: "Customer",
      sortValue: (c) => c.name,
      cell: (c) => (
        <span className="flex items-center gap-3">
          <span aria-hidden className="contents">
            <Avatar name={c.name} size="sm" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-body-strong">{c.name}</span>
            <span className="truncate text-caption text-fg-muted">{c.email}</span>
          </span>
        </span>
      ),
    },
    {
      id: "location",
      header: "Location",
      sortValue: (c) => `${c.state} ${c.city}`,
      hideBelow: "lg",
      hideable: true,
      cell: (c) => (
        <span className="flex flex-col">
          <span>{c.city}</span>
          <span className="text-caption text-fg-muted">{c.state}</span>
        </span>
      ),
    },
    { id: "orders", header: "Orders", align: "end", sortValue: (c) => c.orders, cell: (c) => formatNumber(c.orders) },
    { id: "ltv", header: "Lifetime value", align: "end", sortValue: (c) => c.lifetimeValue, cell: (c) => formatPrice(c.lifetimeValue) },
    { id: "last", header: "Last order", sortValue: (c) => c.lastOrderAt, hideBelow: "md", hideable: true, cell: (c) => <span className="figures">{adminDateShort(c.lastOrderAt)}</span> },
    { id: "segment", header: "Segment", sortValue: (c) => segmentOrder.indexOf(c.segment), cell: (c) => <SegmentBadge segment={c.segment} /> },
    { id: "marketing", header: "Marketing", hideBelow: "xl", hideable: true, sortValue: (c) => (c.marketingOptIn ? 1 : 0), cell: (c) => <span className={c.marketingOptIn ? "text-fg" : "text-fg-muted"}>{c.marketingOptIn ? "Yes" : "No"}</span> },
  ];

  const exportRows = (rows: AdminCustomer[]) =>
    toast({ title: `Exporting ${formatNumber(rows.length)} customers`, description: "CSV with contact, orders and lifetime value. Demo: no file is created.", tone: "info" });

  const renderCard = (c: AdminCustomer) => (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <Avatar name={c.name} size="sm" />
        <div className="min-w-0 flex-1">
          <Link href={`/admin/customers/${c.id}`} className="text-body-strong focus-ring-card [--focus-card-radius:var(--radius-md)] after:absolute after:inset-0">
            {c.name}
          </Link>
          <p className="truncate text-caption text-fg-muted">
            {c.city}, {c.state}
          </p>
        </div>
        <SegmentBadge segment={c.segment} />
      </div>
      <p className="flex flex-wrap gap-x-3 text-caption text-fg-muted figures">
        <span>
          <span className="text-fg">{formatNumber(c.orders)}</span> orders
        </span>
        <span>
          <span className="text-fg">{formatPrice(c.lifetimeValue)}</span> lifetime
        </span>
        <span>Last {adminDateShort(c.lastOrderAt)}</span>
      </p>
    </div>
  );

  const tabs: SegmentTab[] = ["all", ...segmentOrder];

  return (
    <>
      <PageHeader
        title="Customers"
        meta={
          <>
            <span>{formatNumber(total)} customers</span>
            <span aria-hidden>·</span>
            <span>{ADMIN_DEMO_NOTE}</span>
          </>
        }
        actions={
          <Button variant="secondary" leadingIcon={<Download aria-hidden />} onClick={() => exportRows(adminCustomers)}>
            Export
          </Button>
        }
      />

      <KpiRow>
        <KpiTile label="Customers" value={formatNumber(total)} note={`${formatNumber(adminCustomers.filter((c) => c.segment === "new").length)} new`} />
        <KpiTile label="Repeat rate" value={`${formatNumber(repeatRate, { maximumFractionDigits: 1 })}%`} note="2 or more orders" />
        <KpiTile label="Avg lifetime value" value={formatPrice(avgLtv)} note="per customer" />
        <KpiTile label="At risk" value={formatNumber(atRisk)} note="no order in 120+ days" />
      </KpiRow>

      <Tabs value={tab} onValueChange={(v) => setTab(v as SegmentTab)} className="gap-4">
        <TabsList variant="underline" aria-label="Customer segments" className="w-full">
          {tabs.map((t) => (
            <TabsTrigger key={t} value={t} count={counts[t]}>
              {t === "all" ? "All" : segmentMeta[t].label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((t) => (
          <TabsContent key={t} value={t}>
            <DataTable
              caption={t === "all" ? "Customers" : `${segmentMeta[t].label} customers`}
              columns={columns}
              rows={t === "all" ? matching : matching.filter((c) => c.segment === t)}
              getRowId={(c) => c.id}
              rowHref={(c) => `/admin/customers/${c.id}`}
              defaultSort={{ id: "ltv", direction: "desc" }}
              selectable
              bulkActions={(selected, clear) => (
                <>
                  <Button size="sm" variant="inverse" leadingIcon={<BadgePercent aria-hidden />} onClick={() => setSendTo({ customers: selected, clear })}>
                    Send coupon
                  </Button>
                  <Button size="sm" variant="ghost" className="text-fg-inverse" leadingIcon={<Download aria-hidden />} onClick={() => exportRows(selected)}>
                    Export
                  </Button>
                </>
              )}
              toolbar={
                <FilterBar
                  search={search}
                  onSearchChange={setSearch}
                  searchPlaceholder="Search name, email or phone"
                  filters={[
                    { id: "state", label: "State", options: states.map((s) => ({ value: s, label: s, count: adminCustomers.filter((c) => c.state === s).length })) },
                    {
                      id: "marketing",
                      label: "Marketing",
                      options: [
                        { value: "yes", label: "Opted in", count: adminCustomers.filter((c) => c.marketingOptIn).length },
                        { value: "no", label: "Not opted in", count: adminCustomers.filter((c) => !c.marketingOptIn).length },
                      ],
                    },
                  ]}
                  values={filters}
                  onValuesChange={setFilters}
                />
              }
              empty={{
                ...emptyCopy[t],
                action:
                  search || Object.values(filters).some((v) => v.length) ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSearch("");
                        setFilters({});
                      }}
                    >
                      Clear search and filters
                    </Button>
                  ) : t === "at-risk" ? undefined : (
                    <Button variant="secondary" size="sm" onClick={() => setTab("all")}>
                      Show all customers
                    </Button>
                  ),
              }}
              renderCard={renderCard}
            />
          </TabsContent>
        ))}
      </Tabs>

      <SendCouponDialog
        open={sendTo !== null}
        onOpenChange={(o) => !o && setSendTo(null)}
        customers={sendTo?.customers ?? []}
        onSent={() => sendTo?.clear()}
      />
    </>
  );
}
