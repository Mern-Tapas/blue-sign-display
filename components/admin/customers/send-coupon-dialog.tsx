"use client";

import { useState } from "react";
import { BadgePercent } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { RadioCard, RadioCardGroup } from "@/components/ui/radio-card";
import { adminCoupons, type AdminCustomer } from "@/lib/data/admin";
import { formatNumber } from "@/lib/format";
import { shopperHeadline, validityRange } from "./coupon-rules";

export type SendCouponDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customers: Pick<AdminCustomer, "id" | "name" | "marketingOptIn">[];
  onSent?: () => void;
};

const activeCoupons = adminCoupons.filter((c) => c.status === "active");

/** Pick an active coupon and send it to the selected customers (demo: nothing is emailed). */
export function SendCouponDialog({ open, onOpenChange, customers, onSent }: SendCouponDialogProps) {
  const [code, setCode] = useState(activeCoupons[0]?.code ?? "");
  const optedOut = customers.filter((c) => !c.marketingOptIn).length;
  const who = customers.length === 1 ? customers[0]!.name : `${formatNumber(customers.length)} customers`;

  function send() {
    toast({
      title: `${code} sent to ${who}`,
      description: optedOut > 0 ? `${formatNumber(optedOut)} without marketing consent get it in their next order email. Demo: nothing was sent.` : "Demo: nothing was sent.",
      tone: "success",
    });
    onOpenChange(false);
    onSent?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader title="Send a coupon" description={`Choose an active coupon for ${who}. They get the code by email and WhatsApp.`} />
        <DialogBody className="flex flex-col gap-4">
          {activeCoupons.length === 0 ? (
            <Alert tone="info" title="No active coupons">
              Create or resume a coupon first, then come back to send it.
            </Alert>
          ) : (
            <RadioCardGroup value={code} onValueChange={setCode} aria-label="Coupon to send" className="gap-2">
              {activeCoupons.map((c) => (
                <RadioCard
                  key={c.code}
                  value={c.code}
                  size="sm"
                  align="start"
                  title={<span className="text-code">{c.code}</span>}
                  description={shopperHeadline(c)}
                >
                  <span className="text-caption text-fg-muted figures">Valid {validityRange(c)}</span>
                </RadioCard>
              ))}
            </RadioCardGroup>
          )}
          {optedOut > 0 && (
            <Alert tone="warning" size="sm">
              {optedOut === customers.length
                ? `${customers.length === 1 ? "This customer hasn’t" : "None of these customers have"} opted in to marketing.`
                : `${formatNumber(optedOut)} of ${formatNumber(customers.length)} haven’t opted in to marketing.`}{" "}
              Without consent, the code goes only in their next order email.
            </Alert>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={send} disabled={!code || activeCoupons.length === 0} leadingIcon={<BadgePercent aria-hidden />}>
            Send coupon
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
