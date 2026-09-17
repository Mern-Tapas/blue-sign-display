"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { adminDateShort } from "@/lib/admin-format";
import { ADMIN_DEMO_NOTE, settlements, type Settlement } from "@/lib/data/admin";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "../page-header";
import { BankAccountCard } from "./bank-account-card";
import { ChangeBankDialog, type BankDetails } from "./change-bank-dialog";
import { downloadCsv } from "./download-csv";
import { gstReturns } from "./finance-data";
import { GstReturnsList, gstReturnRows } from "./gst-returns-list";
import { PayoutSummary } from "./payout-summary";
import { SettlementsTable } from "./settlements-table";

const initialBank: BankDetails = { holder: "BlueSigns Retail Pvt Ltd", bank: "HDFC Bank", last4: "7781", ifsc: "HDFC0001234" };

/** Payouts & GST: what the store is owed, why anything is held, every settlement cycle and the tax paperwork. */
export function PayoutsScreen() {
  const [rows, setRows] = useState<Settlement[]>(settlements);
  const [bank, setBank] = useState(initialBank);
  const [verified, setVerified] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const held = rows.find((s) => s.status === "on-hold");

  const release = () => {
    if (!held) return;
    setConfirming(true);
    window.setTimeout(() => {
      const before = rows;
      setRows((list) => list.map((s) => (s.id === held.id ? { ...s, status: "processing" as const } : s)));
      setVerified(true);
      setConfirming(false);
      toast({
        title: "Bank account verified",
        description: `${held.id} (${formatPrice(held.net)}) is released and will be credited with the next payout.`,
        tone: "success",
        action: {
          label: "Undo",
          onClick: () => {
            setRows(before);
            setVerified(false);
          },
        },
      });
    }, 900);
  };

  return (
    <>
      <PageHeader
        title="Payouts & GST"
        meta={
          <>
            <span>Settled by Razorpay · weekly cycles</span>
            <span aria-hidden>·</span>
            <span>{ADMIN_DEMO_NOTE}</span>
          </>
        }
        actions={
          <Button
            variant="secondary"
            leadingIcon={<Download aria-hidden />}
            onClick={() => {
              downloadCsv("bluesigns-gst-report.csv", [...gstReturnRows(gstReturns), [], ["Demo data — not a filed return"]]);
              toast({ title: "GST report downloaded", description: "GSTR-1 summaries for the last 5 months", tone: "success" });
            }}
          >
            Download GST report
          </Button>
        }
      />

      <PayoutSummary rows={rows} />

      {held && (
        <Alert
          tone="warning"
          title={`${formatPrice(held.net)} from ${held.id} is on hold`}
        >
          <p className="max-w-[72ch]">
            Reason: bank account verification pending. The {adminDateShort(held.periodFrom)} – {adminDateShort(held.periodTo)} cycle is held until you confirm the ₹1 test
            deposit in your {bank.bank} account ending {bank.last4}. It is paid with the next payout once confirmed.
          </p>
          <Button variant="secondary" size="sm" loading={confirming} onClick={release} className="mt-3">
            Confirm ₹1 deposit
          </Button>
        </Alert>
      )}

      <section aria-labelledby="settlements-title" className="flex flex-col gap-3">
        <h2 id="settlements-title" className="text-title">
          Settlements
        </h2>
        <SettlementsTable rows={rows} />
      </section>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <GstReturnsList />
        <BankAccountCard account={bank} verified={verified} onChange={() => setBankOpen(true)} className="xl:mt-9" />
      </div>

      <ChangeBankDialog
        open={bankOpen}
        onOpenChange={setBankOpen}
        current={bank}
        onSave={(next) => {
          const prev = { bank, verified };
          setBank(next);
          setVerified(false);
          setBankOpen(false);
          toast({
            title: "Payout account updated",
            description: `${next.bank} ending ${next.last4}. We’ve sent a ₹1 test deposit to verify it.`,
            tone: "success",
            action: {
              label: "Undo",
              onClick: () => {
                setBank(prev.bank);
                setVerified(prev.verified);
              },
            },
          });
        }}
      />
    </>
  );
}
