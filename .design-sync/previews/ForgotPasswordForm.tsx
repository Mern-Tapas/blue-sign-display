import { AuthShell, ForgotPasswordForm, toast } from "@bluesigns/ui";

const send = async () => {
  await new Promise((r) => setTimeout(r, 800));
  return { ok: true } as const;
};

export const InAuthCard = () => (
  <AuthShell layout="card" headingLevel="h2" title="Reset your password" description="We’ll send a link to your email or a code to your mobile.">
    <ForgotPasswordForm
      onSubmit={send}
      onBackToSignIn={() => toast({ title: "Back to sign in" })}
      onEnterCode={() => toast({ title: "Opens code entry" })}
    />
  </AuthShell>
);

export const PrefilledEmail = () => (
  <div style={{ maxWidth: 420 }}>
    <ForgotPasswordForm defaultIdentifier="sujon@bluesigns.shop" onSubmit={send} onBackToSignIn={() => {}} />
  </div>
);

export const PrefilledMobile = () => (
  <div style={{ maxWidth: 420 }}>
    <ForgotPasswordForm defaultIdentifier="9876543210" onSubmit={send} onEnterCode={() => {}} />
  </div>
);
