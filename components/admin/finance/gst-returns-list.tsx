"use client";

import { Download } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { adminDate, adminDateShort } from "@/lib/admin-format";
import { formatNumber, formatPrice } from "@/lib/format";
import { StatusPill } from "../admin-display";
import { downloadCsv } from "./download-csv";
import { gstReturns, gstStatusMeta, type GstReturn } from "./finance-data";

export function gstReturnRows(list: GstReturn[]) {
  return [
    ["Return period", "Invoices", "Taxable value", "IGST", "CGST", "SGST", "Total tax", "Status", "Filed on", "Due"],
    ...list.map((g) => [g.month, g.invoices, g.taxable, g.igst, g.cgst, g.sgst, g.igst + g.cgst + g.sgst, gstStatusMeta[g.status].label, g.filedOn ?? "", g.due]),
  ];
}

function download(g: GstReturn) {
  const name = `bluesigns-gstr1-${g.id.slice(6)}.csv`;
  downloadCsv(name, [...gstReturnRows([g]), [], ["Demo data — not a filed return"]]);
  toast({ title: `GSTR-1 summary for ${g.month} downloaded`, description: name, tone: "success" });
}

/** Monthly GSTR-1 style outward-supply summaries, newest first, each downloadable once the period closes. */
export function GstReturnsList({ className }: { className?: string }) {
  return (
    <section aria-labelledby="gst-returns-title" className={className}>
      <div className="mb-3 flex flex-col gap-x-3 gap-y-0.5 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 id="gst-returns-title" className="text-title">
          GST invoices
        </h2>
        <p className="text-caption text-fg-muted">GSTR-1 summaries of your outward supplies</p>
      </div>
      <Card variant="outline" padding="none" className="overflow-hidden">
        <ul className="divide-y divide-border-subtle">
          {gstReturns.map((g) => {
            const meta = gstStatusMeta[g.status];
            const tax = g.igst + g.cgst + g.sgst;
            const open = g.status === "open";
            return (
              <li key={g.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 p-4">
                <div className="min-w-0 flex-1 basis-56">
                  <p className="text-body-strong">{g.month}</p>
                  <p className="text-caption text-fg-muted figures">
                    {formatNumber(g.invoices)} invoices · taxable {formatPrice(g.taxable)} · GST {formatPrice(tax)}
                  </p>
                </div>
                <div className="flex min-w-0 items-center gap-3">
                  <StatusPill tone={meta.tone} label={meta.label} />
                  <span className="w-28 text-caption text-fg-muted max-sm:w-auto">
                    {g.filedOn ? `Filed ${adminDateShort(g.filedOn)}` : `Closes ${adminDateShort(g.periodEnd)}`}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  leadingIcon={<Download aria-hidden />}
                  disabled={open}
                  onClick={() => download(g)}
                  aria-label={open ? `GSTR-1 for ${g.month} is available after ${adminDate(g.periodEnd)}` : `Download GSTR-1 summary for ${g.month}`}
                  className="max-sm:ml-auto"
                >
                  Download
                </Button>
              </li>
            );
          })}
        </ul>
      </Card>
    </section>
  );
}
