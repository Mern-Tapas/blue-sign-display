import { useState } from "react";
import { OrdersTable, sampleData, StatusTabs } from "@bluesigns/ui";

const { adminOrders, adminReturns } = sampleData;

type OrderTab = "all" | "pending" | "to-pack" | "ready" | "shipped";
const orderTabs: { id: OrderTab; label: string; statuses: string[] | null }[] = [
  { id: "all", label: "All", statuses: null },
  { id: "pending", label: "Payment pending", statuses: ["pending"] },
  { id: "to-pack", label: "To pack", statuses: ["confirmed"] },
  { id: "ready", label: "Ready to ship", statuses: ["packed"] },
  { id: "shipped", label: "Shipped", statuses: ["shipped", "out-for-delivery"] },
];
const recent = adminOrders.slice(0, 30);
const inTab = (tab: OrderTab) => recent.filter((o) => orderTabs.find((t) => t.id === tab)!.statuses?.includes(o.status) ?? true);

export const OrderQueue = () => {
  const [tab, setTab] = useState<OrderTab>("to-pack");
  const counts = Object.fromEntries(orderTabs.map((t) => [t.id, inTab(t.id).length])) as Record<OrderTab, number>;
  return (
    <div style={{ width: 1000 }}>
      <StatusTabs label="Order status" tabs={orderTabs} value={tab} onValueChange={setTab} counts={counts} hideWhenEmpty={["pending"]}>
        <OrdersTable rows={inTab(tab).slice(0, 5)} empty={{ title: "Nothing here yet" }} onMarkPacked={() => {}} onPrintLabels={() => {}} onExport={() => {}} />
      </StatusTabs>
    </div>
  );
};

type ReturnTab = "all" | "requested" | "approved" | "refunded" | "rejected";
const returnTabs: { id: ReturnTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "requested", label: "To review" },
  { id: "approved", label: "Approved" },
  { id: "refunded", label: "Refunded" },
  { id: "rejected", label: "Rejected" },
];

export const ReturnTabs = () => {
  const [tab, setTab] = useState<ReturnTab>("requested");
  const counts = Object.fromEntries(returnTabs.map((t) => [t.id, t.id === "all" ? adminReturns.length : adminReturns.filter((r) => r.status === t.id).length])) as Record<ReturnTab, number>;
  const rows = tab === "all" ? adminReturns : adminReturns.filter((r) => r.status === tab);
  return (
    <div style={{ width: 640 }}>
      <StatusTabs label="Return status" tabs={returnTabs} value={tab} onValueChange={setTab} counts={counts}>
        <ul className="flex flex-col divide-y divide-border-subtle rounded-xl bg-surface shadow-flat">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="flex flex-col">
                <span className="text-body-strong">{r.id}</span>
                <span className="text-caption text-fg-muted">
                  {r.productName} · {r.reason}
                </span>
              </span>
              <span className="text-caption text-fg-muted">{r.customerName}</span>
            </li>
          ))}
        </ul>
      </StatusTabs>
    </div>
  );
};
