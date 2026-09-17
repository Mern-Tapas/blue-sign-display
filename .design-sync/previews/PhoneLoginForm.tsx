import { AuthShell, PhoneLoginForm, SocialAuthButtons, TextLink, toast } from "@bluesigns/ui";

const sendOtp = async () => {
  await new Promise((r) => setTimeout(r, 700));
  toast({ title: "OTP sent", tone: "success" });
  return { ok: true } as const;
};
const social = async () => {
  await new Promise((r) => setTimeout(r, 900));
};
const legal = (
  <>
    By continuing you agree to BlueSigns’s <TextLink href="/" tone="inline">Terms of Use</TextLink> and{" "}
    <TextLink href="/" tone="inline">Privacy Policy</TextLink>.
  </>
);

export const MobileOtp = () => (
  <AuthShell layout="card" headingLevel="h2" title="Sign in or create an account" description="One OTP works for both.">
    <PhoneLoginForm legal={legal} onSubmit={sendOtp} onUseEmail={() => toast({ title: "Opens email sign-in" })} />
    <SocialAuthButtons onSelect={social} layout="row" />
  </AuthShell>
);

export const PrefilledNoWhatsapp = () => (
  <div style={{ maxWidth: 420 }}>
    <PhoneLoginForm defaultMobile="9876543210" showWhatsappOptIn={false} legal={legal} onSubmit={sendOtp} />
  </div>
);

export const CustomLabel = () => (
  <div style={{ maxWidth: 420 }}>
    <PhoneLoginForm submitLabel="Send code to continue checkout" onSubmit={sendOtp} onUseEmail={() => {}} />
  </div>
);
