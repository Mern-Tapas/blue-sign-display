"use client";

import { useState } from "react";
import { Cookie } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { TextButton } from "@/components/ui/text-button";
import { TextLink } from "@/components/ui/text-link";
import { createStore } from "@/lib/create-store";
import { cn } from "@/lib/cn";

export type ConsentPurpose = "analytics" | "personalisation" | "marketing";
export type ConsentState = { decided: boolean; decidedAt: string | null; purposes: Record<ConsentPurpose, boolean> };

const none: ConsentState = { decided: false, decidedAt: null, purposes: { analytics: false, personalisation: false, marketing: false } };

const store = createStore<ConsentState>(none, {
  storageKey: "ds-consent",
  parse: (raw) => {
    const v = raw as Partial<ConsentState> | null;
    return v?.decided && v.purposes ? { decided: true, decidedAt: v.decidedAt ?? null, purposes: { ...none.purposes, ...v.purposes } } : none;
  },
});
const settingsUi = createStore(false);

/** Read the shopper's choices before loading analytics or ad tags. Nothing is allowed until they decide. */
export const useConsent = store.useStore;
/** Reopen the settings, e.g. from a footer "Cookie settings" link. Withdrawing is as easy as giving. */
export const openConsentSettings = () => settingsUi.set(true);

export const consentPurposes: { id: ConsentPurpose | "essential"; label: string; description: string }[] = [
  { id: "essential", label: "Essential", description: "Sign-in, bag, checkout, security and remembering these choices. The store can’t work without them." },
  { id: "analytics", label: "Analytics", description: "Anonymous counts of which pages and features are used, so we can fix what’s slow or confusing." },
  { id: "personalisation", label: "Personalisation", description: "Recommendations based on what you browse, like “Recently viewed” and sizes that fit you." },
  { id: "marketing", label: "Marketing", description: "Measuring ads on other sites and showing you BlueSigns offers there. We never sell your data." },
];

function decide(purposes: ConsentState["purposes"]) {
  store.set({ decided: true, decidedAt: new Date().toISOString(), purposes });
  settingsUi.set(false);
}

export type CookieConsentProps = {
  privacyHref?: string;
  /** Lift above sticky mobile bars, e.g. "bottom-20 lg:bottom-4". */
  className?: string;
  /** Always show the notice (docs previews). */
  preview?: boolean;
  /** "fixed" pins itself bottom-right; "inline" renders in flow (inside a shared bottom dock). */
  placement?: "fixed" | "inline";
};

/**
 * Consent notice in the spirit of India's DPDP Act: plain-language purposes, nothing optional
 * switched on before a choice, Accept and Reject with equal weight, per-purpose control, and
 * a settings dialog that can be reopened any time to withdraw.
 */
export function CookieConsent({ privacyHref = "/help#privacy", className, preview = false, placement = "fixed" }: CookieConsentProps) {
  const consent = useConsent();
  const settingsOpen = settingsUi.useStore();
  // Edits in the dialog; null means "show what's saved", so reopening from anywhere starts from the saved choices
  const [edits, setEdits] = useState<ConsentState["purposes"] | null>(null);
  const draft = edits ?? consent.purposes;
  const openSettings = () => settingsUi.set(true);

  return (
    <>
      {(preview || !consent.decided) && (
        <section
          data-slot="cookie-consent"
          aria-label="Cookie choices"
          className={cn(
            !preview && placement === "fixed" && "fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-(--z-toast) sm:inset-x-auto sm:right-4 sm:max-w-md lg:bottom-4",
            "pointer-events-auto flex w-full flex-col gap-3 rounded-2xl bg-surface-raised p-4 shadow-modal sm:max-w-md sm:p-5",
            className,
          )}
        >
          <div className="flex items-start gap-3">
            <Cookie aria-hidden className="mt-0.5 size-icon-lg shrink-0 text-fg-muted max-sm:hidden" />
            <div className="flex flex-col gap-1">
              <h2 className="text-title">Your data, your choice</h2>
              <p className="text-caption text-fg-muted sm:text-body">
                We use essential cookies to run the store. With your permission we’d also use them for analytics, personalisation and marketing.{" "}
                <TextLink href={privacyHref} tone="inline" className="text-fg">
                  Privacy notice
                </TextLink>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => decide(none.purposes)}>
              Reject optional
            </Button>
            <Button variant="secondary" onClick={() => decide({ analytics: true, personalisation: true, marketing: true })}>
              Accept all
            </Button>
            <TextButton tone="neutral" className="col-span-2 justify-self-center" onClick={openSettings}>
              Choose what to allow
            </TextButton>
          </div>
        </section>
      )}

      <Dialog
        open={settingsOpen}
        onOpenChange={(o) => {
          settingsUi.set(o);
          if (!o) setEdits(null);
        }}
      >
        <DialogContent size="md">
          <DialogHeader title="Cookie settings" description="Change these any time from Cookie settings in the footer. Turning something off stops it from now on." />
          <DialogBody className="flex flex-col divide-y divide-border-subtle">
            {consentPurposes.map((p) => (
              <div key={p.id} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div className="flex flex-col gap-1">
                  <p id={`consent-${p.id}`} className="flex items-center gap-2 text-body-strong">
                    {p.label}
                    {p.id === "essential" && <Badge tone="neutral" size="sm">Always on</Badge>}
                  </p>
                  <p id={`consent-${p.id}-desc`} className="text-body text-fg-muted">
                    {p.description}
                  </p>
                </div>
                <Switch
                  aria-labelledby={`consent-${p.id}`}
                  aria-describedby={`consent-${p.id}-desc`}
                  checked={p.id === "essential" ? true : draft[p.id]}
                  disabled={p.id === "essential"}
                  onCheckedChange={(on) => p.id !== "essential" && setEdits({ ...draft, [p.id]: on })}
                />
              </div>
            ))}
          </DialogBody>
          <DialogFooter className="border-t border-border-subtle pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setEdits(null);
                decide(none.purposes);
              }}
            >
              Reject optional
            </Button>
            <Button
              onClick={() => {
                setEdits(null);
                decide(draft);
              }}
            >
              Save choices
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
