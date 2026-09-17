// Server-safe report slices for /admin/reports. Every figure is demo data derived from lib/data/admin.
import {
  adminOrders,
  categorySales,
  conversionFunnel,
  dailySales,
  ordersHeatmap,
  paymentMix,
  returnReasons,
} from "@/lib/data/admin";

export type ReportChannel = "all" | "Web" | "App";

const isoLocal = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const sum = (list: number[]) => list.reduce((t, v) => t + v, 0);
const pct = (a: number, b: number) => (b ? ((a - b) / b) * 100 : 0);

const appShare = adminOrders.filter((o) => o.channel === "App").length / adminOrders.length;
/** Channel share of daily sales, with a small deterministic day-to-day wobble so the two channels don't draw identical shapes. */
function shareOn(channel: ReportChannel, dayIndex: number) {
  if (channel === "all") return 1;
  const wobble = 0.03 * Math.sin(dayIndex * 1.7);
  return channel === "App" ? appShare + wobble : 1 - appShare - wobble;
}

export const REPORT_DATA_FROM = dailySales[0]!.date;
const base30Revenue = sum(dailySales.slice(-30).map((d) => d.revenue));

export type ReportDay = { date: string; label: string; orders: number; revenue: number; visitors: number };

export function reportSlice(range: { from: string; to: string }, channel: ReportChannel) {
  const scaled = dailySales.map((d, i): ReportDay => {
    const k = shareOn(channel, i);
    return { date: d.date, label: d.label, orders: Math.round(d.orders * k), revenue: Math.round(d.revenue * k), visitors: Math.round(d.visitors * k) };
  });
  const start = scaled.findIndex((d) => d.date >= range.from);
  const days = start < 0 ? [] : scaled.slice(start).filter((d) => d.date <= range.to);
  const prevStart = start - days.length;
  const previous = days.length > 0 && prevStart >= 0 ? scaled.slice(prevStart, start) : null;

  const totals = (list: ReportDay[]) => {
    const revenue = sum(list.map((d) => d.revenue));
    const orders = sum(list.map((d) => d.orders));
    const visitors = sum(list.map((d) => d.visitors));
    return { revenue, orders, visitors, aov: orders ? Math.round(revenue / orders) : 0, conversion: visitors ? (orders / visitors) * 100 : 0 };
  };
  const cur = totals(days);
  const prev = previous ? totals(previous) : null;
  const factor = cur.revenue / base30Revenue;
  const prevFactor = prev ? prev.revenue / base30Revenue : 0;

  return {
    days,
    previous,
    totals: cur,
    delta: prev
      ? { revenue: pct(cur.revenue, prev.revenue), orders: pct(cur.orders, prev.orders), aov: pct(cur.aov, prev.aov), conversion: pct(cur.conversion, prev.conversion) }
      : null,
    categories: categorySales.map((c) => ({ id: c.id, label: c.label, current: Math.round(c.revenue * factor), previous: Math.round(c.lastPeriod * prevFactor) })),
    returnReasons: returnReasons.map((r) => ({ ...r, value: Math.round(r.value * factor) })),
    funnel: conversionFunnel.map((s) => ({ ...s, value: Math.round(s.value * factor) })),
    heatmap: ordersHeatmap.map((row) => row.map((v) => Math.round(v * factor))),
    paymentMix: channelPaymentMix[channel],
    rto: channelRto[channel],
    cities: topCities(range, channel),
  };
}

/* ---------------------------------------------------------------- fixed demo splits per channel */

const channelPaymentMix: Record<ReportChannel, typeof paymentMix> = {
  all: paymentMix,
  Web: paymentMix.map((p) => ({ ...p, value: ({ upi: 0.38, card: 0.27, cod: 0.21, netbanking: 0.09, other: 0.05 } as Record<string, number>)[p.id] ?? p.value })),
  App: paymentMix.map((p) => ({ ...p, value: ({ upi: 0.51, card: 0.14, cod: 0.26, netbanking: 0.03, other: 0.06 } as Record<string, number>)[p.id] ?? p.value })),
};

/** Return-to-origin rate (% of shipped orders) for COD and prepaid, this period and the one before. */
const channelRto: Record<ReportChannel, { cod: number; prepaid: number; codPrev: number; prepaidPrev: number }> = {
  all: { cod: 18.4, prepaid: 6.2, codPrev: 19.9, prepaidPrev: 6.0 },
  Web: { cod: 21.3, prepaid: 7.4, codPrev: 22.0, prepaidPrev: 7.1 },
  App: { cod: 16.9, prepaid: 5.6, codPrev: 18.6, prepaidPrev: 5.5 },
};

/* ---------------------------------------------------------------- top cities from the order book */

export type CityRow = { city: string; state: string; orders: number; revenue: number; aov: number; codShare: number };

export function topCities(range: { from: string; to: string }, channel: ReportChannel): CityRow[] {
  const inRange = adminOrders.filter((o) => {
    const day = isoLocal(new Date(o.placedAt));
    return day >= range.from && day <= range.to && o.status !== "cancelled" && (channel === "all" || o.channel === channel);
  });
  const byCity = inRange.reduce<Record<string, { state: string; orders: number; revenue: number; cod: number }>>((acc, o) => {
    const row = acc[o.city] ?? { state: o.state, orders: 0, revenue: 0, cod: 0 };
    return { ...acc, [o.city]: { state: row.state, orders: row.orders + 1, revenue: row.revenue + o.total, cod: row.cod + (o.payment === "COD" ? 1 : 0) } };
  }, {});
  return Object.entries(byCity)
    .map(([city, r]) => ({ city, state: r.state, orders: r.orders, revenue: r.revenue, aov: Math.round(r.revenue / r.orders), codShare: (r.cod / r.orders) * 100 }))
    .sort((a, b) => b.revenue - a.revenue);
}
