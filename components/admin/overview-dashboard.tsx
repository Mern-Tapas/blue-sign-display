"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Boxes, Clock, CreditCard, Download, PackageCheck, RotateCcw, Truck } from "lucide-react";
import { BarChart } from "@/components/charts/bar-chart";
import { ChartFrame } from "@/components/charts/chart-frame";
import { Heatmap } from "@/components/charts/heatmap";
import { LineChart } from "@/components/charts/line-chart";
import { Funnel, ShareBar } from "@/components/charts/small-charts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextLink } from "@/components/ui/text-link";
import { adminDateShort, adminRelative } from "@/lib/admin-format";
import {
  ADMIN_DEMO_NOTE,
  ADMIN_TODAY,
  adminProducts,
  auditLog,
  conversionFunnel,
  dailySales,
  hours,
  inrCompact,
  ordersHeatmap,
  paymentMix,
  pendingWork,
  salesTotals,
  weekdays,
} from "@/lib/data/admin";
import { resolveRange, type DateRangeValue } from "@/lib/date-range";
import { formatNumber, formatPrice } from "@/lib/format";
import { ActivityFeed } from "./admin-display";
import { DateRangePicker } from "./date-range-picker";
import { KpiRow, KpiTile } from "./metrics";
import { PageHeader } from "./page-header";

const presetDays: Record<string, number> = { today: 1, "7d": 7, "30d": 30, "90d": 45, mtd: 15, qtd: 45, custom: 30 };

