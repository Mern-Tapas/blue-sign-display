"use client";

import { useMemo, useRef, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { adminDateTime, adminRelative } from "@/lib/admin-format";
import { ADMIN_DEMO_NOTE, ADMIN_TODAY, adminReturns, returnReasons, salesTotals } from "@/lib/data/admin";
import { formatNumber, formatPrice } from "@/lib/format";
import { FilterBar, type FilterValues } from "../admin-parts";
import { KpiRow, KpiTile } from "../metrics";
import { PageHeader } from "../page-header";
import { downloadCsv } from "./download-csv";
import { returnStatusMeta, returnTabs, type ReturnTab } from "./order-helpers";
import { RefundLedger } from "./refund-ledger";
import { ReturnDetailPanel } from "./return-detail-panel";
import { ReturnReasonsChart } from "./return-reasons-chart";
import { refundMethodLabel, slotLabel, toReturnRecords, type ReturnLog, type ReturnRecord } from "./return-records";
import { ReturnsQueue } from "./returns-queue";
import { StatusTabs } from "./status-tabs";

const WEEK_AGO = new Date(ADMIN_TODAY.getFullYear(), ADMIN_TODAY.getMonth(), ADMIN_TODAY.getDate() - 6).toISOString();
/** Share of last-30-day orders that came back (demo: reason totals over orders). */
const RETURN_RATE = (returnReasons.reduce((s, r) => s + r.value, 0) / salesTotals(30).orders) * 100;

const REASONS: ReturnRecord["reason"][] = ["Size too small", "Size too large", "Quality not as expected", "Different from picture", "Damaged in transit", "Changed mind"];

const emptyCopy: Partial<Record<ReturnTab, { title: string; description: string }>> = {
  requested: { title: "No returns to review", description: "New requests from customers land here. Approve or reject within 48 hours to keep your seller rating." },
  approved: { title: "Nothing waiting for a pickup slot", description: "Approved returns wait here until you book a reverse pickup." },
  "pickup-scheduled": { title: "No pickups scheduled", description: "Returns with a booked reverse pickup show here until the item reaches your warehouse." },
  received: { title: "Nothing to refund", description: "Items that passed the quality check wait here for a refund." },
  refunded: { title: "No refunds yet", description: "Completed refunds are listed here." },
  rejected: { title: "No rejected returns", description: "Returns you reject, with their reasons, are kept here." },
};

export type ReturnsScreenProps = { initialTab: ReturnTab; initialReturnId?: string };

/** /admin/returns: KPIs, the review queue with a side panel for each request, and why items come back. */
export function ReturnsScreen({ initialTab, initialReturnId }: ReturnsScreenProps) {
  const [records, setRecords] = useState<ReturnRecord[]>(() => toReturnRecords(adminReturns));
  const [tab, setTab] = useState<ReturnTab>(initialTab);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [selectedId, setSelectedId] = useState<string | null>(() => (adminReturns.some((r) => r.id === initialReturnId) ? initialReturnId! : null));
  const actions = useRef(0);

  const base = useMemo(() => {
    const q = search.trim().toLowerCase();
    const reasons = filters.reason ?? [];
    const resolution = filters.resolution ?? [];
    return records.filter((r) => {
      if (reasons.length && !reasons.includes(r.reason)) return false;
      if (resolution.length && !resolution.includes(r.resolution)) return false;
      if (q && !`${r.id} ${r.orderId} ${r.customerName} ${r.productName}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [records, search, filters]);

  const counts = useMemo(
    () => Object.fromEntries(returnTabs.map((t) => [t.id, t.id === "all" ? base.length : base.filter((r) => r.status === t.id).length])) as Record<ReturnTab, number>,
    [base],
  );
  const rows = tab === "all" ? base : base.filter((r) => r.status === tab);
  const selected = records.find((r) => r.id === selectedId) ?? null;

  const toReview = records.filter((r) => r.status === "requested");
  const oldest = [...toReview].sort((a, b) => a.requestedAt.localeCompare(b.requestedAt))[0];
  const pickups = records.filter((r) => r.status === "pickup-scheduled").length;
  const weekRefunds = records.filter((r) => r.refund && r.refund.at >= WEEK_AGO);
  const weekRefundTotal = weekRefunds.reduce((s, r) => s + (r.refund?.amount ?? 0), 0);

  /** Updates one return and adds a line to its timeline, stamped on the demo clock. */
  const update = (id: string, log: Omit<ReturnLog, "id" | "at" | "actor">, change: Partial<ReturnRecord>) => {
    actions.current += 1;
    const at = new Date(ADMIN_TODAY.getTime() + 12 * 3600000 + actions.current * 7 * 60000).toISOString();
    const prev = records;
    setRecords((list) => list.map((r) => (r.id === id ? { ...r, ...change, ...(change.refund && { refund: { ...change.refund, at } }), log: [{ ...log, id: `local-${actions.current}`, actor: "You", at }, ...r.log] } : r)));
    return () => setRecords(prev);
  };

  const filterDefs = [
    { id: "reason", label: "Reason", options: REASONS.map((v) => ({ value: v, label: v, count: records.filter((x) => x.reason === v).length })) },
    { id: "resolution", label: "Resolution", options: [{ value: "refund", label: "Refund", count: records.filter((r) => r.resolution === "refund").length }, { value: "exchange", label: "Exchange", count: records.filter((r) => r.resolution === "exchange").length }] },
  ];
  const filtered = search.trim() !== "" || Object.values(filters).some((v) => v.length > 0);

  const exportCsv = () => {
    downloadCsv(
      "bluesigns-returns.csv",
      ["Return", "Order", "Customer", "Product", "Reason", "Resolution", "Amount (INR)", "Requested", "Status", "Photos"],
      rows.map((r) => [r.id, r.orderId, r.customerName, r.productName, r.reason, r.resolution, r.amount, adminDateTime(r.requestedAt), returnStatusMeta[r.status].label, r.photos]),
    );
    toast({ title: `Exported ${formatNumber(rows.length)} returns`, description: "CSV saved to your downloads.", tone: "success" });
  };

  const changeTab = (t: ReturnTab) => {
    setTab(t);
    const url = new URL(window.location.href);
    if (t === "all") url.searchParams.delete("status");
    else url.searchParams.set("status", t);
    window.history.replaceState(null, "", url);
  };

  const empty = filtered
    ? { title: "No returns match", description: "Try another search, or clear the filters.", action: <Button variant="secondary" size="sm" onClick={() => { setSearch(""); setFilters({}); }}>Clear filters</Button> }
    : (emptyCopy[tab] ?? { title: "No returns yet", description: "Return requests from delivered orders appear here." });

  return (
    <>
      <PageHeader
        title="Returns"
        meta={<span>{ADMIN_DEMO_NOTE}</span>}
        actions={
          <Button variant="secondary" leadingIcon={<Download aria-hidden />} onClick={exportCsv} disabled={rows.length === 0}>
            Export
          </Button>
        }
      />

      <KpiRow>
        <KpiTile label="Requests to review" value={formatNumber(toReview.length)} note={oldest ? `Oldest ${adminRelative(oldest.requestedAt, ADMIN_TODAY).replace(/^(Today|Yesterday)/, (m) => m.toLowerCase())}` : "All caught up"} />
        <KpiTile label="Pickups scheduled" value={formatNumber(pickups)} note="Reverse pickups booked" />
        <KpiTile label="Refunds this week" value={formatPrice(weekRefundTotal)} note={`${weekRefunds.length} ${weekRefunds.length === 1 ? "refund" : "refunds"}, last 7 days`} />
        <KpiTile label="Return rate" value={`${formatNumber(RETURN_RATE, { maximumFractionDigits: 1 })}%`} note="Of orders, last 30 days" />
      </KpiRow>

      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <StatusTabs label="Return status" tabs={returnTabs} value={tab} onValueChange={changeTab} counts={counts}>
            <ReturnsQueue
              key={tab}
              rows={rows}
              selectedId={selectedId}
              onOpen={setSelectedId}
              compact={!!selected}
              empty={empty}
              toolbar={<FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Search returns or customers" filters={filterDefs} values={filters} onValuesChange={setFilters} />}
            />
          </StatusTabs>
        </div>

        {selected && (
          <ReturnDetailPanel
            key={selected.id}
            record={selected}
            onClose={() => setSelectedId(null)}
            onApprove={() => {
              const undo = update(selected.id, { kind: "approved", action: "approved the return" }, { status: "approved" });
              toast({ title: `Return ${selected.id} approved`, description: "Next: pick a reverse pickup slot.", tone: "success", action: { label: "Undo", onClick: undo } });
            }}
            onReject={(reason) => {
              update(selected.id, { kind: "rejected", action: `rejected the return: ${reason.toLowerCase()}` }, { status: "rejected", rejectReason: reason });
              toast({ title: `Return ${selected.id} rejected`, description: `${selected.customerName} has been told why.`, tone: "neutral" });
            }}
            onSchedule={(slot) => {
              update(selected.id, { kind: "pickup", action: `booked a Delhivery reverse pickup for ${slotLabel(slot)}` }, { status: "pickup-scheduled", pickupSlot: slot });
              toast({ title: "Pickup scheduled", description: `${slotLabel(slot)}. The customer gets the slot by SMS.`, tone: "success" });
            }}
            onReceive={() => {
              const undo = update(selected.id, { kind: "received", action: "marked the item received after quality check" }, { status: "received" });
              toast({ title: `${selected.id} marked as received`, description: "Next: issue the refund.", tone: "success", action: { label: "Undo", onClick: undo } });
            }}
            onRefund={({ amount, method }) => {
              update(selected.id, { kind: "refunded", action: `issued a ${formatPrice(amount)} refund to ${refundMethodLabel[method].toLowerCase()}` }, { status: "refunded", refund: { amount, method, at: "" } });
              toast({ title: `${formatPrice(amount)} refund issued`, description: method === "source" ? "Reaches the customer in 5–7 working days." : "Store credit is available now.", tone: "success" });
            }}
          />
        )}
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <ReturnReasonsChart />
        <RefundLedger records={records} />
      </div>
    </>
  );
}
