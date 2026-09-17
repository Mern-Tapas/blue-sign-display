import { Wallet } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { adminRelative } from "@/lib/admin-format";
import { ADMIN_TODAY } from "@/lib/data/admin";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { refundMethodLabel, type ReturnRecord } from "./return-records";

/** Refunds issued from the returns queue, newest first, with where the money went. */
export function RefundLedger({ records, className }: { records: ReturnRecord[]; className?: string }) {
  const refunds = records
    .filter((r): r is ReturnRecord & { refund: NonNullable<ReturnRecord["refund"]> } => !!r.refund)
    .sort((a, b) => b.refund.at.localeCompare(a.refund.at));
  const total = refunds.reduce((s, r) => s + r.refund.amount, 0);

  return (
    <Card padding="md" className={cn("min-w-0", className)}>
      <CardHeader title="Refunds issued" description={refunds.length ? `${refunds.length} ${refunds.length === 1 ? "refund" : "refunds"} · ${formatPrice(total)}` : "From this queue"} />
      {refunds.length === 0 ? (
        <EmptyState compact icon={<Wallet aria-hidden />} title="No refunds yet" description="Refunds you issue after an item is received show up here with their amount and method." />
      ) : (
        <ul className="flex flex-col divide-y divide-border-subtle">
          {refunds.map((r) => (
            <li key={r.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="truncate text-body-strong">{r.productName}</p>
                <p className="truncate text-caption text-fg-muted">
                  {r.id} · {refundMethodLabel[r.refund.method]} · {adminRelative(r.refund.at, ADMIN_TODAY)}
                </p>
              </div>
              <p className="text-body-strong figures">{formatPrice(r.refund.amount)}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
