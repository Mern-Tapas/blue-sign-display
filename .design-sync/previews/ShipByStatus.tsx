import { sampleData, ShipByStatus } from "@bluesigns/ui";

const { ADMIN_TODAY } = sampleData;

const HOUR = 3600000;
/** Ship-by deadline relative to the admin demo "now". */
const due = (hours: number) => new Date(ADMIN_TODAY.getTime() + hours * HOUR).toISOString();

const rows = [
  { id: "LM-200598", label: "On time", order: { status: "confirmed" as const, shipBy: due(34) } },
  { id: "LM-200594", label: "Within 24 h", order: { status: "packed" as const, shipBy: due(6) } },
  { id: "LM-200571", label: "Overdue", order: { status: "confirmed" as const, shipBy: due(-3) } },
  { id: "LM-200560", label: "Already shipped", order: { status: "shipped" as const, shipBy: due(-20) } },
];

export const Stacked = () => (
  <div className="flex flex-col divide-y divide-border-subtle rounded-xl bg-surface shadow-flat" style={{ width: 420 }}>
    {rows.map((r) => (
      <div key={r.id} className="flex items-center justify-between gap-4 px-4 py-3">
        <span className="flex flex-col">
          <span className="text-body-strong">{r.id}</span>
          <span className="text-caption text-fg-muted">{r.label}</span>
        </span>
        <ShipByStatus order={r.order} />
      </div>
    ))}
  </div>
);

export const Inline = () => (
  <div className="flex flex-col gap-3">
    {rows.slice(0, 3).map((r) => (
      <ShipByStatus key={r.id} order={r.order} layout="inline" />
    ))}
  </div>
);
