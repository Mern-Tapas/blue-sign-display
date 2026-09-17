import type { Metadata } from "next";
import { AuthFormsDemo, AuthJourneyDemo, LoginPromptDemo, VerifyEmailDemo } from "@/components/docs/demos/auth-demo";
import { DsPageHeader, DsPreview, DsProps, DsSection } from "@/components/docs/ds-section";

export const metadata: Metadata = { title: "Authentication" };

const rules = [
  ["Mobile OTP first", "Most Indian shoppers sign in with their number. Email + password and Google / Apple stay one tap away; one OTP both signs in and creates an account."],
  ["Never block browsing", "Only wishlist, checkout, reviews and orders ask for sign-in, through LoginPromptSheet, and the shopper returns to the action afterwards. The bag is kept."],
  ["Generic credential errors", "“The email or password is incorrect” — never reveal which one, or whether an account exists (recovery says “If an account exists…”)."],
  ["Consent is opt-in", "Terms are an explicit checkbox; offers and WhatsApp updates start unticked and can be withdrawn later (DPDP)."],
  ["Help password managers", "username / current-password / new-password / one-time-code autocomplete on every field, and a hidden username on reset."],
  ["Errors that say what to do", "Validate on blur and submit, keep what was typed, focus the first invalid field, and put server errors in an alert above the fields."],
] as const;

export default function AuthPage() {
  return (
    <>
      <DsPageHeader
        title="Authentication"
        description="Sign-in, sign-up and recovery for an Indian storefront: mobile OTP first, email and social alternatives, and a login prompt that interrupts only the actions that need an account."
      />

      <DsSection
        title="Sign-in journey"
        description="The complete flow, wired to a demo backend in the browser. Start with a mobile number, switch to email, create an account, or recover a password. No OTP or email is really sent."
      >
        <DsPreview surface="canvas" className="block p-4 sm:p-6">
          <AuthJourneyDemo />
        </DsPreview>
      </DsSection>

      <DsSection title="Forms" description="Each step is a standalone form with its own validation, pending and error states. Handlers resolve an AuthResult; forms never navigate on their own.">
        <AuthFormsDemo />
      </DsSection>

      <DsSection title="Email verification" description="A full step after email sign-up, and a banner for the account page until the address is confirmed.">
        <VerifyEmailDemo />
      </DsSection>

      <DsSection title="Login prompt" description="Shown when a logged-out shopper taps an action that needs an account. The reason copy says why, and dismissing leaves them where they were.">
        <LoginPromptDemo />
      </DsSection>

      <DsSection title="Rules">
        <dl className="grid gap-x-8 gap-y-5 rounded-2xl bg-surface p-6 shadow-flat md:grid-cols-2">
          {rules.map(([term, text]) => (
            <div key={term} className="flex flex-col gap-1">
              <dt className="text-title">{term}</dt>
              <dd className="text-body text-fg-muted">{text}</dd>
            </div>
          ))}
        </dl>
      </DsSection>

      <DsSection title="Props">
        <div className="flex flex-col gap-5">
          <DsProps
            component="AuthShell"
            rows={[
              { name: "title · description", type: "ReactNode", description: "Step heading (focusable for step changes) and supporting line." },
              { name: "layout", type: '"split" | "card"', default: '"split"', description: "Brand panel + card from lg, or the card alone." },
              { name: "topSlot · footer", type: "ReactNode", description: "Back button above the title; switch-flow link under the card." },
              { name: "asideTitle · perks", type: "ReactNode · AuthPerk[]", description: "Brand panel copy — what an account is for, no invented stats." },
              { name: "headingLevel", type: '"h1" | "h2" | "h3"', default: '"h1"', description: "Lower it when the shell is embedded in another page." },
            ]}
          />
          <DsProps
            component="AuthResult"
            rows={[
              { name: "{ ok: true }", type: "success", description: "The form shows its success state or the parent moves on." },
              { name: "{ ok: false, error }", type: "string", description: "Alert above the fields (network, rate limit, wrong credentials)." },
              { name: "{ ok: false, fieldErrors }", type: "Partial<Record<Field, string>>", description: "Messages under specific fields; the first one is focused." },
            ]}
          />
          <DsProps
            component="LoginForm · SignupForm · PhoneLoginForm"
            rows={[
              { name: "onSubmit", type: "(values) => Promise<AuthResult>", description: "LoginValues { email, password, remember } · SignupValues { name, email, mobile, password, offers } · PhoneLoginValues { mobile, whatsappUpdates }." },
              { name: "onForgotPassword · onUseOtp", type: "() => void", description: "LoginForm: label-row link and secondary route." },
              { name: "onUseEmail · legal · showWhatsappOptIn · autoFocus", type: "fn · ReactNode · boolean · boolean", description: "PhoneLoginForm: alternate route, terms line, optional opt-in, focus on mount." },
              { name: "termsLabel", type: "ReactNode", description: "SignupForm: consent checkbox label (links allowed)." },
            ]}
          />
          <DsProps
            component="OtpVerifyStep"
            rows={[
              { name: "target · channel", type: 'string · "sms" | "email"', default: '— · "sms"', description: "Where the code went; mobiles are formatted +91 98765 43210." },
              { name: "onVerify · onResend", type: "(code) => Promise<AuthResult> · () => Promise<void>", description: "Auto-verifies on the last digit; failures clear the cells and refocus." },
              { name: "onChangeTarget", type: "() => void", description: "“Change” link back to the previous step." },
              { name: "resendSeconds · maxResends · length", type: "number", default: "30 · 3 · 6", description: "Cooldown, resend limit, code length." },
            ]}
          />
          <DsProps
            component="ForgotPasswordForm · ResetPasswordForm · VerifyEmailNotice"
            rows={[
              { name: "onSubmit", type: "(values) => Promise<AuthResult>", description: "Forgot: { kind: email | mobile, value } · Reset: { password, signOutEverywhere }." },
              { name: "onEnterCode · onBackToSignIn", type: "fn", description: "Forgot: mobile code route and exit." },
              { name: "accountEmail · onDone", type: "string · fn", description: "Reset: password-manager username and success action." },
              { name: "variant · email · onResend · onContinue", type: '"page" | "banner" · string · fn · fn', description: "VerifyEmailNotice: full step or account-page banner." },
            ]}
          />
          <DsProps
            component="SocialAuthButtons · LoginPromptSheet"
            rows={[
              { name: "providers · onSelect · layout · divider", type: 'SocialProvider[] · fn · "stack" | "row" · string | false', description: "Social: one provider busy at a time; brand marks per provider guidelines." },
              { name: "open · onOpenChange · reason", type: 'boolean · fn · "wishlist" | "checkout" | "review" | "orders" | "generic"', description: "Prompt: reason sets icon, title and why-copy." },
              { name: "onContinueWithMobile · onContinueWithEmail · onSocial", type: "fn", description: "Prompt: sign-in routes; omit email or social to hide them." },
            ]}
          />
        </div>
      </DsSection>
    </>
  );
}
