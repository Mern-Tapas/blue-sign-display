import { ShareBar } from "@/components/charts/small-charts";
import { CopyButton } from "@/components/ui/copy-button";
import { DescriptionList } from "@/components/ui/description-list";
import { Inset } from "@/components/ui/inset";
import { adminDate } from "@/lib/admin-format";
import type { Settlement } from "@/lib/data/admin";
import { formatNumber, formatPrice } from "@/lib/format";
import { StatusPill } from "../admin-display";
import { settlementDeductions, settlementStatusMeta } from "./finance-data";

const minus = (v: number) => `−${formatPrice(v)}`;

/** Gross → net for one settlement cycle, the shape of its deductions, and its bank reference. */
export function SettlementBreakdown({ settlement: s }: { settlement: Settlement }) {
  const meta = settlementStatusMeta[s.status];
  const deductions = [
    { id: "gateway", label: "Gateway fees", value: s.gatewayFees, slot: 0 },
    { id: "shipping", label: "Shipping charges", value: s.shippingCharges, slot: 1 },
    { id: "refunds", label: "Refunds", value: s.refunds, slot: 2 },
    { id: "tcs", label: "TCS", value: s.tcs, slot: 3 },
    { id: "tds", label: "TDS", value: s.tds, slot: 4 },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill tone={meta.tone} label={meta.label} live={meta.live} />
        <span className="text-caption text-fg-muted figures">{formatNumber(s.orders)} orders</span>
      </div>

      <section aria-labelledby={`${s.id}-calc`} className="flex flex-col gap-3">
        <h3 id={`${s.id}-calc`} className="text-body-strong">
          Gross to net
        </h3>
        <DescriptionList
          dividers
          items={[
            { term: "Gross sales", description: formatPrice(s.gross) },
            { term: "Gateway fees (1.8%)", description: minus(s.gatewayFees) },
            { term: "Shipping charges", description: minus(s.shippingCharges) },
            { term: "Refunds", description: minus(s.refunds) },
            { term: "TCS under GST (0.5%)", description: minus(s.tcs) },
            { term: "TDS under 194-O (0.1%)", description: minus(s.tds) },
            { term: "Net payout", description: formatPrice(s.net), emphasis: true },
          ]}
        />
      </section>

      <section aria-labelledby={`${s.id}-share`} className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 id={`${s.id}-share`} className="text-body-strong">
            Where the deductions went
          </h3>
          <span className="text-caption text-fg-muted figures">{minus(settlementDeductions(s))}</span>
        </div>
        <ShareBar label={`Deductions for ${s.id}`} segments={deductions} format="inr" className="[&_ul]:grid-cols-1" />
      </section>

      <Inset size="sm">
        <DescriptionList
          size="sm"
          items={[
            { term: "Cycle", description: `${adminDate(s.periodFrom)} – ${adminDate(s.periodTo)}` },
            { term: "Paid on", description: s.paidOn ? adminDate(s.paidOn) : "Not yet paid" },
            {
              term: "UTR",
              description: s.utr ? <span className="text-code">{s.utr}</span> : "Issued when the bank transfer completes",
              action: s.utr ? <CopyButton value={s.utr} label="Copy UTR" size="xs" className="self-center" /> : undefined,
            },
          ]}
        />
      </Inset>
    </>
  );
}
