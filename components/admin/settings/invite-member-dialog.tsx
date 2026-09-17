"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EMAIL_PATTERN, type Role } from "./settings-data";

const roleHints: Record<Exclude<Role, "Owner">, string> = {
  Admin: "Everything except payouts and staff changes",
  Operations: "Orders, returns and shipping",
  Catalog: "Products, inventory and coupons (view)",
  Support: "Customers, returns and order lookups",
  Finance: "Payouts, GST and reports",
};

export type InviteMemberDialogProps = {
  existingEmails: string[];
  onInvite: (member: { email: string; role: Exclude<Role, "Owner"> }) => void;
};

/** Invite a staff member by email with a role; the invite is a separate form so it never submits the settings page. */
export function InviteMemberDialog({ existingEmails, onInvite }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Exclude<Role, "Owner">>("Operations");
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);

  const error = !EMAIL_PATTERN.test(email)
    ? "Enter a work email like name@yourstore.in."
    : existingEmails.includes(email.toLowerCase())
      ? "This person is already on your team."
      : undefined;

  const reset = () => {
    setEmail("");
    setRole("Operations");
    setTouched(false);
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setTouched(true);
    if (error) {
      e.currentTarget.querySelector<HTMLInputElement>("input[name=invite-email]")?.focus();
      return;
    }
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      onInvite({ email: email.toLowerCase(), role });
      setOpen(false);
      reset();
    }, 800);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (sending) return;
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" leadingIcon={<UserPlus aria-hidden />}>
          Invite member
        </Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
          <DialogHeader icon={<UserPlus aria-hidden />} title="Invite a team member" description="They get an email link, valid for 7 days, and must set up two-factor authentication on first sign-in." />
          <DialogBody className="flex flex-col gap-4">
            <Field label="Work email" required error={touched ? error : undefined}>
              <Input name="invite-email" type="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value.trim())} onBlur={() => setTouched(true)} />
            </Field>
            <Field label="Role" hint={roleHints[role]}>
              <Select value={role} onValueChange={(v) => setRole(v as Exclude<Role, "Owner">)} options={Object.keys(roleHints).map((r) => ({ value: r, label: r }))} />
            </Field>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="secondary"
              disabled={sending}
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={sending}>
              Send invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