/** Store overview: what needs doing now, how the period is going, and where sales come from. */
export function OverviewDashboard() {
  const [range, setRange] = useState<DateRangeValue>(() => ({ ...resolveRange("30d", ADMIN_TODAY), compare: true }));
  const days = presetDays[range.preset] ?? 30;
  const t = salesTotals(days);
  const window = dailySales.slice(-days);
  const period = range.compare ? `vs previous ${days === 1 ? "day" : `${days} days`}` : undefined;

  const tasks = [
    { label: "To pack", value: pendingWork.toPack, href: "/admin/orders?status=confirmed", icon: PackageCheck, note: "confirmed orders" },
    { label: "Ready to ship", value: pendingWork.toShip, href: "/admin/orders?status=packed", icon: Truck, note: "awaiting pickup" },
    { label: "Ship-by at risk", value: pendingWork.breachingSla, href: "/admin/orders?sla=risk", icon: Clock, note: "ship-by within 24 h", urgent: true },
    { label: "Payment pending", value: pendingWork.paymentPending, href: "/admin/orders?status=pending", icon: CreditCard, note: "UPI not completed" },
    { label: "Returns to review", value: pendingWork.returnsToReview, href: "/admin/returns", icon: RotateCcw, note: "new requests" },
    { label: "Low stock", value: pendingWork.lowStock, href: "/admin/inventory?filter=low", icon: Boxes, note: "at or below reorder point" },
  ];

  const topProducts = [...adminProducts].sort((a, b) => b.revenue30d - a.revenue30d).slice(0, 6);

  return (
    <>
      <PageHeader
        title="Overview"
        meta={
          <>
            <span>BlueSigns · India store</span>
            <span aria-hidden>·</span>
            <span>{ADMIN_DEMO_NOTE}</span>
          </>
        }
        actions={
          <>
            <DateRangePicker value={range} onValueChange={setRange} today={ADMIN_TODAY} />
            <Button variant="secondary" leadingIcon={<Download aria-hidden />}>
              Export
            </Button>
          </>
        }
      />

      <section aria-labelledby="attention-title" className="flex flex-col gap-3">
        <h2 id="attention-title" className="text-title">
          Needs attention
        </h2>
        <Card variant="outline" padding="none" className="overflow-hidden">
          <ul className="grid divide-y divide-border-subtle sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3 xl:grid-cols-6 [&>li]:border-border-subtle sm:[&>li]:border-b xl:[&>li]:border-b-0 xl:[&>li:not(:last-child)]:border-r">
            {tasks.map(({ label, value, href, icon: Icon, note, urgent }) => (
              <li key={label} className="relative">
                <Link href={href} className="state-layer focus-ring-row group relative flex h-full items-center gap-3 p-4">
                  <span aria-hidden className={urgent && value > 0 ? "text-danger-fg" : "text-fg-muted"}>
                    {urgent && value > 0 ? <AlertTriangle className="size-icon-base" /> : <Icon className="size-icon-base" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-caption text-fg-muted">{label}</span>
                    <span className="block text-heading-md">{formatNumber(value)}</span>
                    <span className="block truncate text-caption text-fg-muted">{note}</span>
                  </span>
                  <ArrowUpRight aria-hidden className="size-icon-sm text-fg-subtle transition-colors group-hover:text-fg" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <KpiRow>
        <KpiTile label="Net sales" value={inrCompact(t.revenue)} delta={{ value: t.delta.revenue, period }} trend={window.slice(-14).map((d) => d.revenue)} href="/admin/reports" />
        <KpiTile label="Orders" value={formatNumber(t.orders)} delta={{ value: t.delta.orders, period }} trend={window.slice(-14).map((d) => d.orders)} href="/admin/orders" />
        <KpiTile label="Average order value" value={formatPrice(t.aov)} delta={{ value: t.delta.aov, period }} />
        <KpiTile label="Conversion rate" value={`${formatNumber(t.conversion, { maximumFractionDigits: 2 })}%`} delta={{ value: t.delta.conversion, period }} note="orders ÷ sessions" />
      </KpiRow>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <ChartFrame
          title="Net sales"
          description={`Daily, ${adminDateShort(window[0]!.date)} – ${adminDateShort(window[window.length - 1]!.date)}`}
          table={{ columns: ["Date", "Net sales", "Orders"], rows: window.map((d) => [d.label, formatPrice(d.revenue), formatNumber(d.orders)]) }}
        >
          <LineChart labels={window.map((d) => d.label)} series={[{ id: "revenue", label: "Net sales", slot: 0, values: window.map((d) => d.revenue) }]} area format="inr" height={240} summary={`Net sales per day over ${days} days, from ${inrCompact(window[0]!.revenue)} to ${inrCompact(window[window.length - 1]!.revenue)}.`} />
        </ChartFrame>

        <ChartFrame title="Payment mix" description="Share of orders, last 30 days" table={{ columns: ["Method", "Share"], rows: paymentMix.map((p) => [p.label, `${Math.round(p.value * 100)}%`]) }}>
          <ShareBar label="Payment mix" segments={paymentMix.map((p) => ({ ...p, value: Math.round(p.value * 1000) }))} showValues={false} />
          <p className="text-caption text-fg-muted">COD orders return to origin 3× as often as prepaid ones. Nudge prepaid at checkout.</p>
        </ChartFrame>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <ChartFrame
          title="When orders come in"
          description="Orders by weekday and hour (IST), last 30 days"
          table={{ columns: ["Day", ...hours], rows: weekdays.map((d, i) => [d, ...ordersHeatmap[i]!.map(String)]) }}
        >
          <Heatmap rows={weekdays} columns={hours} values={ordersHeatmap} label="Orders by weekday and hour" />
        </ChartFrame>

        <ChartFrame title="Conversion funnel" description="Sessions to placed orders, last 30 days" table={{ columns: ["Stage", "Count"], rows: conversionFunnel.map((s) => [s.label, formatNumber(s.value)]) }}>
          <Funnel label="Conversion funnel" stages={conversionFunnel} format="compact" />
        </ChartFrame>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <ChartFrame
          title="Top products by sales"
          description="Last 30 days"
          action={<TextLink href="/admin/products" size="sm">All products</TextLink>}
          table={{ columns: ["Product", "Net sales", "Units"], rows: topProducts.map((p) => [p.name, formatPrice(p.revenue30d), formatNumber(p.sold30d)]) }}
        >
          <BarChart orientation="horizontal" categories={topProducts.map((p) => p.name)} series={[{ id: "revenue", label: "Net sales", slot: 0, values: topProducts.map((p) => p.revenue30d) }]} format="inr" valueLabels summary="Net sales for the six best-selling products over the last 30 days." />
        </ChartFrame>

        <Card padding="md" className="gap-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-title">Recent activity</h2>
            <TextLink href="/admin/settings/audit" size="sm">
              Audit log
            </TextLink>
          </div>
          <ActivityFeed items={auditLog} formatTime={(iso) => adminRelative(iso, ADMIN_TODAY)} />
        </Card>
      </div>
    </>
  );
}
