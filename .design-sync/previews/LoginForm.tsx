import { AuthShell, LoginForm, SocialAuthButtons, toast } from "@bluesigns/ui";

const login = async ({ email, password }: { email: string; password: string }) => {
  await new Promise((r) => setTimeout(r, 800));
  return email.toLowerCase() === "sujon@bluesigns.shop" && password === "BlueSigns@2026"
    ? ({ ok: true } as const)
    : ({ ok: false, error: "The email or password is incorrect. Check both and try again, or sign in with an OTP." } as const);
};
const social = async () => {
  await new Promise((r) => setTimeout(r, 900));
};

export const EmailSignIn = () => (
  <AuthShell layout="card" headingLevel="h2" title="Sign in with email">
    <LoginForm
      onSubmit={login}
      onForgotPassword={() => toast({ title: "Opens password reset" })}
      onUseOtp={() => toast({ title: "Opens mobile OTP sign-in" })}
    />
    <SocialAuthButtons onSelect={social} layout="row" />
  </AuthShell>
);

export const Prefilled = () => (
  <div style={{ maxWidth: 420 }}>
    <LoginForm defaultEmail="sujon@bluesigns.shop" onSubmit={login} onForgotPassword={() => {}} />
  </div>
);

export const CheckoutContinue = () => (
  <div style={{ maxWidth: 420 }}>
    <LoginForm onSubmit={login} submitLabel="Sign in and continue to payment" onUseOtp={() => {}} />
  </div>
);
