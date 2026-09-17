"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Heart, MessageSquareText, Package, ShoppingBag } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { LoginForm } from "@/components/auth/login-form";
import { LoginPromptSheet, type LoginPromptReason } from "@/components/auth/login-prompt-sheet";
import { OtpVerifyStep } from "@/components/auth/otp-verify-step";
import { PhoneLoginForm } from "@/components/auth/phone-login-form";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { SignupForm } from "@/components/auth/signup-form";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import type { SocialProvider } from "@/components/auth/types";
import { VerifyEmailNotice } from "@/components/auth/verify-email-notice";
import { DsGrid, DsPreview } from "@/components/docs/ds-section";
import { toast } from "@/components/providers/toast-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TextButton } from "@/components/ui/text-button";
import { TextLink } from "@/components/ui/text-link";

/* ---- Demo backend: nothing leaves the browser, no OTP is really sent ---- */
export const DEMO = { email: "sujon@bluesigns.shop", password: "BlueSigns@2026", otp: "246810", takenEmail: "taken@bluesigns.shop" };
const wait = (ms = 800) => new Promise((r) => setTimeout(r, ms));

const demoAuth = {
  async login({ email, password }: { email: string; password: string }) {
    await wait();
    if (email.toLowerCase() === DEMO.email && password === DEMO.password) return { ok: true } as const;
    return { ok: false, error: "The email or password is incorrect. Check both and try again, or sign in with an OTP." } as const;
  },
  async sendOtp() {
    await wait(700);
    return { ok: true } as const;
  },
  async verifyOtp(code: string) {
    await wait(900);
    return code === DEMO.otp ? ({ ok: true } as const) : ({ ok: false, fieldErrors: { code: "Incorrect code. Check the SMS and try again." } } as const);
  },
  async signup({ email }: { email: string }) {
    await wait();
    if (email.toLowerCase() === DEMO.takenEmail) return { ok: false, fieldErrors: { email: "An account already uses this email. Sign in instead." } } as const;
    return { ok: true } as const;
  },
  async social(provider: SocialProvider) {
    await wait(900);
    toast({ title: `${provider === "google" ? "Google" : "Apple"} sign-in isn’t connected`, description: "Social sign-in is UI only in this demo.", tone: "info" });
  },
};

const legal = (
  <>
    By continuing you agree to BlueSigns’s <TextLink href="/" tone="inline">Terms of Use</TextLink> and{" "}
    <TextLink href="/" tone="inline">Privacy Policy</TextLink>.
  </>
);

function DemoHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex flex-wrap items-center gap-2 text-caption text-fg-muted">
      <Badge tone="accent" size="sm">
        Demo
      </Badge>
      {children}
    </p>
  );
}

/* ---- Full journey ---- */
type Step = "phone" | "otp" | "email" | "signup" | "verify-email" | "forgot" | "reset" | "done";

