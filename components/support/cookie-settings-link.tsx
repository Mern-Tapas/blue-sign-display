"use client";

import { openConsentSettings } from "./cookie-consent";

/** Footer control to reopen consent choices, so withdrawing is as easy as agreeing. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      Cookie settings
    </button>
  );
}
