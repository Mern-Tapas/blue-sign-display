"use client";

import { BadgeCheck, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DescriptionList } from "@/components/ui/description-list";
import { TextButton } from "@/components/ui/text-button";
import type { BankDetails } from "./change-bank-dialog";

export type BankAccountCardProps = {
  account: BankDetails;
  verified: boolean;
  onChange: () => void;
  className?: string;
};

/** The payout destination: masked account, IFSC and verification state, with a way to change it. */
export function BankAccountCard({ account, verified, onChange, className }: BankAccountCardProps) {
  return (
    <Card padding="md" className={className} id="bank-account" aria-labelledby="bank-account-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id="bank-account-title" className="text-title">
            Bank account
          </h2>
          <p className="mt-0.5 text-caption text-fg-muted">Where settlements are credited</p>
        </div>
        {verified ? (
          <Badge tone="success">
            <BadgeCheck aria-hidden />
            Verified
          </Badge>
        ) : (
          <Badge tone="warning">
            <Clock aria-hidden />
            Verification pending
          </Badge>
        )}
      </div>
      <DescriptionList
        dividers
        items={[
          { term: "Account holder", description: account.holder },
          { term: "Bank", description: account.bank },
          { term: "Account number", description: <span className="text-code"><span aria-hidden>•••• •••• </span><span className="sr-only">ending in </span>{account.last4}</span> },
          { term: "IFSC", description: <span className="text-code">{account.ifsc}</span> },
        ]}
      />
      <div className="flex items-center justify-between gap-3 border-t border-border-subtle pt-4">
        <p className="text-caption text-fg-muted">Changes need a ₹1 test deposit before payouts resume.</p>
        <TextButton onClick={onChange} aria-haspopup="dialog">
          Change
        </TextButton>
      </div>
    </Card>
  );
}