export function AuthJourneyDemo() {
  const [step, setStep] = useState<Step>("phone");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Move focus to the new step's heading so screen readers announce it (the OTP step focuses its field instead)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (step !== "otp") rootRef.current?.querySelector<HTMLElement>('[data-slot="auth-title"]')?.focus();
  }, [step]);

  const back = (to: Step, label = "Back") => (
    <Button variant="ghost" size="sm" leadingIcon={<ArrowLeft aria-hidden />} onClick={() => setStep(to)} className="-ml-3 self-start">
      {label}
    </Button>
  );

  const screens: Record<Step, { title: string; description?: string; top?: React.ReactNode; body: React.ReactNode; footer?: React.ReactNode }> = {
    phone: {
      title: "Sign in or create an account",
      description: "One OTP works for both — new numbers get an account automatically.",
      body: (
        <>
          <PhoneLoginForm
            defaultMobile={mobile}
            legal={legal}
            onUseEmail={() => setStep("email")}
            onSubmit={async (v) => {
              const r = await demoAuth.sendOtp();
              setMobile(v.mobile);
              setStep("otp");
              return r;
            }}
          />
          <SocialAuthButtons onSelect={demoAuth.social} layout="row" />
          <DemoHint>Any valid number works · OTP {DEMO.otp}</DemoHint>
        </>
      ),
      footer: (
        <>
          Prefer a password?{" "}
          <TextButton size="inherit" onClick={() => setStep("signup")}>
            Create an account with email
          </TextButton>
        </>
      ),
    },
    otp: {
      title: "Verify your number",
      top: back("phone"),
      body: (
        <>
          <OtpVerifyStep
            target={mobile}
            resendSeconds={20}
            onChangeTarget={() => setStep("phone")}
            onResend={async () => {
              await demoAuth.sendOtp();
              toast({ title: "OTP sent", description: `Demo code: ${DEMO.otp}`, tone: "success" });
            }}
            onVerify={async (code) => {
              const r = await demoAuth.verifyOtp(code);
              if (r.ok) window.setTimeout(() => setStep("done"), 900);
              return r;
            }}
          />
          <DemoHint>Code {DEMO.otp} · any other code shows the error state</DemoHint>
        </>
      ),
    },
    email: {
      title: "Sign in with email",
      top: back("phone", "Use mobile instead"),
      body: (
        <>
          <LoginForm
            onForgotPassword={() => setStep("forgot")}
            onSubmit={async (v) => {
              const r = await demoAuth.login(v);
              if (r.ok) setStep("done");
              return r;
            }}
          />
          <SocialAuthButtons onSelect={demoAuth.social} layout="row" />
          <DemoHint>
            {DEMO.email} · {DEMO.password}
          </DemoHint>
        </>
      ),
      footer: (
        <>
          New to BlueSigns?{" "}
          <TextButton size="inherit" onClick={() => setStep("signup")}>
            Create an account
          </TextButton>
        </>
      ),
    },
    signup: {
      title: "Create your account",
      description: "Takes a minute. You’ll confirm your email next.",
      top: back("phone"),
      body: (
        <>
          <SocialAuthButtons onSelect={demoAuth.social} divider="or sign up with email" dividerPosition="bottom" />
          <SignupForm
            termsLabel={<>I agree to the Terms of Use and Privacy Policy</>}
            onSubmit={async (v) => {
              const r = await demoAuth.signup(v);
              if (r.ok) {
                setEmail(v.email);
                setStep("verify-email");
              }
              return r;
            }}
          />
          <DemoHint>{DEMO.takenEmail} shows the “already registered” error</DemoHint>
        </>
      ),
      footer: (
        <>
          Already have an account?{" "}
          <TextButton size="inherit" onClick={() => setStep("email")}>
            Sign in
          </TextButton>
        </>
      ),
    },
    "verify-email": {
      title: "Check your inbox",
      body: (
        <VerifyEmailNotice
          email={email}
          onResend={async () => {
            await wait(600);
            toast({ title: "Verification link sent", description: email, tone: "success" });
          }}
          onChangeEmail={() => setStep("signup")}
          onContinue={() => setStep("done")}
        />
      ),
    },
    forgot: {
      title: "Reset your password",
      top: back("email"),
      body: (
        <ForgotPasswordForm
          onBackToSignIn={() => setStep("email")}
          onEnterCode={() => setStep("reset")}
          onSubmit={async () => {
            await wait();
            return { ok: true };
          }}
        />
      ),
    },
    reset: {
      title: "Create a new password",
      top: back("forgot"),
      body: (
        <ResetPasswordForm
          accountEmail={DEMO.email}
          onDone={() => setStep("email")}
          onSubmit={async () => {
            await wait();
            return { ok: true };
          }}
        />
      ),
    },
    done: {
      title: "You’re signed in",
      description: "In the store this step redirects back to where the shopper started.",
      body: (
        <Button size="lg" variant="secondary" fullWidth onClick={() => setStep("phone")}>
          Restart demo
        </Button>
      ),
    },
  };

  const s = screens[step];
  return (
    <div ref={rootRef}>
      <AuthShell key={step} headingLevel="h3" title={s.title} description={s.description} topSlot={s.top} footer={s.footer}>
        {s.body}
      </AuthShell>
    </div>
  );
}

