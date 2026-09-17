import { useEffect, useRef } from "react";
import { CookieConsent, CookieSettingsLink } from "@bluesigns/ui";

export const Notice = () => (
  <div className="flex justify-center p-6">
    <CookieConsent preview className="max-w-md" />
  </div>
);

export const SettingsDialog = () => {
  const ref = useRef<HTMLDivElement>(null);
  // The footer's CookieSettingsLink reopens the settings dialog; click it once to show the dialog.
  useEffect(() => {
    ref.current?.querySelector("button")?.click();
  }, []);
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div ref={ref}>
        <CookieSettingsLink className="text-label text-accent-fg underline" />
      </div>
      <CookieConsent preview className="max-w-md" />
    </div>
  );
};

export const InBottomDock = () => (
  <div className="flex flex-col justify-end rounded-2xl bg-canvas p-4" style={{ maxWidth: 480, minHeight: 360 }}>
    <CookieConsent preview placement="inline" privacyHref="/help#privacy" />
  </div>
);
