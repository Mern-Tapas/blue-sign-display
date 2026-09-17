"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CloudOff, Wifi } from "lucide-react";
import { cn } from "@/lib/cn";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

/** navigator.onLine as a hook; true on the server so nothing flashes during hydration. */
export function useOnlineStatus() {
  return useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
}

export type OfflineBannerProps = {
  /** Lift above sticky mobile bars, e.g. "bottom-20 lg:bottom-4". */
  className?: string;
  /** Force a state for docs previews. */
  forceState?: "offline" | "restored";
  /** "fixed" pins itself to the viewport; "inline" renders in flow (inside a shared bottom dock). */
  placement?: "fixed" | "inline";
};

/**
 * Connection notice pinned to the bottom of the viewport. Offline stays until the connection
 * returns; "Back online" confirms for three seconds then leaves. Announced politely.
 */
export function OfflineBanner({ className, forceState, placement = "fixed" }: OfflineBannerProps) {
  const online = useOnlineStatus();
  const [restored, setRestored] = useState(false);
  const timer = useRef<number>(undefined);

  useEffect(() => {
    const onOffline = () => {
      window.clearTimeout(timer.current);
      setRestored(false);
    };
    const onOnline = () => {
      setRestored(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setRestored(false), 3000);
    };
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.clearTimeout(timer.current);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  const state = forceState ?? (!online ? "offline" : restored ? "restored" : null);

  return (
    <div role="status" aria-live="polite" className={cn(!forceState && placement === "fixed" && "pointer-events-none fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-(--z-toast) flex justify-center px-4 lg:bottom-4", className)}>
      {state && (
        <p
          data-slot="offline-banner"
          data-state={state}
          className={cn(
            "pointer-events-auto flex items-center gap-2 rounded-pill px-4 py-2.5 text-label shadow-popover motion-safe:animate-fade-in",
            state === "offline" ? "bg-surface-contrast text-fg-on-contrast" : "bg-success-soft text-success-fg",
          )}
        >
          {state === "offline" ? <CloudOff aria-hidden className="size-icon-md" /> : <Wifi aria-hidden className="size-icon-md" />}
          {state === "offline" ? "You’re offline. Showing what’s already loaded." : "Back online"}
        </p>
      )}
    </div>
  );
}
