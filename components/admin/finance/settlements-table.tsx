"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { adminDate, adminDateShort } from "@/lib/admin-format";
import type { Settlement } from "@/lib/data/admin";
import { formatNumber, formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import { StatusPill } from "../admin-display";
import { DetailPanel } from "../admin-parts";
import { DataTable, type DataColumn } from "../data-table";
import { downloadCsv } from "./download-csv";
import { settlementFees, settlementStatusMeta, settlementTaxes } from "./finance-data";
import { SettlementBreakdown } from "./settlement-breakdown";

const period = (s: Settlement) => `${adminDateShort(s.periodFrom)} – ${adminDateShort(s.periodTo)}`;
const minus = (v: number) => `−${formatPrice(v)}`;

function downloadStatement(s: Settlement) {
  downloadCsv(`bluesigns-settlement-${s.id}.csv`, [
    ["Settlement", s.id],
    ["Cycle", `${adminDate(s.periodFrom)} – ${adminDate(s.periodTo)}`],
    ["Orders", s.orders],
    ["Gross sales", s.gross],
    ["Gateway fees", -s.gatewayFees],
    ["Shipping charges", -s.shippingCharges],
    ["Refunds", -s.refunds],
    ["TCS", -s.tcs],
    ["TDS", -s.tds],
    ["Net payout", s.net],
    ["Status", settlementStatusMeta[s.status].label],
    ["UTR", s.utr ?? ""],
    ["Note", "Demo data"],
  ]);
  toast({ title: "Statement downloaded", description: `bluesigns-settlement-${s.id}.csv`, tone: "success" });
}

/**
 * Settlement cycles with a master–detail panel. The settlement ID is a real button (keyboard), and a
 * click anywhere else on the row opens the same panel for pointer users.
 */
export function SettlementsTable({ rows }: { rows: Settlement[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = rows.find((r) => r.id === activeId) ?? null;

  const idCell = (s: Settlement) => (
    <button
      type="button"
      data-row-id={s.id}
      data-active={s.id === activeId || undefined}
      aria-expanded={s.id === activeId}
      aria-label={`${s.id}, ${period(s)}: view breakdown`}
      onClick={() => setActiveId(s.id)}
      className="rounded-xs text-body-strong text-fg underline-offset-4 hover:underline"
    >
      {s.id}
    </button>
  );

  const all: DataColumn<Settlement>[] = [
    { id: "id", header: "Settlement", cell: idCell, sortValue: (s) => s.id },
    { id: "period", header: "Cycle", cell: (s) => period(s), sortValue: (s) => s.periodTo },
    { id: "orders", header: "Orders", cell: (s) => formatNumber(s.orders), sortValue: (s) => s.orders, align: "end", hideBelow: "xl" },
    { id: "gross", header: "Gross", cell: (s) => formatPrice(s.gross), sortValue: (s) => s.gross, align: "end" },
    { id: "fees", header: "Fees", cell: (s) => minus(settlementFees(s)), sortValue: settlementFees, align: "end", hideBelow: "lg" },
    { id: "tax", header: "TCS/TDS", cell: (s) => minus(settlementTaxes(s)), sortValue: settlementTaxes, align: "end", hideBelow: "xl" },
    { id: "refunds", header: "Refunds", cell: (s) => minus(s.refunds), sortValue: (s) => s.refunds, align: "end", hideBelow: "xl" },
    { id: "net", header: "Net payout", cell: (s) => <span className="text-body-strong">{formatPrice(s.net)}</span>, sortValue: (s) => s.net, align: "end" },
    {
      id: "status",
      header: "Status",
      cell: (s) => <StatusPill tone={settlementStatusMeta[s.status].tone} label={settlementStatusMeta[s.status].label} live={settlementStatusMeta[s.status].live} />,
      sortValue: (s) => s.status,
    },
    {
      id: "utr",
      header: "UTR",
      cell: (s) =>
        s.utr ? (
          <span className="inline-flex items-center gap-1">
            <span className="text-code">{s.utr}</span>
            <CopyButton value={s.utr} label="Copy UTR" size="xs" />
          </span>
        ) : (
          <span className="text-fg-muted">Pending</span>
        ),
      hideBelow: "lg",
    },
  ];
  // With the panel open the list keeps only what identifies a row, so nothing scrolls sideways.
  const columns = active ? all.filter((c) => ["id", "period", "net", "status"].includes(c.id)) : all;

  const onRowClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, [role=checkbox]")) return;
    const id = target.closest("tr, li")?.querySelector<HTMLElement>("[data-row-id]")?.dataset.rowId;
    if (id) setActiveId(id);
  };

  return (
    <div className="flex items-start gap-4">
      {/* Pointer convenience only; keyboard users reach the same action through the ID button. */}
      <div
        onClick={onRowClick}
        className={cn(
          "min-w-0 flex-1 [&_tbody_tr]:cursor-pointer [&_ul>li]:cursor-pointer",
          "[&_tbody_tr:has([data-active])]:bg-selected [&_ul>li:has([data-active])]:bg-selected",
        )}
      >
        <DataTable
          caption="Settlements"
          columns={columns}
          rows={rows}
          getRowId={(s) => s.id}
          defaultSort={{ id: "period", direction: "desc" }}
          pageSize={8}
          toolbar={<p className="text-caption text-fg-muted">Weekly cycles, credited T+2 to your bank account. Select a row for the breakdown.</p>}
          empty={{ title: "No settlements yet", description: "Your first settlement is created seven days after your first delivered order." }}
          renderCard={(s) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {idCell(s)}
                  <p className="text-caption text-fg-muted">
                    {period(s)} · {formatNumber(s.orders)} orders
                  </p>
                </div>
                <span className="text-body-strong figures">{formatPrice(s.net)}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone={settlementStatusMeta[s.status].tone} label={settlementStatusMeta[s.status].label} live={settlementStatusMeta[s.status].live} />
                {s.utr && (
                  <span className="inline-flex items-center gap-1">
                    <span className="text-code text-fg-muted">{s.utr}</span>
                    <CopyButton value={s.utr} label="Copy UTR" size="xs" />
                  </span>
                )}
              </div>
            </div>
          )}
        />
      </div>

      <DetailPanel
        open={!!active}
        onOpenChange={(open) => !open && setActiveId(null)}
        title={active ? `Settlement ${active.id}` : "Settlement"}
        description={active ? `${adminDate(active.periodFrom)} – ${adminDate(active.periodTo)}` : undefined}
        footer={
          active && (
            <Button variant="secondary" leadingIcon={<Download aria-hidden />} onClick={() => downloadStatement(active)} className="flex-1">
              Download statement
            </Button>
          )
        }
      >
        {active && <SettlementBreakdown settlement={active} />}
      </DetailPanel>
    </div>
  );
}
