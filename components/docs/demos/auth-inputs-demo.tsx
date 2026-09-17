"use client";

import { useState } from "react";
import { DsGrid, DsPreview } from "@/components/docs/ds-section";
import { toast } from "@/components/providers/toast-store";
import { Field } from "@/components/ui/field";
import { OtpInput } from "@/components/ui/otp-input";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordStrengthMeter } from "@/components/ui/password-strength-meter";
import { isValidIndianMobile, PhoneInput } from "@/components/ui/phone-input";
import { ResendTimer } from "@/components/ui/resend-timer";
import { formatPhone } from "@/lib/format";

const DEMO_CODE = "246810";

export function PasswordDemo() {
  const [password, setPassword] = useState("");
  return (
    <DsPreview
      label="PasswordInput + PasswordStrengthMeter"
      className="flex-col items-stretch"
      code={`<PasswordInput autoComplete="new-password" value={pw} onChange={…} />\n<PasswordStrengthMeter password={pw} />`}
    >
      <Field label="Create password" required>
        <PasswordInput autoComplete="new-password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
      <PasswordStrengthMeter password={password} />
    </DsPreview>
  );
}

export function PhoneDemo() {
  const [mobile, setMobile] = useState("98765");
  const [touched, setTouched] = useState(false);
  const error = touched && !isValidIndianMobile(mobile) ? "Enter a valid 10-digit mobile number" : undefined;
  return (
    <DsPreview label="PhoneInput" className="flex-col items-stretch" code={`<PhoneInput value={mobile} onValueChange={setMobile} />`}>
      <Field label="Mobile number" hint="We’ll send a one-time password to this number." error={error} required>
        <PhoneInput value={mobile} onValueChange={setMobile} onBlur={() => setTouched(true)} />
      </Field>
      <p className="text-caption text-fg-muted">
        Stored as <span className="font-mono text-fg">{mobile || "—"}</span>
        {isValidIndianMobile(mobile) && <> · shown as {formatPhone(mobile)}</>}. Try pasting “+91 98765-43210”.
      </p>
      <Field label="Disabled">
        <PhoneInput defaultValue="9876543210" disabled />
      </Field>
    </DsPreview>
  );
}

export function OtpDemo() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"default" | "error" | "success">("default");
  const [attempts, setAttempts] = useState(3);

  return (
    <DsPreview label="OtpInput + ResendTimer" className="flex-col items-start" code={`<OtpInput onComplete={verify} />\n<ResendTimer seconds={30} onResend={sendOtp} />`}>
      <Field
        label={`Enter the OTP sent to ${formatPhone("9876543210")}`}
        hint={`Demo code: ${DEMO_CODE}`}
        error={status === "error" ? "Incorrect OTP. Check the code and try again." : undefined}
      >
        <OtpInput
          value={code}
          status={status}
          onValueChange={(c) => {
            setCode(c);
            if (status !== "default") setStatus("default");
          }}
          onComplete={(c) => setStatus(c === DEMO_CODE ? "success" : "error")}
        />
      </Field>
      {status === "success" && <p className="text-body text-success-fg">Verified</p>}
      <ResendTimer
        seconds={15}
        attemptsLeft={attempts}
        onResend={async () => {
          await new Promise((r) => setTimeout(r, 600));
          setAttempts((a) => a - 1);
          setCode("");
          setStatus("default");
          toast({ title: "OTP sent", description: `A new code was sent to ${formatPhone("9876543210")}.`, tone: "success" });
        }}
      />
    </DsPreview>
  );
}

export function OtpStatesDemo() {
  return (
    <DsGrid>
      <DsPreview label="OTP states" className="flex-col items-start">
        <OtpInput aria-label="Empty" size="md" />
        <OtpInput aria-label="Partly filled" size="md" defaultValue="246" />
        <OtpInput aria-label="Error" size="md" defaultValue="246811" status="error" />
        <OtpInput aria-label="Verified" size="md" defaultValue="246810" status="success" />
        <OtpInput aria-label="Disabled" size="md" disabled />
      </DsPreview>
      <DsPreview label="4-digit PIN" className="flex-col items-start">
        <Field label="Delivery PIN" hint="Share with the delivery partner at your door.">
          <OtpInput length={4} />
        </Field>
      </DsPreview>
    </DsGrid>
  );
}
