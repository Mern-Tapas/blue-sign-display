"use client";

import { useId, useRef, useState } from "react";
import { ArrowLeft, AtSign, MailCheck } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { IconTile } from "@/components/ui/icon-tile";
import { Input } from "@/components/ui/input";
import { ResendTimer } from "@/components/ui/resend-timer";
import { cn } from "@/lib/cn";
import { formatPhone } from "@/lib/format";
import { focusFirstInvalid, parseIdentifier } from "@/lib/validation";
import type { AuthHandler } from "./types";

export type ForgotPasswordValues = { kind: "email" | "mobile"; value: string };

export type ForgotPasswordFormProps = {
  /** Sends a reset link (email) or code (mobile). Always resolve ok for unknown accounts to avoid revealing who has one. */
  onSubmit: AuthHandler<ForgotPasswordValues, "identifier">;
  onBackToSignIn?: () => void;
  /** Called from the sent state when a mobile code was sent (go to OTP entry). */
  onEnterCode?: (values: ForgotPasswordValues) => void;
  defaultIdentifier?: string;
  className?: string;
};

/**
 * Password recovery by email or mobile in one field. The confirmation never says whether an
 * account exists ("If an account exists…"), and offers resend and a way back.
 */
export function ForgotPasswordForm({ onSubmit, onBackToSignIn, onEnterCode, defaultIdentifier = "", className }: ForgotPasswordFormProps) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [identifier, setIdentifier] = useState(defaultIdentifier);
  const [error, setError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState<ForgotPasswordValues | null>(null);

  async function send(values: ForgotPasswordValues) {
    const result = await onSubmit(values);
    if (!result.ok) {
      setFormError(result.error);
      if (result.fieldErrors?.identifier) setError(result.fieldErrors.identifier);
      return false;
    }
    return true;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(undefined);
    const parsed = parseIdentifier(identifier);
    if (!parsed) {
      setError(identifier.trim() ? "Enter a valid email or 10-digit mobile number" : "Enter your email or mobile number");
      return focusFirstInvalid(formRef.current);
    }
    setPending(true);
    const ok = await send(parsed);
    setPending(false);
    if (ok) setSent(parsed);
  }

  if (sent) {
    const where = sent.kind === "email" ? sent.value : formatPhone(sent.value);
    return (
      <div data-slot="forgot-password-sent" className={cn("flex flex-col gap-5", className)}>
        <div role="status" className="flex flex-col items-start gap-3">
          <IconTile size="lg" tone="success">
            <MailCheck />
          </IconTile>
          <p className="text-body text-fg-muted">
            If an account exists for <span className="font-medium text-fg">{where}</span>, we’ve sent{" "}
            {sent.kind === "email" ? "a link to reset your password. It expires in 30 minutes." : "a 6-digit code to reset your password."}
          </p>
        </div>
        {sent.kind === "mobile" && onEnterCode && (
          <Button size="lg" fullWidth onClick={() => onEnterCode(sent)}>
            Enter code
          </Button>
        )}
        {sent.kind === "email" && <p className="text-caption text-fg-muted">Can’t find it? Check your spam or promotions folder.</p>}
        <ResendTimer seconds={30} label={sent.kind === "email" ? "Resend link" : "Resend code"} onResend={async () => void (await send(sent))} />
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setSent(null)}>
            Use a different {sent.kind === "email" ? "email" : "number"}
          </Button>
          {onBackToSignIn && (
            <Button variant="ghost" leadingIcon={<ArrowLeft aria-hidden />} onClick={onBackToSignIn}>
              Back to sign in
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} data-slot="forgot-password-form" noValidate onSubmit={submit} aria-busy={pending || undefined} className={cn("flex flex-col gap-4", className)}>
      {formError && <Alert tone="danger">{formError}</Alert>}
      <Field id={`${id}-identifier`} label="Email or mobile number" error={error} hint="We’ll send a reset link to your email or a code to your mobile.">
        <Input
          name="username"
          autoComplete="username"
          size="lg"
          placeholder="you@example.com or 98765 43210"
          startSlot={<AtSign aria-hidden />}
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            if (error) setError(undefined);
          }}
        />
      </Field>
      <Button type="submit" size="lg" fullWidth loading={pending} className="mt-1">
        Send reset instructions
      </Button>
      {onBackToSignIn && (
        <Button type="button" variant="ghost" size="lg" fullWidth leadingIcon={<ArrowLeft aria-hidden />} onClick={onBackToSignIn} disabled={pending}>
          Back to sign in
        </Button>
      )}
    </form>
  );
}
