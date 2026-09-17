"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { BarChart } from "@/components/charts/bar-chart";
import { ChartFrame, ChartLegend } from "@/components/charts/chart-frame";
import { Heatmap } from "@/components/charts/heatmap";
import { slotColor } from "@/components/charts/scales";
import { Funnel, ShareBar } from "@/components/charts/small-charts";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { adminDateShort } from "@/lib/admin-format";
import { ADMIN_DEMO_NOTE, ADMIN_TODAY, hours, inrCompact, weekdays } from "@/lib/data/admin";
import { rangeLabel, resolveRange, type DateRangeValue } from "@/lib/date-range";
import { formatNumber, formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import { DateRangePicker } from "../date-range-picker";
import { KpiRow, KpiTile } from "../metrics";
import { PageHeader } from "../page-header";
import { downloadCsv } from "./download-csv";
import { REPORT_DATA_FROM, reportSlice, type ReportChannel } from "./reports-data";
import { SalesTrendChart } from "./sales-trend-chart";
import { TopCitiesTable } from "./top-cities-table";

type Filters = { range: DateRangeValue; channel: ReportChannel };

const initialFilters = (): Filters => ({ range: { ...resolveRange("30d", ADMIN_TODAY), compare: true }, channel: "all" });
const pctText = (v: number) => `${formatNumber(v, { maximumFractionDigits: 1 })}%`;
const relChange = (a: number, b: number) => (b ? ((a - b) / b) * 100 : 0);

/**
 * Sales reports. One filter row (date range + channel) scopes every tile, chart and table below it;
 * while a new slice "loads", charts hold their previous render at reduced opacity.
 */
export function ReportsScreen() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [applied, setApplied] = useState<Filters>(filters);
  const timer = useRef<number | undefined>(undefined);
  const refreshing = filters !== applied;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const update = (next: Filters) => {
    setFilters(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setApplied(next), 350);
  };

  const { range, channel } = applied;
  const data = reportSlice(range, channel);
  const t = data.totals;
  const compare = !!range.compare && data.previous !== null;
  const period = compare ? "vs previous period" : undefined;
  const scope = channel === "all" ? "all channels" : `${channel} only`;
  const clipped = range.from < REPORT_DATA_FROM;
  const hasDays = data.days.length > 0;

  const categorySeries = [
    { id: "current", label: compare ? "Selected period" : "Net sales", slot: 0, values: data.categories.map((c) => c.current) },
    ...(compare ? [{ id: "previous", label: "Previous period", slot: 1, values: data.categories.map((c) => c.previous) }] : []),
  ];
  const reasonTotal = data.returnReasons.reduce((s, r) => s + r.value, 0);
  const paymentSegments = data.paymentMix.map((p) => ({ ...p, value: Math.round(p.value * 1000) }));

  const exportCsv = () => {
    downloadCsv(`bluesigns-sales-${range.from}-to-${range.to}-${channel}.csv`, [
      ["Date", "Net sales", "Orders", "Sessions"],
      ...data.days.map((d) => [d.date, d.revenue, d.orders, d.visitors]),
      [],
      ["Demo data — illustrative figures"],
    ]);
    toast({ title: "Sales report exported", description: `${rangeLabel(range)}, ${scope}`, tone: "success" });
  };

  return (
    <>
      <PageHeader
        title="Reports"
        meta={
          <>
            <span>Sales, payments, returns and shoppers</span>
            <span aria-hidden>·</span>
            <span>{ADMIN_DEMO_NOTE}</span>
          </>
        }
        actions={
          <Button variant="secondary" leadingIcon={<Download aria-hidden />} onClick={exportCsv} disabled={!hasDays}>
            Export CSV
          </Button>
        }
      >
        <div role="group" aria-label="Report filters" className="flex flex-wrap items-center gap-2">
          <DateRangePicker value={filters.range} onValueChange={(r) => update({ ...filters, range: r })} today={ADMIN_TODAY} />
          <SegmentedControl
            aria-label="Channel"
            value={filters.channel}
            onValueChange={(v) => update({ ...filters, channel: v as ReportChannel })}
            options={[
              { value: "all", label: "All channels" },
              { value: "Web", label: "Web" },
              { value: "App", label: "App" },
            ]}
          />
          <p aria-live="polite" className="text-caption text-fg-muted">
            {refreshing ? "Updating…" : clipped ? `Demo data starts ${adminDateShort(REPORT_DATA_FROM)}` : ""}
          </p>
        </div>
      </PageHeader>

      <div aria-busy={refreshing || undefined} className={cn("transition-opacity duration-(--dur-base)", refreshing && "opacity-60")}>
        <KpiRow>
          <KpiTile label="Net sales" value={inrCompact(t.revenue)} delta={compare && data.delta ? { value: data.delta.revenue, period } : undefined} trend={data.days.slice(-14).map((d) => d.revenue)} />
          <KpiTile label="Orders" value={formatNumber(t.orders)} delta={compare && data.delta ? { value: data.delta.orders, period } : undefined} trend={data.days.slice(-14).map((d) => d.orders)} />
          <KpiTile label="Average order value" value={formatPrice(t.aov)} delta={compare && data.delta ? { value: data.delta.aov, period } : undefined} />
          <KpiTile label="Conversion rate" value={pctText(t.conversion)} delta={compare && data.delta ? { value: data.delta.conversion, period } : undefined} note="orders ÷ sessions" />
        </KpiRow>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <SalesTrendChart days={data.days} previous={data.previous} compare={compare} scope={scope} refreshing={refreshing} />

        <ChartFrame
          title="Sales by category"
          description={`Net sales, ${rangeLabel(range).toLowerCase()} · ${scope}`}
          refreshing={refreshing}
          legend={compare ? <ChartLegend items={categorySeries.map((s) => ({ label: s.label, color: slotColor(s.slot) }))} /> : undefined}
          table={{
            columns: compare ? ["Category", "Selected period", "Previous period", "Change"] : ["Category", "Net sales"],
            rows: data.categories.map((c) =>
              compare ? [c.label, formatPrice(c.current), formatPrice(c.previous), `${relChange(c.current, c.previous) >= 0 ? "+" : "−"}${pctText(Math.abs(relChange(c.current, c.previous)))}`] : [c.label, formatPrice(c.current)],
            ),
          }}
        >
          <BarChart
            orientation="horizontal"
            categories={data.categories.map((c) => c.label)}
            series={categorySeries}
            format="inr"
            valueLabels={!compare}
            summary={`Net sales by category${compare ? ", selected period against the previous period" : ""}. Highest: ${[...data.categories].sort((a, b) => b.current - a.current)[0]?.label}.`}
          />
        </ChartFrame>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <ChartFrame
          title="Payment methods"
          description={`Share of orders · ${scope}`}
          refreshing={refreshing}
          table={{ columns: ["Method", "Share of orders"], rows: data.paymentMix.map((p) => [p.label, `${Math.round(p.value * 100)}%`]) }}
        >
          <ShareBar label={`Payment methods, ${scope}`} segments={paymentSegments} showValues={false} />
          <p className="text-caption text-fg-muted">
            Cash on Delivery is {Math.round((data.paymentMix.find((p) => p.id === "cod")?.value ?? 0) * 100)}% of orders but returns to origin{" "}
            {formatNumber(data.rto.cod / data.rto.prepaid, { maximumFractionDigits: 1 })}× as often as prepaid.
          </p>
        </ChartFrame>

        <section aria-labelledby="rto-title" className={cn("flex flex-col gap-3 transition-opacity duration-(--dur-base)", refreshing && "opacity-60")}>
          <h2 id="rto-title" className="sr-only">
            Return to origin rate, COD vs prepaid
          </h2>
          <KpiTile label="COD RTO rate" value={pctText(data.rto.cod)} delta={{ value: relChange(data.rto.cod, data.rto.codPrev), period: "vs previous period", goodDirection: "down" }} note="of shipped COD orders" />
          <KpiTile
            label="Prepaid RTO rate"
            value={pctText(data.rto.prepaid)}
            delta={{ value: relChange(data.rto.prepaid, data.rto.prepaidPrev), period: "vs previous period", goodDirection: "down" }}
            note="of shipped UPI, card and wallet orders"
          />
        </section>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <ChartFrame
          title="Return reasons"
          description={`${formatNumber(reasonTotal)} return requests · ${scope}`}
          refreshing={refreshing}
          table={{ columns: ["Reason", "Returns", "Share"], rows: data.returnReasons.map((r) => [r.label, formatNumber(r.value), reasonTotal ? `${Math.round((r.value / reasonTotal) * 100)}%` : "0%"]) }}
        >
          <BarChart
            orientation="horizontal"
            categories={data.returnReasons.map((r) => r.label)}
            series={[{ id: "returns", label: "Returns", slot: 0, values: data.returnReasons.map((r) => r.value) }]}
            valueLabels
            summary={`Return requests by reason. Most common: ${data.returnReasons[0]?.label} (${formatNumber(data.returnReasons[0]?.value ?? 0)}).`}
          />
          <p className="text-caption text-fg-muted">Size issues drive most returns. A size chart on apparel and footwear pages is the quickest fix.</p>
        </ChartFrame>

        <ChartFrame
          title="Conversion funnel"
          description={`Sessions to placed orders · ${scope}`}
          refreshing={refreshing}
          table={{ columns: ["Stage", "Count", "From previous stage"], rows: data.funnel.map((s, i) => [s.label, formatNumber(s.value), i === 0 ? "—" : `${Math.round((s.value / Math.max(1, data.funnel[i - 1]!.value)) * 100)}%`]) }}
        >
          <Funnel label="Conversion funnel" stages={data.funnel} format="compact" />
        </ChartFrame>
      </div>

      <ChartFrame
        title="Orders by hour"
        description={`Orders by weekday and hour (IST) · ${scope}`}
        refreshing={refreshing}
        table={{ columns: ["Day", ...hours], rows: weekdays.map((d, i) => [d, ...data.heatmap[i]!.map((v) => formatNumber(v))]) }}
      >
        <Heatmap rows={weekdays} columns={hours} values={data.heatmap} label="Orders by weekday and hour" />
      </ChartFrame>

      <section aria-labelledby="cities-title" className={cn("flex flex-col gap-3 transition-opacity duration-(--dur-base)", refreshing && "opacity-60")}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="cities-title" className="text-title">
            Top cities
          </h2>
          <p className="text-caption text-fg-muted">
            From {formatNumber(data.cities.reduce((s, c) => s + c.orders, 0))} orders in the order book · {scope}
          </p>
        </div>
        <TopCitiesTable rows={data.cities} onReset={() => update(initialFilters())} />
      </section>
    </>
  );
}
