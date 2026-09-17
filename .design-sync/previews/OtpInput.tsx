import { Field, OtpInput, ResendTimer, formatPhone } from "@bluesigns/ui";

export const VerifyMobile = () => (
  <div className="flex flex-col items-start gap-3">
    <Field label={`Enter the OTP sent to ${formatPhone("9876543210")}`} hint="The code expires in 10 minutes.">
      <OtpInput defaultValue="2468" />
    </Field>
    <ResendTimer seconds={24} onResend={() => {}} attemptsLeft={3} />
  </div>
);

export const States = () => (
  <div className="flex flex-col items-start gap-3">
    <OtpInput aria-label="Empty" size="md" />
    <OtpInput aria-label="Partly filled" size="md" defaultValue="246" />
    <OtpInput aria-label="Error" size="md" defaultValue="246811" status="error" />
    <OtpInput aria-label="Verified" size="md" defaultValue="246810" status="success" />
    <OtpInput aria-label="Disabled" size="md" disabled />
  </div>
);

export const WithError = () => (
  <Field label="Enter OTP" error="Incorrect OTP. Check the code and try again.">
    <OtpInput defaultValue="246811" status="error" />
  </Field>
);

export const DeliveryPin = () => (
  <Field label="Delivery PIN" hint="Share with the delivery partner at your door.">
    <OtpInput length={4} defaultValue="4821" />
  </Field>
);
