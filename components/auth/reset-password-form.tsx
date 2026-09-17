"use client";

import { useId, useRef, useState } from "react";
import { CircleCheck } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { IconTile } from "@/components/ui/icon-tile";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordStrengthMeter } from "@/components/ui/password-strength-meter";
import { cn } from "@/lib/cn";
import { focusFirstInvalid, validateNewPassword } from "@/lib/validation";
import type { AuthHandler } from "./types";

export type ResetPasswordValues = { password: string; signOutEverywhere: boolean };

export type ResetPasswordFormProps = {
  onSubmit: AuthHandler<ResetPasswordValues, "password" | "confirm">;
  /** Success state action, e.g. go to sign in or continue shopping. */
  onDone?: () => void;
  doneLabel?: string;
  /** Account hint shown above the fields so password managers save to the right entry. */
  accountEmail?: string;
  className?: string;
};

/** Set a new password after a reset link or code: strength, confirmation match, optional sign-out of other devices. */
export function ResetPasswordForm({ onSubmit, onDone, doneLabel = "Continue to sign in", accountEmail, className }: ResetPasswordFormProps) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [signOut, setSignOut] = useState(true);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [formError, setFormError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(undefined);
    const next = {
      password: validateNewPassword(password),
      confirm: !confirm ? "Re-enter your new password" : confirm !== password ? "Passwords don’t match" : undefined,
    };
    setErrors(next);
    if (next.password || next.confirm) return focusFirstInvalid(formRef.current);
    setPending(true);
    const result = await onSubmit({ password, signOutEverywhere: signOut });
    setPending(false);
    if (result.ok) setDone(true);
    else {
      setFormError(result.error);
      if (result.fieldErrors) {
        setErrors(result.fieldErrors);
        focusFirstInvalid(formRef.current);
      }
    }
  }

  if (done) {
    return (
      <div role="status" data-slot="reset-password-done" className={cn("flex flex-col items-start gap-4", className)}>
        <IconTile size="lg" tone="success">
          <CircleCheck />
        </IconTile>
        <div className="flex flex-col gap-1">
          <p className="text-title">Password updated</p>
          <p className="text-body text-fg-muted">
            {signOut ? "You’ve been signed out on other devices. " : ""}Use your new password next time you sign in.
          </p>
        </div>
        {onDone && (
          <Button size="lg" fullWidth onClick={onDone}>
            {doneLabel}
          </Button>
        )}
      </div>
    );
  }

  return (
    <form ref={formRef} data-slot="reset-password-form" noValidate onSubmit={submit} aria-busy={pending || undefined} className={cn("flex flex-col gap-4", className)}>
      {formError && <Alert tone="danger">{formError}</Alert>}
      {accountEmail && (
        <>
          {/* Hidden username lets password managers update the right saved login */}
          <input type="email" name="username" autoComplete="username" value={accountEmail} readOnly hidden />
          <p className="text-body text-fg-muted">
            For <span className="font-medium text-fg">{accountEmail}</span>
          </p>
        </>
      )}
      <Field id={`${id}-password`} label="New password" error={errors.password} required>
        <PasswordInput
          autoComplete="new-password"
          size="lg"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((er) => ({ ...er, password: undefined }));
          }}
        />
      </Field>
      <PasswordStrengthMeter password={password} className="-mt-1" />
      <Field id={`${id}-confirm`} label="Confirm new password" error={errors.confirm} required>
        <PasswordInput
          autoComplete="new-password"
          size="lg"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            if (errors.confirm) setErrors((er) => ({ ...er, confirm: undefined }));
          }}
          onBlur={() => confirm && confirm !== password && setErrors((er) => ({ ...er, confirm: "Passwords don’t match" }))}
        />
      </Field>
      <Checkbox label="Sign out of all other devices" description="Recommended if you think someone else knows your password." checked={signOut} onCheckedChange={(v) => setSignOut(v === true)} />
      <Button type="submit" size="lg" fullWidth loading={pending} className="mt-1">
        Update password
      </Button>
    </form>
  );
}