/* ---- Individual pieces ---- */
export function AuthFormsDemo() {
  return (
    <DsGrid>
      <DsPreview label="LoginForm" className="flex-col items-stretch" code={`<LoginForm onSubmit={signIn} onForgotPassword={…} onUseOtp={…} />`}>
        <LoginForm onSubmit={demoAuth.login} onForgotPassword={() => toast({ title: "Opens ForgotPasswordForm" })} onUseOtp={() => toast({ title: "Opens PhoneLoginForm" })} />
        <DemoHint>
          Submit empty to see validation · {DEMO.email} / {DEMO.password}
        </DemoHint>
      </DsPreview>
      <DsPreview label="PhoneLoginForm" className="flex-col items-stretch" code={`<PhoneLoginForm onSubmit={sendOtp} legal={terms} />`}>
        <PhoneLoginForm
          legal={legal}
          onSubmit={async () => {
            const r = await demoAuth.sendOtp();
            toast({ title: "OTP sent", description: "Next: OtpVerifyStep", tone: "success" });
            return r;
          }}
        />
      </DsPreview>
      <DsPreview label="OtpVerifyStep" className="flex-col items-stretch" code={`<OtpVerifyStep target={mobile} onVerify={verify} onResend={resend} />`}>
        <OtpVerifyStep
          target="9876543210"
          autoFocus={false}
          resendSeconds={15}
          maxResends={2}
          onChangeTarget={() => toast({ title: "Back to the mobile step" })}
          onResend={async () => {
            await demoAuth.sendOtp();
          }}
          onVerify={demoAuth.verifyOtp}
        />
        <DemoHint>Code {DEMO.otp} · 2 resends before the lock</DemoHint>
      </DsPreview>
      <DsPreview label="SocialAuthButtons" className="flex-col items-stretch">
        <SocialAuthButtons onSelect={demoAuth.social} divider={false} />
        <SocialAuthButtons onSelect={demoAuth.social} layout="row" divider="or continue with" />
      </DsPreview>
      <DsPreview label="SignupForm" className="flex-col items-stretch">
        <SignupForm
          onSubmit={async (v) => {
            const r = await demoAuth.signup(v);
            if (r.ok) toast({ title: "Account created", description: "Next: verify email", tone: "success" });
            return r;
          }}
        />
      </DsPreview>
      <div className="flex flex-col gap-5">
        <DsPreview label="ForgotPasswordForm" className="flex-col items-stretch">
          <ForgotPasswordForm
            onBackToSignIn={() => toast({ title: "Back to sign in" })}
            onEnterCode={() => toast({ title: "Opens code entry, then ResetPasswordForm" })}
            onSubmit={async () => {
              await wait();
              return { ok: true };
            }}
          />
          <DemoHint>Try an email and a mobile number — the sent states differ</DemoHint>
        </DsPreview>
        <DsPreview label="ResetPasswordForm" className="flex-col items-stretch">
          <ResetPasswordForm
            accountEmail={DEMO.email}
            onDone={() => toast({ title: "Back to sign in" })}
            onSubmit={async () => {
              await wait();
              return { ok: true };
            }}
          />
        </DsPreview>
      </div>
    </DsGrid>
  );
}

export function VerifyEmailDemo() {
  const resend = async () => {
    await wait(600);
    toast({ title: "Verification link sent", tone: "success" });
  };
  return (
    <div className="flex flex-col gap-5">
      <DsPreview label="VerifyEmailNotice · banner" className="block">
        <VerifyEmailNotice variant="banner" email="sujon@bluesigns.shop" onResend={resend} />
      </DsPreview>
      <DsPreview label="VerifyEmailNotice · page" className="flex-col items-stretch">
        <div className="max-w-md">
          <VerifyEmailNotice email="sujon@bluesigns.shop" onResend={resend} onChangeEmail={() => toast({ title: "Back to sign-up" })} onContinue={() => toast({ title: "Continue shopping" })} />
        </div>
      </DsPreview>
    </div>
  );
}

const reasons: { reason: LoginPromptReason; label: string; icon: React.ReactNode }[] = [
  { reason: "wishlist", label: "Save to wishlist", icon: <Heart aria-hidden /> },
  { reason: "checkout", label: "Place order", icon: <ShoppingBag aria-hidden /> },
  { reason: "review", label: "Write a review", icon: <MessageSquareText aria-hidden /> },
  { reason: "orders", label: "My orders", icon: <Package aria-hidden /> },
];

export function LoginPromptDemo() {
  const [reason, setReason] = useState<LoginPromptReason | null>(null);
  return (
    <DsPreview label="LoginPromptSheet" code={`<LoginPromptSheet open={open} onOpenChange={setOpen} reason="wishlist" onContinueWithMobile={…} />`}>
      {reasons.map((r) => (
        <Button key={r.reason} variant="secondary" leadingIcon={r.icon} onClick={() => setReason(r.reason)}>
          {r.label}
        </Button>
      ))}
      <p className="basis-full text-caption text-fg-muted">Bottom sheet below 640 px, centred dialog above.</p>
      <LoginPromptSheet
        open={reason !== null}
        onOpenChange={(o) => !o && setReason(null)}
        reason={reason ?? "generic"}
        onContinueWithMobile={() => {
          setReason(null);
          toast({ title: "Opens PhoneLoginForm", description: "The original action resumes after sign-in." });
        }}
        onContinueWithEmail={() => {
          setReason(null);
          toast({ title: "Opens LoginForm" });
        }}
        onSocial={demoAuth.social}
      />
    </DsPreview>
  );
}
