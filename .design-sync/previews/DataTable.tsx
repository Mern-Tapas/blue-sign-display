import { useState } from "react";
import { AdminFilterBar, Button, DataTable, formatPrice, sampleData, StatusPill } from "@bluesigns/ui";

const { adminOrders, orderStatusMeta } = sampleData;
type Order = (typeof adminOrders)[number];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const placed = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() < 12 ? "am" : "pm"}`;
};

const columns = [
  {
    id: "order",
    header: "Order",
    sortValue: (o: Order) => o.placedAt,
    cell: (o: Order) => (
      <span className="flex flex-col">
        <span className="text-body-strong">{o.id}</span>
        <span className="text-caption text-fg-muted">{placed(o.placedAt)}</span>
      </span>
    ),
  },
  {
    id: "customer",
    header: "Customer",
    sortValue: (o: Order) => o.customerName,
    cell: (o: Order) => (
      <span className="flex flex-col">
        <span>{o.customerName}</span>
        <span className="text-caption text-fg-muted">{o.city}</span>
      </span>
    ),
  },
  { id: "payment", header: "Payment", hideable: true, cell: (o: Order) => o.payment },
  { id: "total", header: "Total", align: "end" as const, sortValue: (o: Order) => o.total, cell: (o: Order) => formatPrice(o.total) },
  {
    id: "status",
    header: "Status",
    sortValue: (o: Order) => o.status,
    cell: (o: Order) => <StatusPill tone={orderStatusMeta[o.status].tone} label={orderStatusMeta[o.status].label} live={orderStatusMeta[o.status].live} />,
  },
];

const OrdersTable = (props: { loading?: boolean; error?: string; rows?: Order[]; density?: "comfortable" | "compact" }) => {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const rows = (props.rows ?? adminOrders).filter((o) => !q || `${o.id} ${o.customerName}`.toLowerCase().includes(q.toLowerCase())).filter((o) => !filters.payment?.length || filters.payment.includes(o.payment));
  return (
    <div style={{ width: 860 }}>
      <DataTable
        caption="Orders"
        columns={columns}
        rows={rows}
        getRowId={(o) => o.id}
        selectable
        defaultSort={{ id: "order", direction: "desc" }}
        pageSize={6}
        density={props.density}
        loading={props.loading}
        error={props.error}
        onRetry={() => {}}
        empty={{ title: "No orders match", description: "Try another search or clear the payment filter." }}
        toolbar={
          <AdminFilterBar
            search={q}
            onSearchChange={setQ}
            searchPlaceholder="Search order or customer"
            filters={[{ id: "payment", label: "Payment", options: ["UPI", "Card", "COD", "Net banking"].map((p) => ({ value: p, label: p })) }]}
            values={filters}
            onValuesChange={setFilters}
          />
        }
        bulkActions={(sel, clear) => (
          <>
            <Button size="sm" variant="inverse" onClick={clear}>
              Mark {sel.length} as packed
            </Button>
            <Button size="sm" variant="ghost" className="text-fg-inverse">
              Print labels
            </Button>
          </>
        )}
        renderCard={(o) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-body-strong">{o.id}</span>
              <span className="text-body-strong figures">{formatPrice(o.total)}</span>
            </div>
            <span className="text-caption text-fg-muted">
              {o.customerName} · {o.city}
            </span>
          </div>
        )}
      />
    </div>
  );
};

export const Orders = () => <OrdersTable />;

export const Compact = () => <OrdersTable density="compact" />;

export const Loading = () => <OrdersTable loading />;

export const Empty = () => <OrdersTable rows={[]} />;

export const Error = () => <OrdersTable error="The orders service didn’t respond. Your data is safe." />;
