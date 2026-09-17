import { AuthShell, SignupForm, SocialAuthButtons, TextButton, TextLink, toast } from "@bluesigns/ui";

const signup = async ({ email }: { email: string }) => {
  await new Promise((r) => setTimeout(r, 800));
  if (email.toLowerCase() === "taken@bluesigns.shop") return { ok: false, fieldErrors: { email: "An account already uses this email. Sign in instead." } } as const;
  toast({ title: "Account created", tone: "success" });
  return { ok: true } as const;
};
const social = async () => {
  await new Promise((r) => setTimeout(r, 900));
};

export const CreateAccount = () => (
  <AuthShell
    layout="card"
    headingLevel="h2"
    title="Create your account"
    description="Takes a minute. You’ll confirm your email next."
    footer={
      <>
        Already have an account? <TextButton size="inherit">Sign in</TextButton>
      </>
    }
  >
    <SocialAuthButtons onSelect={social} divider="or sign up with email" dividerPosition="bottom" />
    <SignupForm
      onSubmit={signup}
      termsLabel={
        <>
          I agree to the <TextLink href="/" tone="inline">Terms of Use</TextLink> and <TextLink href="/" tone="inline">Privacy Policy</TextLink>
        </>
      }
    />
  </AuthShell>
);

export const FormOnly = () => (
  <div style={{ maxWidth: 420 }}>
    <SignupForm onSubmit={signup} submitLabel="Create account and continue" />
  </div>
);
