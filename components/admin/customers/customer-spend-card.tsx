"use client";

import { BarChart } from "@/components/charts/bar-chart";
import { ChartFrame } from "@/components/charts/chart-frame";
import { Card } from "@/components/ui/card";
import { Inset } from "@/components/ui/inset";
import type { AdminOrder } from "@/lib/data/admin";
import { formatNumber, formatPrice } from "@/lib/format";
import { monthlySpend } from "./customer-data";

/**
 * Monthly spend from the customer's recent orders. With fewer than two months of orders a bar chart
 * would be a single bar, so the card shows the figure instead.
 */
export function CustomerSpendCard({ orders, firstName }: { orders: AdminOrder[]; firstName: string }) {
  const months = monthlySpend(orders);

  if (months.length < 2) {
    const only = months[0];
    return (
      <Card padding="md" className="gap-3">
        <h2 className="text-title">Spend by month</h2>
        {only ? (
          <Inset size="sm" className="flex flex-col gap-0.5">
            <p className="text-caption text-fg-muted">{only.label}</p>
            <p className="text-heading-md">{formatPrice(only.value)}</p>
            <p className="text-caption text-fg-muted">
              across {formatNumber(only.orders)} {only.orders === 1 ? "order" : "orders"}
            </p>
          </Inset>
        ) : (
          <p className="text-body text-fg-muted">No spend from {firstName} in the last 60 days. Cancelled, returned and RTO orders don’t count.</p>
        )}
        <p className="text-caption text-fg-muted">A monthly chart appears once there are orders in two or more months.</p>
      </Card>
    );
  }

  const total = months.reduce((s, m) => s + m.value, 0);
  return (
    <ChartFrame
      title="Spend by month"
      description={`${formatPrice(total)} over the last 60 days, excluding cancelled, returned and RTO orders`}
      table={{ columns: ["Month", "Spend", "Orders"], rows: months.map((m) => [m.label, formatPrice(m.value), formatNumber(m.orders)]) }}
    >
      <BarChart
        categories={months.map((m) => m.short)}
        series={[{ id: "spend", label: "Spend", slot: 0, values: months.map((m) => m.value) }]}
        format="inr"
        height={160}
        valueLabels
        summary={`${firstName}'s spend by month: ${months.map((m) => `${m.label} ${formatPrice(m.value)}`).join(", ")}.`}
      />
    </ChartFrame>
  );
}
