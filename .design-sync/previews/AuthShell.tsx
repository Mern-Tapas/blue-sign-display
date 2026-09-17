import { AuthShell, Button, LoginForm, PhoneLoginForm, SocialAuthButtons, TextButton, TextLink, icons } from "@bluesigns/ui";

const { ArrowLeft, Truck, BadgePercent, RotateCcw } = icons;
const wait = (ms = 800) => new Promise((r) => setTimeout(r, ms));
const sendOtp = async () => {
  await wait(700);
  return { ok: true } as const;
};
const login = async ({ email, password }: { email: string; password: string }) => {
  await wait();
  return email === "sujon@bluesigns.shop" && password === "BlueSigns@2026"
    ? ({ ok: true } as const)
    : ({ ok: false, error: "The email or password is incorrect. Check both and try again, or sign in with an OTP." } as const);
};
const social = async () => {
  await wait(900);
};
const legal = (
  <>
    By continuing you agree to BlueSigns’s <TextLink href="/" tone="inline">Terms of Use</TextLink> and{" "}
    <TextLink href="/" tone="inline">Privacy Policy</TextLink>.
  </>
);

export const MobileSignIn = () => (
  <AuthShell
    layout="card"
    headingLevel="h2"
    title="Sign in or create an account"
    description="One OTP works for both — new numbers get an account automatically."
    footer={
      <>
        Prefer a password? <TextButton size="inherit">Create an account with email</TextButton>
      </>
    }
  >
    <PhoneLoginForm legal={legal} onSubmit={sendOtp} onUseEmail={() => {}} />
    <SocialAuthButtons onSelect={social} layout="row" />
  </AuthShell>
);

export const EmailStepWithBack = () => (
  <AuthShell
    layout="card"
    headingLevel="h2"
    title="Sign in with email"
    topSlot={
      <Button variant="ghost" size="sm" leadingIcon={<ArrowLeft aria-hidden />} className="-ml-3 self-start">
        Use mobile instead
      </Button>
    }
    footer={
      <>
        New to BlueSigns? <TextButton size="inherit">Create an account</TextButton>
      </>
    }
  >
    <LoginForm onSubmit={login} onForgotPassword={() => {}} />
  </AuthShell>
);

export const SplitPage = () => (
  <div style={{ maxWidth: 1100 }}>
    <AuthShell
      title="Welcome back"
      description="Sign in to track orders and check out faster."
      asideTitle="Your festive shopping, sorted"
      perks={[
        { icon: <Truck />, title: "Free delivery over ₹499", description: "On lakhs of products across India" },
        { icon: <BadgePercent />, title: "Member-only prices", description: "Early access to the festive sale" },
        { icon: <RotateCcw />, title: "14-day easy returns", description: "Doorstep pickup, refund to source" },
      ]}
    >
      <PhoneLoginForm legal={legal} onSubmit={sendOtp} />
    </AuthShell>
  </div>
);
