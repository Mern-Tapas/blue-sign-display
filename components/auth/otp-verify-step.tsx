"use client";

import { useId, useState } from "react";
import { CircleCheck, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { OtpInput } from "@/components/ui/otp-input";
import { ResendTimer } from "@/components/ui/resend-timer";
import { TextButton } from "@/components/ui/text-button";
import { cn } from "@/lib/cn";
import { formatPhone } from "@/lib/format";
import type { AuthResult } from "./types";

export type OtpVerifyStepProps = {
  /** 10-digit mobile or an email address the code was sent to. */
  target: string;
  channel?: "sms" | "email";
  onVerify: (code: string) => Promise<AuthResult<"code">>;
  onResend: () => Promise<void>;
  /** "Change" next to the number — returns to the previous step. */
  onChangeTarget?: () => void;
  length?: number;
  resendSeconds?: number;
  /** Resends allowed before the action locks. */
  maxResends?: number;
  /** Shown after a successful verify while the parent redirects. */
  successText?: string;
  submitLabel?: string;
  /** Focus the code field on mount (default: the step usually appears after "Get OTP"). */
  autoFocus?: boolean;
  className?: string;
};

/**
 * Second OTP step. Auto-verifies when the last digit lands (no extra tap), keeps a Verify
 * button for assistive tech, shows wrong-code errors under the cells and clears them on
 * edit, and locks resends after `maxResends`.
 */
export function OtpVerifyStep({
  target,
  channel = "sms",
  onVerify,
  onResend,
  onChangeTarget,
  length = 6,
  resendSeconds = 30,
  maxResends = 3,
  successText = "Verified. Signing you in…",
  submitLabel = "Verify",
  autoFocus = true,
  className,
}: OtpVerifyStepProps) {
  const id = useId();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<"idle" | "verifying" | "success">("idle");
  const [resendsLeft, setResendsLeft] = useState(maxResends);

  const shownTarget = channel === "sms" ? formatPhone(target) : target;

  async function verify(value: string) {
    if (value.length !== length) {
      setError(`Enter all ${length} digits`);
      return;
    }
    setStatus("verifying");
    setError(undefined);
    const result = await onVerify(value);
    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("idle");
      setCode("");
      setError(result.fieldErrors?.code ?? result.error ?? "That code didn’t work. Try again.");
      // The field was disabled while verifying, which drops focus — put it back
      requestAnimationFrame(() => document.getElementById(`${id}-code`)?.focus());
    }
  }

  async function resend() {
    await onResend();
    setResendsLeft((n) => n - 1);
    setCode("");
    setError(undefined);
  }

  return (
    <form
      data-slot="otp-verify-step"
      noValidate
      aria-busy={status === "verifying" || undefined}
      onSubmit={(e) => {
        e.preventDefault();
        void verify(code);
      }}
      className={cn("flex flex-col gap-5", className)}
    >
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-body text-fg-muted">
        Code sent to <span className="font-medium text-fg figures">{shownTarget}</span>
        {onChangeTarget && (
          <TextButton onClick={onChangeTarget} disabled={status !== "idle"}>
            <Pencil aria-hidden />
            Change
          </TextButton>
        )}
      </p>

      <Field id={`${id}-code`} label={`Enter the ${length}-digit code`} error={error}>
        <OtpInput
          length={length}
          name="otp"
          autoFocus={autoFocus}
          value={code}
          status={status === "success" ? "success" : error ? "error" : "default"}
          disabled={status !== "idle"}
          onValueChange={(v) => {
            setCode(v);
            if (error) setError(undefined);
          }}
          onComplete={(v) => void verify(v)}
        />
      </Field>

      {status === "success" ? (
        <p role="status" className="flex items-center gap-2 text-body text-success-fg">
          <CircleCheck aria-hidden className="size-icon-lg" />
          {successText}
        </p>
      ) : (
        <>
          <Button type="submit" size="lg" fullWidth loading={status === "verifying"}>
            {submitLabel}
          </Button>
          <ResendTimer
            seconds={resendSeconds}
            onResend={resend}
            label={channel === "sms" ? "Resend OTP" : "Resend code"}
            attemptsLeft={resendsLeft}
            exhaustedText="You’ve reached the resend limit. Try again in 30 minutes or use another sign-in method."
            className="justify-center"
          />
        </>
      )}
    </form>
  );
}
