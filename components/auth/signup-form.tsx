"use client";

import { useId, useRef, useState } from "react";
import { Mail, User } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordStrengthMeter } from "@/components/ui/password-strength-meter";
import { PhoneInput } from "@/components/ui/phone-input";
import { cn } from "@/lib/cn";
import { focusFirstInvalid, validateEmail, validateMobile, validateName, validateNewPassword } from "@/lib/validation";
import type { AuthHandler } from "./types";

export type SignupValues = { name: string; email: string; mobile: string; password: string; offers: boolean };
type SignupField = "name" | "email" | "mobile" | "password" | "terms";

export type SignupFormProps = {
  onSubmit: AuthHandler<SignupValues, SignupField>;
  /** Terms / privacy links rendered inside the consent checkbox label. */
  termsLabel?: React.ReactNode;
  submitLabel?: string;
  className?: string;
};

/**
 * Account creation: name, email, mobile (+91), password with live strength, explicit terms
 * consent and an unticked marketing opt-in (DPDP-style: consent is never pre-selected).
 */
export function SignupForm({
  onSubmit,
  termsLabel = "I agree to the Terms of Use and Privacy Policy",
  submitLabel = "Create account",
  className,
}: SignupFormProps) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState({ name: "", email: "", mobile: "", password: "" });
  const [terms, setTerms] = useState(false);
  const [offers, setOffers] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<SignupField, string>>>({});
  const [formError, setFormError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const validators: Record<Exclude<SignupField, "terms">, (v: string) => string | undefined> = {
    name: validateName,
    email: validateEmail,
    mobile: validateMobile,
    password: validateNewPassword,
  };

  function set<K extends keyof typeof values>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  }

  function blur(key: keyof typeof values) {
    if (values[key]) setErrors((er) => ({ ...er, [key]: validators[key](values[key]) }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(undefined);
    const next: Partial<Record<SignupField, string>> = {
      name: validateName(values.name),
      email: validateEmail(values.email),
      mobile: validateMobile(values.mobile),
      password: validateNewPassword(values.password),
      terms: terms ? undefined : "Accept the terms to create an account",
    };
    setErrors(next);
    setPasswordTouched(true);
    if (Object.values(next).some(Boolean)) return focusFirstInvalid(formRef.current);
    setPending(true);
    const result = await onSubmit({ ...values, name: values.name.trim(), email: values.email.trim(), offers });
    setPending(false);
    if (!result.ok) {
      setFormError(result.error);
      if (result.fieldErrors) {
        setErrors(result.fieldErrors);
        focusFirstInvalid(formRef.current);
      }
    }
  }

  return (
    <form ref={formRef} data-slot="signup-form" noValidate onSubmit={submit} aria-busy={pending || undefined} className={cn("flex flex-col gap-4", className)}>
      {formError && <Alert tone="danger">{formError}</Alert>}
      <Field id={`${id}-name`} label="Full name" error={errors.name} required>
        <Input
          name="name"
          autoComplete="name"
          size="lg"
          placeholder="As on your ID"
          startSlot={<User aria-hidden />}
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          onBlur={() => blur("name")}
        />
      </Field>
      <Field id={`${id}-email`} label="Email" error={errors.email} hint="For order receipts and invoices." required>
        <Input
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          size="lg"
          placeholder="you@example.com"
          startSlot={<Mail aria-hidden />}
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          onBlur={() => blur("email")}
        />
      </Field>
      <Field id={`${id}-mobile`} label="Mobile number" error={errors.mobile} hint="We’ll verify it with an OTP." required>
        <PhoneInput name="mobile" size="lg" value={values.mobile} onValueChange={(v) => set("mobile", v)} onBlur={() => blur("mobile")} />
      </Field>
      <Field id={`${id}-password`} label="Password" error={errors.password} required>
        <PasswordInput
          name="new-password"
          autoComplete="new-password"
          size="lg"
          placeholder="Create a password"
          value={values.password}
          onChange={(e) => {
            set("password", e.target.value);
            setPasswordTouched(true);
          }}
          onBlur={() => blur("password")}
        />
      </Field>
      {passwordTouched && <PasswordStrengthMeter password={values.password} className="-mt-1" />}
      <div className="flex flex-col gap-3 pt-1">
        <div className="flex flex-col gap-1.5">
          <Checkbox
            label={termsLabel}
            checked={terms}
            aria-invalid={errors.terms ? true : undefined}
            aria-describedby={errors.terms ? `${id}-terms-error` : undefined}
            onCheckedChange={(v) => {
              setTerms(v === true);
              if (v === true) setErrors((er) => ({ ...er, terms: undefined }));
            }}
          />
          {errors.terms && (
            <p id={`${id}-terms-error`} className="pl-8 text-caption text-danger-fg">
              {errors.terms}
            </p>
          )}
        </div>
        <Checkbox label="Send me offers and new arrivals" description="Optional · email and SMS, unsubscribe any time" checked={offers} onCheckedChange={(v) => setOffers(v === true)} />
      </div>
      <Button type="submit" size="lg" fullWidth loading={pending} className="mt-1">
        {submitLabel}
      </Button>
    </form>
  );
}
