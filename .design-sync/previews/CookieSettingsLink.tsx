import { CookieSettingsLink, TextLink } from "@bluesigns/ui";

// The link opens the settings dialog rendered by CookieConsent, which the app layout mounts once.
export const FooterRow = () => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-surface-contrast px-6 py-4 text-caption text-fg-on-contrast-muted" style={{ maxWidth: 640 }}>
    <p>© 2026 BlueSigns Goods</p>
    <span>Privacy</span>
    <span>Terms of Use</span>
    <CookieSettingsLink className="transition-colors duration-(--dur-fast) hover:text-fg-on-contrast" />
  </div>
);

export const InPrivacyText = () => (
  <p className="text-body text-fg-muted" style={{ maxWidth: 480 }}>
    You can change what we collect at any time from <CookieSettingsLink className="text-accent-fg underline" />. Read the full{" "}
    <TextLink href="/help#privacy" tone="inline">
      privacy notice
    </TextLink>
    .
  </p>
);

export const AsButton = () => <CookieSettingsLink className="rounded-pill border border-border px-4 py-2 text-label" />;
