"use client";

import { useId, useRef, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordStrengthMeter } from "@/components/ui/password-strength-meter";
import { TextButton } from "@/components/ui/text-button";
import { cn } from "@/lib/cn";
import { focusFirstInvalid, validateNewPassword } from "@/lib/validation";

export type ChangePasswordFormProps = {
  /** Resolve ok, or return a field error (e.g. wrong current password). */
  onSubmit: (input: { current: string; next: string; signOutOthers: boolean }) => Promise<{ ok: true } | { ok: false; field?: "current" | "next"; error: string }>;
  onForgotPassword?: () => void;
  /** Accounts created with OTP or Google have no password yet. */
  hasPassword?: boolean;
  className?: string;
};

/** Change (or set) a password: current password unless none exists, new + confirm with strength, and sign out elsewhere. */
export function ChangePasswordForm({ onSubmit, onForgotPassword, hasPassword = true, className }: ChangePasswordFormProps) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [signOut, setSignOut] = useState(true);
  const [errors, setErrors] = useState<{ current?: string; next?: string; confirm?: string }>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <form
      ref={formRef}
      noValidate
      data-slot="change-password-form"
      className={cn("flex max-w-md flex-col gap-4", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        setDone(false);
        const errs = {
          current: hasPassword && !current ? "Enter your current password" : undefined,
          next: validateNewPassword(next) ?? (hasPassword && next === current ? "Choose a password you haven’t used here" : undefined),
          confirm: confirm !== next ? "Passwords don’t match" : undefined,
        };
        setErrors(errs);
        if (errs.current || errs.next || errs.confirm) return focusFirstInvalid(formRef.current);
        setBusy(true);
        const r = await onSubmit({ current, next, signOutOthers: signOut });
        setBusy(false);
        if (r.ok) {
          setDone(true);
          setCurrent("");
          setNext("");
          setConfirm("");
        } else {
          setErrors({ [r.field ?? "current"]: r.error });
          focusFirstInvalid(formRef.current);
        }
      }}
    >
      {done && <Alert tone="success" title="Password updated">{signOut ? "Other devices have been signed out." : "You’re still signed in on your other devices."}</Alert>}
      {hasPassword && (
        <Field
          id={`${id}-current`}
          label="Current password"
          error={errors.current}
          labelAction={
            onForgotPassword && (
              <TextButton onClick={onForgotPassword}>Forgot?</TextButton>
            )
          }
        >
          <PasswordInput autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </Field>
      )}
      <Field id={`${id}-next`} label={hasPassword ? "New password" : "Create a password"} error={errors.next}>
        <PasswordInput autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
      </Field>
      {next && <PasswordStrengthMeter password={next} className="-mt-1" />}
      <Field id={`${id}-confirm`} label="Confirm new password" error={errors.confirm}>
        <PasswordInput autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </Field>
      <Checkbox label="Sign out of all other devices" checked={signOut} onCheckedChange={(v) => setSignOut(v === true)} />
      <Button type="submit" loading={busy} className="self-start">
        {hasPassword ? "Update password" : "Set password"}
      </Button>
    </form>
  );
}
