"use client";

import { useState } from "react";
import Link from "next/link";
import { CloudOff, RotateCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export type ErrorStateProps = {
  title?: string;
  description?: string;
  /** Retry; may return a promise so the button shows progress. */
  onRetry?: () => void | Promise<void>;
  /** A safe place to go instead. */
  secondaryAction?: { label: string; href: string };
  /** Next.js error digest, shown so support can find the log. */
  digest?: string;
  /** "network" swaps the icon and default copy for connection problems. */
  kind?: "generic" | "network";
  /** "page" for route-level errors (heading, generous spacing); "inline" for a failed section. */
  size?: "page" | "inline";
  /** Heading element for size="page" (h2 inside a page that already has an h1). */
  headingAs?: "h1" | "h2";
  className?: string;
};

/**
 * What went wrong, what the shopper can do, and a way out. Never shows stack traces; the digest
 * is the only technical detail, labelled as a reference for support.
 */
export function ErrorState({
  kind = "generic",
  title = kind === "network" ? "Can’t connect right now" : "Something went wrong",
  size = "page",
  description = kind === "network" ? "Check your internet connection, then try again. Your bag is saved." : size === "page" ? "We couldn’t load this page. It’s usually temporary, so try again in a moment." : "This part of the page didn’t load. Try again.",
  onRetry,
  secondaryAction,
  digest,
  headingAs = "h1",
  className,
}: ErrorStateProps) {
  const [busy, setBusy] = useState(false);
  const Heading = size === "page" ? headingAs : "p";

  return (
    <div
      data-slot="error-state"
      role={size === "inline" ? "alert" : undefined}
      className={cn("flex flex-col items-center justify-center text-center", size === "page" ? "gap-3 px-6 py-16 sm:py-24" : "gap-2 rounded-2xl bg-surface-sunken px-4 py-8", className)}
    >
      <span aria-hidden className={cn("mb-1 flex items-center justify-center rounded-pill bg-danger-soft text-danger-fg", size === "page" ? "size-16 [&_svg]:size-7" : "size-12 [&_svg]:size-5")}>
        {kind === "network" ? <CloudOff /> : <TriangleAlert />}
      </span>
      <Heading className={cn("font-medium text-fg", size === "page" ? "text-heading-md" : "text-body-lg")}>{title}</Heading>
      <p className="max-w-sm text-body text-fg-muted">{description}</p>
      {(onRetry || secondaryAction) && (
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {onRetry && (
            <Button
              leadingIcon={<RotateCw aria-hidden />}
              loading={busy}
              size={size === "inline" ? "sm" : "md"}
              onClick={async () => {
                setBusy(true);
                try {
                  await onRetry();
                } finally {
                  setBusy(false);
                }
              }}
            >
              Try again
            </Button>
          )}
          {secondaryAction && (
            <Button asChild variant="secondary" size={size === "inline" ? "sm" : "md"}>
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          )}
        </div>
      )}
      {digest && <p className="mt-2 text-caption text-fg-muted">Reference for support: <span className="figures select-all">{digest}</span></p>}
    </div>
  );
}
