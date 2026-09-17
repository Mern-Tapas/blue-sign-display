import { AuthShell, VerifyEmailNotice, toast } from "@bluesigns/ui";

const resend = async () => {
  await new Promise((r) => setTimeout(r, 600));
  toast({ title: "Verification link sent", tone: "success" });
};

export const Page = () => (
  <AuthShell layout="card" headingLevel="h2" title="Check your inbox">
    <VerifyEmailNotice
      email="sujon@bluesigns.shop"
      onResend={resend}
      onChangeEmail={() => toast({ title: "Back to sign-up" })}
      onContinue={() => toast({ title: "Continue shopping" })}
      inboxLinks={[
        { label: "Open Gmail", href: "https://mail.google.com" },
        { label: "Open Outlook", href: "https://outlook.live.com" },
      ]}
    />
  </AuthShell>
);

export const Banner = () => (
  <div style={{ maxWidth: 820 }}>
    <VerifyEmailNotice variant="banner" email="sujon@bluesigns.shop" onResend={resend} />
  </div>
);

export const PageMinimal = () => (
  <div style={{ maxWidth: 420 }}>
    <VerifyEmailNotice email="priya.r@gmail.com" onResend={resend} continueLabel="Go to my orders" onContinue={() => {}} />
  </div>
);
