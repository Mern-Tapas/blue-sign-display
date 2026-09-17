"use client";

import { useId, useState } from "react";
import { BadgeCheck, Mail, User } from "lucide-react";
import { OtpVerifyStep } from "@/components/auth/otp-verify-step";
import { Button } from "@/components/ui/button";
import { ChipGroup } from "@/components/ui/chip";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogBody, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { TextButton } from "@/components/ui/text-button";
import { cn } from "@/lib/cn";
import { formatPhone } from "@/lib/format";
import { validateEmail, validateMobile, validateName } from "@/lib/validation";

export type ProfileValues = {
  name: string;
  email: string;
  mobile: string;
  alternateMobile: string;
  gender: "female" | "male" | "other" | "undisclosed";
  dateOfBirth: string | null;
};

export type EditProfileFormProps = {
  defaultValue: ProfileValues;
  emailVerified?: boolean;
  onSave: (values: ProfileValues) => Promise<void>;
  /** Sends an OTP to the new mobile number. */
  onSendMobileOtp: (mobile: string) => Promise<void>;
  /** Verifies the OTP for the new number. */
  onVerifyMobileOtp: (mobile: string, code: string) => Promise<boolean>;
  onVerifyEmail?: () => void;
  className?: string;
};

const toIso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * Profile details. Changing the mobile number requires an OTP to the new number before it
 * sticks; email shows verification state; Save stays disabled until something changes, and
 * gender and birthday are optional with a clear reason for asking.
 */
