"use client";

import { useId, useRef, useState } from "react";
import { Mail } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { TextButton } from "@/components/ui/text-button";
import { cn } from "@/lib/cn";
import { focusFirstInvalid, validateEmail } from "@/lib/validation";
import type { AuthHandler } from "./types";

export type LoginValues = { email: string; password: string; remember: boolean };
type LoginField = "email" | "password";

export type LoginFormProps = {
  onSubmit: AuthHandler<LoginValues, LoginField>;
  defaultEmail?: string;
  /** "Forgot password?" on the password label row. */
  onForgotPassword?: () => void;
  /** Secondary route under the submit button, e.g. "Use mobile OTP instead". */
  onUseOtp?: () => void;
  submitLabel?: string;
  className?: string;
};

/**
 * Email + password sign-in. Validates on blur and submit, focuses the first invalid field,
 * shows server errors in an alert above the fields and keeps the email on failure.
 * Credential errors are deliberately generic ("email or password is incorrect").
 */
export function LoginForm({ onSubmit, defaultEmail = "", onForgotPassword, onUseOtp, submitLabel = "Sign in", className }: LoginFormProps) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<LoginField, string>>>({});
  const [formError, setFormError] = useState<string>();
  const [pending, setPending] = useState(false);

  function validate() {
    const next = { email: validateEmail(email), password: password ? undefined : "Enter your password" };
    setErrors(next);
    return !next.email && !next.password;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(undefined);
    if (!validate()) return focusFirstInvalid(formRef.current);
    setPending(true);
    const result = await onSubmit({ email: email.trim(), password, remember });
    setPending(false);
    if (!result.ok) {
      setFormError(result.error);
      if (result.fieldErrors) {
        setErrors(result.fieldErrors);
        focusFirstInvalid(formRef.current);
      }
      setPassword("");
    }
  }

  return (
    <form ref={formRef} data-slot="login-form" noValidate onSubmit={submit} aria-busy={pending || undefined} className={cn("flex flex-col gap-4", className)}>
      {formError && <Alert tone="danger">{formError}</Alert>}
      <Field id={`${id}-email`} label="Email" error={errors.email}>
        <Input
          type="email"
          name="email"
          autoComplete="username"
          inputMode="email"
          placeholder="you@example.com"
          size="lg"
          startSlot={<Mail aria-hidden />}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((er) => ({ ...er, email: undefined }));
          }}
          onBlur={() => email && setErrors((er) => ({ ...er, email: validateEmail(email) }))}
        />
      </Field>
      <Field
        id={`${id}-password`}
        label="Password"
        error={errors.password}
        labelAction={
          onForgotPassword && (
            <TextButton onClick={onForgotPassword}>Forgot password?</TextButton>
          )
        }
      >
        <PasswordInput
          name="password"
          size="lg"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((er) => ({ ...er, password: undefined }));
          }}
        />
      </Field>
      <Checkbox label="Keep me signed in on this device" checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
      <Button type="submit" size="lg" fullWidth loading={pending} className="mt-1">
        {submitLabel}
      </Button>
      {onUseOtp && (
        <Button type="button" variant="ghost" size="lg" fullWidth onClick={onUseOtp} disabled={pending}>
          Use mobile OTP instead
        </Button>
      )}
    </form>
  );
}
