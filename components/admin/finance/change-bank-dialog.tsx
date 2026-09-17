"use client";

import { useState } from "react";
import { Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { IFSC_PATTERN } from "./finance-data";

export type BankDetails = { holder: string; bank: string; last4: string; ifsc: string };

type Draft = { holder: string; account: string; confirm: string; ifsc: string };
type Errors = Partial<Record<keyof Draft, string>>;

function validate(d: Draft): Errors {
  const e: Errors = {};
  if (d.holder.trim().length < 3) e.holder = "Enter the name exactly as it appears on the bank account.";
  if (!/^\d{9,18}$/.test(d.account)) e.account = "Account numbers are 9 to 18 digits, with no spaces.";
  if (d.confirm !== d.account) e.confirm = "The account numbers don’t match.";
  if (d.ifsc.length !== 11) e.ifsc = `IFSC codes have 11 characters (${d.ifsc.length} entered).`;
  else if (!IFSC_PATTERN.test(d.ifsc)) e.ifsc = "Check the IFSC: 4 letters, then 0, then 6 letters or digits (e.g. HDFC0001234).";
  return e;
}

const bankFromIfsc: Record<string, string> = { HDFC: "HDFC Bank", ICIC: "ICICI Bank", SBIN: "State Bank of India", UTIB: "Axis Bank", KKBK: "Kotak Mahindra Bank", YESB: "Yes Bank", PUNB: "Punjab National Bank" };

export type ChangeBankDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current: BankDetails;
  onSave: (next: BankDetails) => void;
};

/** Change the payout bank account. Validates as you finish each field; saving starts a ₹1 verification deposit. */
export function ChangeBankDialog({ open, onOpenChange, current, onSave }: ChangeBankDialogProps) {
  const empty: Draft = { holder: current.holder, account: "", confirm: "", ifsc: "" };
  const [draft, setDraft] = useState<Draft>(empty);
  const [touched, setTouched] = useState<Partial<Record<keyof Draft, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const errors = validate(draft);
  const shown = (k: keyof Draft) => (touched[k] ? errors[k] : undefined);
  const bank = bankFromIfsc[draft.ifsc.slice(0, 4)];

  const set = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const value = k === "ifsc" ? raw.toUpperCase().replace(/\s/g, "").slice(0, 11) : k === "holder" ? raw : raw.replace(/\D/g, "").slice(0, 18);
    setDraft((d) => ({ ...d, [k]: value }));
  };
  const blur = (k: keyof Draft) => () => setTouched((t) => ({ ...t, [k]: true }));

  const close = (next: boolean) => {
    if (saving) return;
    onOpenChange(next);
    if (!next) {
      setDraft(empty);
      setTouched({});
    }
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setTouched({ holder: true, account: true, confirm: true, ifsc: true });
    const first = (Object.keys(errors) as (keyof Draft)[])[0];
    if (first) {
      e.currentTarget.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      onSave({ holder: draft.holder.trim(), bank: bank ?? "Bank account", last4: draft.account.slice(-4), ifsc: draft.ifsc });
      setDraft(empty);
      setTouched({});
    }, 900);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent size="md">
        <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
          <DialogHeader
            icon={<Landmark aria-hidden />}
            title="Change payout account"
            description="Payouts pause until we confirm a ₹1 test deposit to the new account, usually within 4 working hours."
          />
          <DialogBody className="flex flex-col gap-4">
            <Field label="Account holder name" required error={shown("holder")}>
              <Input name="holder" autoComplete="name" value={draft.holder} onChange={set("holder")} onBlur={blur("holder")} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Account number" required error={shown("account")}>
                <Input name="account" inputMode="numeric" autoComplete="off" value={draft.account} onChange={set("account")} onBlur={blur("account")} className="figures" />
              </Field>
              <Field label="Confirm account number" required error={shown("confirm")}>
                <Input name="confirm" inputMode="numeric" autoComplete="off" value={draft.confirm} onChange={set("confirm")} onBlur={blur("confirm")} className="figures" />
              </Field>
            </div>
            <Field
              label="IFSC"
              required
              error={shown("ifsc")}
              hint={bank && IFSC_PATTERN.test(draft.ifsc) ? `${bank} branch code` : "11 characters, printed on your cheque book (e.g. HDFC0001234)"}
            >
              <Input
                name="ifsc"
                value={draft.ifsc}
                onChange={set("ifsc")}
                onBlur={blur("ifsc")}
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={11}
                className="text-code"
                endSlot={<span className="text-caption text-fg-muted figures">{draft.ifsc.length}/11</span>}
              />
            </Field>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={() => close(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save and verify
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
