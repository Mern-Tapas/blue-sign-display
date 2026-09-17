import { TextLink } from "@bluesigns/ui";

export const Tones = () => (
  <div className="flex flex-col items-start gap-3" style={{ maxWidth: 420 }}>
    <TextLink href="/account/orders">Track your order</TextLink>
    <p className="text-body text-fg-muted">
      By continuing you agree to the <TextLink href="/terms" tone="inline">Terms of Use</TextLink> and{" "}
      <TextLink href="/privacy" tone="inline">Privacy Policy</TextLink>.
    </p>
    <TextLink href="/help" tone="muted">
      Help centre
    </TextLink>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-baseline gap-5">
    <TextLink href="/offers" size="sm">
      View offers
    </TextLink>
    <TextLink href="/offers" size="md">
      View offers
    </TextLink>
    <TextLink href="/offers" size="lg">
      View offers
    </TextLink>
  </div>
);

export const External = () => (
  <div className="flex flex-wrap gap-4">
    <TextLink href="https://www.npci.org.in/what-we-do/upi/product-overview" external size="sm">
      About UPI
    </TextLink>
    <TextLink href="https://www.indiapost.gov.in" external size="sm" tone="muted">
      India Post tracking
    </TextLink>
  </div>
);

export const InFieldLabel = () => (
  <div className="flex items-center justify-between text-label" style={{ maxWidth: 360 }}>
    <span>Password</span>
    <TextLink href="/forgot-password" size="sm" hitArea>
      Forgot password?
    </TextLink>
  </div>
);
