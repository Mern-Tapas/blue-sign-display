"use client";

import { useId, useRef, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { PhoneInput } from "@/components/ui/phone-input";
import { cn } from "@/lib/cn";
import { focusFirstInvalid, validateMobile } from "@/lib/validation";
import type { AuthHandler } from "./types";

export type PhoneLoginValues = { mobile: string; whatsappUpdates: boolean };

export type PhoneLoginFormProps = {
  /** Sends the OTP. Resolve ok to move to OtpVerifyStep. */
  onSubmit: AuthHandler<PhoneLoginValues, "mobile">;
  defaultMobile?: string;
  onUseEmail?: () => void;
  /** Optional opt-in for order updates on WhatsApp (unchecked by default). */
  showWhatsappOptIn?: boolean;
  /** Terms line under the button. */
  legal?: React.ReactNode;
  submitLabel?: string;
  /** Focus the field on mount — only when this form is the page's main task. */
  autoFocus?: boolean;
  className?: string;
};

/** First step of OTP sign-in / sign-up: one mobile field, one button. Works for new and returning shoppers. */
export function PhoneLoginForm({
  onSubmit,
  defaultMobile = "",
  onUseEmail,
  showWhatsappOptIn = true,
  legal,
  submitLabel = "Get OTP",
  autoFocus = false,
  className,
}: PhoneLoginFormProps) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [mobile, setMobile] = useState(defaultMobile);
  const [whatsapp, setWhatsapp] = useState(false);
  const [error, setError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(undefined);
    const invalid = validateMobile(mobile);
    setError(invalid);
    if (invalid) return focusFirstInvalid(formRef.current);
    setPending(true);
    const result = await onSubmit({ mobile, whatsappUpdates: whatsapp });
    setPending(false);
    if (!result.ok) {
      setFormError(result.error);
      if (result.fieldErrors?.mobile) {
        setError(result.fieldErrors.mobile);
        focusFirstInvalid(formRef.current);
      }
    }
  }

  return (
    <form ref={formRef} data-slot="phone-login-form" noValidate onSubmit={submit} aria-busy={pending || undefined} className={cn("flex flex-col gap-4", className)}>
      {formError && <Alert tone="danger">{formError}</Alert>}
      <Field id={`${id}-mobile`} label="Mobile number" error={error} hint="We’ll send a 6-digit OTP by SMS.">
        <PhoneInput
          name="mobile"
          size="lg"
          value={mobile}
          onValueChange={(v) => {
            setMobile(v);
            if (error) setError(undefined);
          }}
          autoFocus={autoFocus}
        />
      </Field>
      {showWhatsappOptIn && (
        <Checkbox
          label="Send order updates on WhatsApp"
          description="Optional. You can turn this off any time in Settings."
          checked={whatsapp}
          onCheckedChange={(v) => setWhatsapp(v === true)}
        />
      )}
      <Button type="submit" size="lg" fullWidth loading={pending} className="mt-1">
        {submitLabel}
      </Button>
      {onUseEmail && (
        <Button type="button" variant="ghost" size="lg" fullWidth onClick={onUseEmail} disabled={pending}>
          Use email and password
        </Button>
      )}
      {legal && <p className="text-center text-caption text-fg-muted">{legal}</p>}
    </form>
  );
}
