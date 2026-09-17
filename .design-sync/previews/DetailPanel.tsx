import { useState } from "react";
import { Button, DetailPanel, formatPrice, sampleData, StatusPill } from "@bluesigns/ui";

const { adminOrders, orderStatusMeta } = sampleData;
type Order = (typeof adminOrders)[number];

export const MasterDetail = () => {
  const [open, setOpen] = useState<Order | null>(adminOrders[1]!);
  return (
    <div className="flex items-start gap-4" style={{ width: 860 }}>
      <ul className="flex min-w-0 flex-1 flex-col divide-y divide-border-subtle rounded-2xl bg-surface shadow-flat">
        {adminOrders.slice(0, 6).map((o) => (
          <li key={o.id}>
            <button
              type="button"
              onClick={() => setOpen(o)}
              aria-pressed={open?.id === o.id}
              className="state-layer focus-ring-row relative flex h-row-lg w-full items-center gap-3 px-4 text-left aria-pressed:bg-selected"
            >
              <span className="flex-1 text-body-strong">{o.id}</span>
              <span className="text-body text-fg-muted">{o.customerName}</span>
              <span className="w-24 text-right text-body figures">{formatPrice(o.total)}</span>
            </button>
          </li>
        ))}
      </ul>
      <DetailPanel
        open={!!open}
        onOpenChange={(v) => !v && setOpen(null)}
        title={open?.id ?? ""}
        description={open ? `${open.customerName} · ${open.city}` : undefined}
        footer={
          <Button size="sm" fullWidth>
            Mark as packed
          </Button>
        }
      >
        {open && (
          <>
            <StatusPill tone={orderStatusMeta[open.status].tone} label={orderStatusMeta[open.status].label} className="self-start" />
            <ul className="flex flex-col gap-2 text-body">
              {open.lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span>
                    {l.name} × {l.quantity}
                  </span>
                  <span className="figures">{formatPrice(l.price * l.quantity)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </DetailPanel>
    </div>
  );
};
