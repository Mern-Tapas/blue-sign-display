"use client";

import { useState, useSyncExternalStore } from "react";
import { BellRing, X } from "lucide-react";
import { notificationState, useNotificationState } from "@/components/providers/notifications-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Permission = NotificationPermission | "unsupported";

function subscribe(onChange: () => void) {
  // No permission-change event everywhere; re-check when the tab regains focus
  window.addEventListener("focus", onChange);
  return () => window.removeEventListener("focus", onChange);
}
const getPermission = (): Permission => ("Notification" in window ? Notification.permission : "unsupported");

export type EnableNotificationsBannerProps = {
  /** What the shopper gets; keep it specific. */
  benefit?: string;
  /** Called after permission is granted (register the push subscription here). */
  onGranted?: () => void;
  className?: string;
};

/**
 * Asks for browser notifications only after explaining why, never on page load by itself.
 * Hidden when granted, unsupported or dismissed; when blocked it explains how to re-enable.
 */
export function EnableNotificationsBanner({ benefit = "Get delivery updates and price drops on this device, even when BlueSigns isn’t open.", onGranted, className }: EnableNotificationsBannerProps) {
  const permission = useSyncExternalStore<Permission>(subscribe, getPermission, () => "unsupported");
  const { bannerDismissed } = useNotificationState();
  const [asking, setAsking] = useState(false);
  const [justDenied, setJustDenied] = useState(false);

  if (permission === "unsupported" || permission === "granted" || (bannerDismissed && !justDenied)) return null;

  const denied = permission === "denied";

  return (
    <section data-slot="enable-notifications" aria-label="Browser notifications" className={cn("relative flex flex-col gap-3 rounded-2xl bg-accent-soft p-4 text-accent-soft-fg sm:flex-row sm:items-center", className)}>
      <BellRing aria-hidden className="size-icon-lg shrink-0" />
      <div className="min-w-0 flex-1 pr-8 sm:pr-0">
        <p className="text-body-strong">{denied ? "Notifications are blocked" : "Turn on notifications"}</p>
        <p className="text-body">{denied ? "To get delivery updates here, allow notifications for this site in your browser’s site settings." : benefit}</p>
      </div>
      {!denied && (
        <div className="flex gap-2">
          <Button
            size="sm"
            loading={asking}
            onClick={async () => {
              setAsking(true);
              const result = await Notification.requestPermission();
              setAsking(false);
              if (result === "granted") onGranted?.();
              if (result === "denied") setJustDenied(true);
            }}
          >
            Turn on
          </Button>
          <Button size="sm" variant="ghost" className="text-inherit" onClick={notificationState.dismissBanner}>
            Not now
          </Button>
        </div>
      )}
      <button
        type="button"
        aria-label="Dismiss"
        onClick={notificationState.dismissBanner}
        className="state-layer hit-area absolute top-3 right-3 flex size-control-xs items-center justify-center rounded-pill sm:static"
      >
        <X aria-hidden className="size-icon-sm" />
      </button>
    </section>
  );
}
