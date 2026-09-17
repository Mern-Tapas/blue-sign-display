import { OrderStatusBadge } from "@bluesigns/ui";

export const AllStatuses = () => (
  <div className="flex flex-wrap items-center gap-3">
    <OrderStatusBadge status="processing" />
    <OrderStatusBadge status="shipped" />
    <OrderStatusBadge status="out-for-delivery" />
    <OrderStatusBadge status="delivered" />
    <OrderStatusBadge status="cancelled" />
    <OrderStatusBadge status="returned" />
  </div>
);

const rows = [
  { id: "LM-100482", status: "out-for-delivery", note: "Arriving today by 9 PM" },
  { id: "LM-100377", status: "delivered", note: "Delivered on 9 Sept" },
  { id: "LM-100251", status: "processing", note: "Packing at Bhiwandi warehouse" },
] as const;

export const InOrderRows = () => (
  <div className="flex flex-col gap-2" style={{ maxWidth: 420 }}>
    {rows.map((r) => (
      <div key={r.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4">
        <div>
          <p className="text-body-strong"># {r.id}</p>
          <p className="text-caption text-fg-muted">{r.note}</p>
        </div>
        <OrderStatusBadge status={r.status} />
      </div>
    ))}
  </div>
);
