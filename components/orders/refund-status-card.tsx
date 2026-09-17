import { Banknote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { IconTile } from "@/components/ui/icon-tile";
import { Steps } from "@/components/ui/steps";
import { formatDate, formatPrice } from "@/lib/format";
import type { Refund } from "@/lib/data/types";

export type RefundStatusCardProps = { refund: Refund; className?: string };

const order = { initiated: 0, processing: 1, credited: 3 } as const;

/** Refund progress: amount and destination, Initiated → Processing → Credited, expected date and the bank reference once issued. Server-safe. */
export function RefundStatusCard({ refund: r, className }: RefundStatusCardProps) {
  return (
    <Card asChild className={className}>
      <section data-slot="refund-status" aria-label="Refund status">
        <div className="flex items-start gap-3">
          <IconTile size="md" tone={r.status === "credited" ? "success" : "warning"}>
            <Banknote />
          </IconTile>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h3 className="text-title">{r.status === "credited" ? "Refund credited" : "Refund in progress"}</h3>
            <p className="text-body text-fg-muted">
              <span className="font-medium text-fg figures">{formatPrice(r.amount)}</span> to {r.destination}
            </p>
          </div>
        </div>
        <Steps
          size="sm"
          aria-label="Refund progress"
          current={order[r.status]}
          steps={[
            { id: "initiated", label: "Initiated", meta: formatDate(r.initiatedOn, { day: "numeric", month: "short" }) },
            { id: "processing", label: "With your bank" },
            { id: "credited", label: "Credited", meta: r.creditedOn ? formatDate(r.creditedOn, { day: "numeric", month: "short" }) : `By ${formatDate(r.expectedBy, { day: "numeric", month: "short" })}` },
          ]}
        />
        {r.reference ? (
          <p className="flex flex-wrap items-center gap-1 text-caption text-fg-muted">
            Bank reference <span className="text-code text-fg">{r.reference}</span>
            <CopyButton value={r.reference} label="Copy bank reference" size="xs" />
            <span className="basis-full">Share this reference with your bank if the amount isn’t visible.</span>
          </p>
        ) : (
          <p className="text-caption text-fg-muted">
            Banks can take up to 7 working days to show the credit. We’ll share the bank reference once it’s issued.
          </p>
        )}
      </section>
    </Card>
  );
}