export function EditProfileForm({ defaultValue, emailVerified, onSave, onSendMobileOtp, onVerifyMobileOtp, onVerifyEmail, className }: EditProfileFormProps) {
  const id = useId();
  const [saved, setSaved] = useState(defaultValue);
  const [values, setValues] = useState(defaultValue);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileValues, string>>>({});
  const [busy, setBusy] = useState(false);
  const [mobileDraft, setMobileDraft] = useState<string | null>(null);
  const [otpFor, setOtpFor] = useState<string | null>(null);

  const dirty = JSON.stringify(values) !== JSON.stringify(saved);
  const set = <K extends keyof ProfileValues>(k: K, v: ProfileValues[K]) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  return (
    <>
      <form
        noValidate
        data-slot="edit-profile-form"
        className={cn("grid gap-5 sm:grid-cols-2", className)}
        onSubmit={async (e) => {
          e.preventDefault();
          const next = {
            name: validateName(values.name),
            email: validateEmail(values.email),
            alternateMobile: values.alternateMobile && validateMobile(values.alternateMobile) ? "Enter a valid 10-digit number or leave it empty" : undefined,
          };
          setErrors(next);
          const first = (Object.keys(next) as (keyof typeof next)[]).find((k) => next[k]);
          if (first) return requestAnimationFrame(() => document.getElementById(`${id}-${first}`)?.focus());
          setBusy(true);
          try {
            await onSave(values);
            setSaved(values);
          } finally {
            setBusy(false);
          }
        }}
      >
        <Field id={`${id}-name`} label="Full name" error={errors.name} required>
          <Input autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} startSlot={<User aria-hidden />} />
        </Field>
        <Field
          id={`${id}-email`}
          label="Email"
          error={errors.email}
          hint={
            values.email === saved.email
              ? emailVerified
                ? "Verified"
                : "Not verified — invoices and resets go here"
              : "We’ll send a link to verify the new address"
          }
          labelAction={
            values.email === saved.email && !emailVerified && onVerifyEmail ? (
              <TextButton onClick={onVerifyEmail}>Verify</TextButton>
            ) : values.email === saved.email && emailVerified ? (
              <BadgeCheck aria-label="Verified" className="size-icon-md text-success-fg" />
            ) : undefined
          }
          required
        >
          <Input type="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} startSlot={<Mail aria-hidden />} />
        </Field>

        <Field label="Mobile number" hint="Used to sign in and for delivery updates">
          <div className="flex h-control-md items-center justify-between gap-3 rounded-pill border border-border bg-surface-sunken pr-1.5 pl-4">
            <span className="text-body figures">{formatPhone(values.mobile)}</span>
            <Button type="button" size="sm" variant="secondary" onClick={() => setMobileDraft("")}>
              Change
            </Button>
          </div>
        </Field>
        <Field id={`${id}-alternateMobile`} label="Alternate mobile" error={errors.alternateMobile} hint="Optional · for the delivery partner">
          <PhoneInput value={values.alternateMobile} onValueChange={(v) => set("alternateMobile", v)} autoComplete="off" />
        </Field>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-label">
            Gender <span className="font-normal text-fg-muted">(optional)</span>
          </legend>
          <ChipGroup
            type="single"
            aria-label="Gender"
            showCheck={false}
            value={values.gender}
            onValueChange={(v: string) => v && set("gender", v as ProfileValues["gender"])}
            options={[
              { value: "female", label: "Female" },
              { value: "male", label: "Male" },
              { value: "other", label: "Other" },
              { value: "undisclosed", label: "Prefer not to say" },
            ]}
          />
          <p className="text-caption text-fg-muted">Helps us show relevant sizes and collections.</p>
        </fieldset>
        <Field label="Date of birth" hint="Optional · for a birthday offer. Never shown publicly.">
          <DatePicker
            captionLayout="dropdown"
            fromYear={1930}
            toYear={new Date().getFullYear() - 13}
            max={new Date(new Date().getFullYear() - 13, 11, 31)}
            defaultMonth={values.dateOfBirth ? new Date(`${values.dateOfBirth}T00:00:00`) : new Date(1995, 0, 1)}
            value={values.dateOfBirth ? new Date(`${values.dateOfBirth}T00:00:00`) : null}
            onValueChange={(d) => set("dateOfBirth", toIso(d))}
            clearable
            onClear={() => set("dateOfBirth", null)}
            placeholder="Add your birthday"
          />
        </Field>

        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <Button type="submit" loading={busy} disabled={!dirty}>
            Save changes
          </Button>
          {dirty && (
            <Button type="button" variant="ghost" onClick={() => setValues(saved)} disabled={busy}>
              Discard
            </Button>
          )}
          <p aria-live="polite" className="text-caption text-fg-muted">
            {dirty ? "You have unsaved changes" : ""}
          </p>
        </div>
      </form>

      {/* Outside the form: React bubbles submit events through portals, which would save the profile */}
      <Dialog
        open={mobileDraft !== null}
        onOpenChange={(o) => {
          if (!o) {
            setMobileDraft(null);
            setOtpFor(null);
          }
        }}
      >
        <DialogContent size="sm">
          <DialogHeader title="Change mobile number" description={otpFor ? undefined : "We’ll send an OTP to the new number to confirm it’s yours."} />
          <DialogBody className="pb-6">
            {otpFor ? (
              <OtpVerifyStep
                target={otpFor}
                onChangeTarget={() => setOtpFor(null)}
                onResend={() => onSendMobileOtp(otpFor)}
                onVerify={async (code) => {
                  const ok = await onVerifyMobileOtp(otpFor, code);
                  if (!ok) return { ok: false, fieldErrors: { code: "Incorrect OTP. Try again." } };
                  window.setTimeout(() => {
                    setValues((v) => ({ ...v, mobile: otpFor }));
                    setSaved((v) => ({ ...v, mobile: otpFor }));
                    setMobileDraft(null);
                    setOtpFor(null);
                  }, 700);
                  return { ok: true };
                }}
                successText="Mobile number updated"
              />
            ) : (
              <form
                noValidate
                className="flex flex-col gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const err = validateMobile(mobileDraft ?? "");
                  if (err) return setErrors((x) => ({ ...x, mobile: err }));
                  if (mobileDraft === values.mobile) return setErrors((x) => ({ ...x, mobile: "This is already your number" }));
                  await onSendMobileOtp(mobileDraft!);
                  setOtpFor(mobileDraft);
                }}
              >
                <Field label="New mobile number" error={errors.mobile}>
                  <PhoneInput
                    value={mobileDraft ?? ""}
                    onValueChange={(v) => {
                      setMobileDraft(v);
                      setErrors((x) => ({ ...x, mobile: undefined }));
                    }}
                    autoFocus
                  />
                </Field>
                <Button type="submit">Send OTP</Button>
              </form>
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}
