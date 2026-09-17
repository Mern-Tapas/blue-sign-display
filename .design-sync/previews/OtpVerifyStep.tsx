import { AuthShell, Button, OtpVerifyStep, icons, toast } from "@bluesigns/ui";

const { ArrowLeft } = icons;
const verify = async (code: string) => {
  await new Promise((r) => setTimeout(r, 900));
  return code === "246810" ? ({ ok: true } as const) : ({ ok: false, fieldErrors: { code: "Incorrect code. Check the SMS and try again." } } as const);
};
const resend = async () => {
  await new Promise((r) => setTimeout(r, 700));
  toast({ title: "OTP sent", tone: "success" });
};

export const SmsCode = () => (
  <AuthShell
    layout="card"
    headingLevel="h2"
    title="Verify your number"
    topSlot={
      <Button variant="ghost" size="sm" leadingIcon={<ArrowLeft aria-hidden />} className="-ml-3 self-start">
        Back
      </Button>
    }
  >
    <OtpVerifyStep target="9876543210" autoFocus={false} resendSeconds={20} onChangeTarget={() => {}} onVerify={verify} onResend={resend} />
  </AuthShell>
);

export const EmailCode = () => (
  <div style={{ maxWidth: 420 }}>
    <OtpVerifyStep target="sujon@bluesigns.shop" channel="email" length={6} autoFocus={false} onVerify={verify} onResend={resend} submitLabel="Verify email" />
  </div>
);

export const FourDigitLimitedResends = () => (
  <div style={{ maxWidth: 420 }}>
    <OtpVerifyStep target="9812345670" length={4} autoFocus={false} resendSeconds={15} maxResends={2} onChangeTarget={() => {}} onVerify={verify} onResend={resend} />
  </div>
);
