"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { cn } from "@/lib/cn";
import type { SocialProvider } from "./types";

/* Official marks: providers require their own logo and colours on sign-in buttons. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-icon-lg!">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3.02c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.11A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.29 14.28a7.2 7.2 0 0 1 0-4.57V6.6H1.28a12 12 0 0 0 0 10.8l4.01-3.11Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.53 11.53 0 0 0 12 0 12 12 0 0 0 1.28 6.6l4.01 3.11C6.23 6.88 8.88 4.77 12 4.77Z" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-icon-lg! fill-current">
      <path d="M16.37 12.73c-.02-2.3 1.88-3.4 1.96-3.46a4.22 4.22 0 0 0-3.32-1.8c-1.41-.14-2.76.83-3.48.83-.72 0-1.82-.81-3-.79a4.44 4.44 0 0 0-3.75 2.28c-1.6 2.78-.41 6.89 1.15 9.14.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23a9.87 9.87 0 0 0 1.25-2.57 3.98 3.98 0 0 1-2.38-3.68ZM14.1 5.98A4 4 0 0 0 15.04 3a4.08 4.08 0 0 0-2.64 1.36 3.8 3.8 0 0 0-.96 2.87 3.37 3.37 0 0 0 2.66-1.25Z" />
    </svg>
  );
}

const providers: Record<SocialProvider, { label: string; icon: React.ReactNode }> = {
  google: { label: "Google", icon: <GoogleMark /> },
  apple: { label: "Apple", icon: <AppleMark /> },
};

export type SocialAuthButtonsProps = {
  providers?: SocialProvider[];
  /** Starts the provider's OAuth redirect or popup. Reject to re-enable the buttons. */
  onSelect: (provider: SocialProvider) => void | Promise<void>;
  /** "Continue" for sign-in and sign-up alike (the provider decides which). */
  verb?: string;
  layout?: "stack" | "row";
  /** Divider text above or below the buttons; false to hide. */
  divider?: string | false;
  dividerPosition?: "top" | "bottom";
  disabled?: boolean;
  className?: string;
};

/** "Continue with Google / Apple". One provider at a time shows busy; the others lock until it settles. */
export function SocialAuthButtons({
  providers: list = ["google", "apple"],
  onSelect,
  verb = "Continue with",
  layout = "stack",
  divider = "or",
  dividerPosition = "top",
  disabled = false,
  className,
}: SocialAuthButtonsProps) {
  const [busy, setBusy] = useState<SocialProvider | null>(null);

  async function select(p: SocialProvider) {
    setBusy(p);
    try {
      await onSelect(p);
    } finally {
      setBusy(null);
    }
  }

  const dividerEl = divider ? <Divider label={divider} /> : null;

  return (
    <div data-slot="social-auth" className={cn("flex flex-col gap-4", className)}>
      {dividerPosition === "top" && dividerEl}
      <div className={cn("grid gap-3", layout === "row" && "sm:grid-cols-2")}>
        {list.map((p) => (
          <Button
            key={p}
            variant="secondary"
            size="lg"
            fullWidth
            loading={busy === p}
            disabled={disabled || (busy !== null && busy !== p)}
            leadingIcon={providers[p].icon}
            aria-label={`${verb} ${providers[p].label}`}
            onClick={() => select(p)}
          >
            {layout === "row" ? providers[p].label : `${verb} ${providers[p].label}`}
          </Button>
        ))}
      </div>
      {dividerPosition === "bottom" && dividerEl}
    </div>
  );
}
