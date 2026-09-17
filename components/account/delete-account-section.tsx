"use client";

import { useId, useState } from "react";
import { CircleAlert, Download, Trash2 } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { formatNumber } from "@/lib/format";

export type DeleteAccountSectionProps = {
  /** Orders not yet delivered, returned or refunded — deletion waits for them. */
  openOrders: number;
  points?: number;
  giftCardBalance?: string;
  onExportData?: () => void;
  onDelete: (reason: string) => Promise<void>;
  className?: string;
};

const reasons = ["I have another account", "I don’t shop here any more", "Privacy concerns", "Too many messages", "Other"];

/**
 * Danger zone. States exactly what is lost (orders history, points, gift card balance), blocks
 * deletion while orders are open, offers a data export first, and requires typing DELETE.
 */
export function DeleteAccountSection({ openOrders, points, giftCardBalance, onExportData, onDelete, className }: DeleteAccountSectionProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const blocked = openOrders > 0;

  return (
    <Card asChild variant="danger" className={className}>
      <section data-slot="delete-account" aria-labelledby={`${id}-title`}>
        <div className="flex flex-col gap-1">
          <h2 id={`${id}-title`} className="text-title text-danger-fg">
            Delete account
          </h2>
          <p className="text-body text-fg-muted">Permanently delete your BlueSigns account and personal data. This can’t be undone.</p>
        </div>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-body text-fg-muted">
          <li>Order history, invoices, addresses and saved payments are removed</li>
          {points ? <li className="figures">{formatNumber(points)} BlueSigns points are forfeited</li> : null}
          {giftCardBalance ? <li className="figures">Gift card balance of {giftCardBalance} can’t be recovered</li> : null}
          <li>Tax records we must keep by law are retained for the legal period only</li>
        </ul>
        {blocked && (
          <Alert size="sm" tone="warning" role="status" icon={<CircleAlert aria-hidden />}>
            You have {openOrders} open {openOrders === 1 ? "order" : "orders"}. You can delete your account once they’re delivered, returned or refunded.
          </Alert>
        )}
        <div className="flex flex-wrap gap-2">
          {onExportData && (
            <Button variant="secondary" leadingIcon={<Download aria-hidden />} onClick={onExportData}>
              Download my data
            </Button>
          )}
          <Dialog
            open={open}
            onOpenChange={(o) => {
              if (busy) return;
              setOpen(o);
              if (!o) {
                setReason("");
                setTyped("");
              }
            }}
          >
            <DialogTrigger asChild>
              <Button variant="danger" leadingIcon={<Trash2 aria-hidden />} disabled={blocked}>
                Delete account
              </Button>
            </DialogTrigger>
            <DialogContent size="sm">
              <form
                noValidate
                className="flex flex-col"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (typed !== "DELETE" || !reason) return;
                  setBusy(true);
                  try {
                    await onDelete(reason);
                    setOpen(false);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <DialogHeader icon={<Trash2 />} title="Delete your account?" description="We’re sorry to see you go. Tell us why, then confirm." />
                <DialogBody className="flex flex-col gap-4">
                  <RadioGroup aria-label="Reason for deleting" value={reason} onValueChange={setReason}>
                    {reasons.map((r) => (
                      <Radio key={r} value={r} label={r} />
                    ))}
                  </RadioGroup>
                  <Field id={`${id}-confirm`} label="Type DELETE to confirm">
                    <Input value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" autoCapitalize="characters" spellCheck={false} />
                  </Field>
                </DialogBody>
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={busy}>
                    Keep my account
                  </Button>
                  <Button type="submit" variant="danger" loading={busy} disabled={typed !== "DELETE" || !reason}>
                    Delete permanently
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </Card>
  );
}
