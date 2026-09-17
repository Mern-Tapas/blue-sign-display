import { adminDateShort } from "@/lib/admin-format";
import { formatPrice } from "@/lib/format";
import type { Settlement } from "@/lib/data/admin";
import { KpiRow, KpiTile } from "../metrics";
import { nextPayoutDate, payoutSummary } from "./finance-data";

/** Payout KPI row: what lands next, what landed, what it cost and the tax collected at source. */
export function PayoutSummary({ rows }: { rows: Settlement[] }) {
  const s = payoutSummary(rows);
  return (
    <KpiRow>
      <KpiTile
        label="Next payout"
        value={s.next ? formatPrice(s.next.net) : "—"}
        note={s.next ? `${s.next.id} · processing, expected ${adminDateShort(nextPayoutDate)}` : "No settlement in progress"}
      />
      <KpiTile label="Paid last 30 days" value={formatPrice(s.paid)} delta={{ value: s.paidDelta, period: "vs previous 30 days" }} note={`${s.paidCount} settlements`} />
      <KpiTile label="Fees & charges" value={formatPrice(s.gateway + s.shipping)} note={`Gateway ${formatPrice(s.gateway)} · shipping ${formatPrice(s.shipping)}`} />
      <KpiTile label="TCS collected" value={formatPrice(s.tcs)} note={`GST cash ledger credit · TDS ${formatPrice(s.tds)}`} />
    </KpiRow>
  );
}
