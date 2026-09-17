import { NewsletterSignup } from "@bluesigns/ui";

export const Surface = () => (
  <div style={{ maxWidth: 560 }}>
    <NewsletterSignup />
  </div>
);

export const Accent = () => (
  <div style={{ maxWidth: 560 }}>
    <NewsletterSignup variant="accent" title="Members get early access" description="Join free and shop drops 24h before everyone else." />
  </div>
);

export const ContrastInFooter = () => (
  <div className="rounded-2xl bg-surface-contrast p-8" style={{ maxWidth: 560 }}>
    <NewsletterSignup
      variant="contrast"
      title="Festive sale starts 3 October"
      description="Get the early-access link and a ₹250 welcome coupon in your inbox."
    />
  </div>
);

export const WideRow = () => (
  <div style={{ width: 860 }}>
    <NewsletterSignup />
  </div>
);
