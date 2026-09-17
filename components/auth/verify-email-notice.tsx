"use client";

import { MailOpen } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { IconTile } from "@/components/ui/icon-tile";
import { ResendTimer } from "@/components/ui/resend-timer";
import { cn } from "@/lib/cn";

export type VerifyEmailNoticeProps = {
  email: string;
  onResend: () => Promise<void>;
  onChangeEmail?: () => void;
  /** Lets shoppers keep going and verify later (checkout still works). */
  onContinue?: () => void;
  continueLabel?: string;
  /** Common inbox shortcuts; omit to hide. */
  inboxLinks?: { label: string; href: string }[];
  variant?: "page" | "banner";
  className?: string;
};

const defaultInboxes = [
  { label: "Open Gmail", href: "https://mail.google.com/mail/u/0/#search/from%3Abluesigns" },
  { label: "Open Outlook", href: "https://outlook.live.com/mail/0/" },
];

/**
 * "Check your inbox" after sign-up or an email change. The page variant is a full step; the
 * banner variant sits on the account page until the address is confirmed.
 */
export function VerifyEmailNotice({
  email,
  onResend,
  onChangeEmail,
  onContinue,
  continueLabel = "Continue shopping",
  inboxLinks = defaultInboxes,
  variant = "page",
  className,
}: VerifyEmailNoticeProps) {
  if (variant === "banner") {
    return (
      <Alert
        data-slot="verify-email-banner"
        role="status"
        tone="warning"
        size="md"
        icon={<MailOpen aria-hidden />}
        action={<ResendTimer seconds={30} startLocked={false} label="Resend link" onResend={onResend} className="text-warning-fg [&_button]:text-warning-fg" />}
        // Phones: the resend action drops under the copy, aligned with the text
        className={cn("max-sm:flex-wrap max-sm:[&>div:last-child]:basis-full max-sm:[&>div:last-child]:pl-7.5", className)}
      >
        <p>
          <span className="font-medium">Confirm your email.</span> We sent a link to <span className="font-medium break-all">{email}</span>. Invoices and
          password resets go there.
        </p>
      </Alert>
    );
  }

  return (
    <div data-slot="verify-email-notice" className={cn("flex flex-col gap-5", className)}>
      <div className="flex flex-col items-start gap-3">
        <IconTile size="lg" tone="accent">
          <MailOpen />
        </IconTile>
        <p className="text-body text-fg-muted">
          We sent a verification link to <span className="font-medium break-all text-fg">{email}</span>. Open it on any device to confirm your
          account. The link expires in 24 hours.
        </p>
      </div>
      {inboxLinks.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {inboxLinks.map((l) => (
            <Button key={l.href} asChild variant="secondary" size="lg" fullWidth>
              <a href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Button>
          ))}
        </div>
      )}
      <ul className="flex flex-col gap-1.5 text-caption text-fg-muted">
        <li>Not there? Check spam, promotions or updates folders.</li>
        <li>Make sure {email} is spelled correctly.</li>
      </ul>
      <ResendTimer seconds={30} label="Resend link" onResend={onResend} />
      <div className="flex flex-wrap gap-2">
        {onContinue && <Button onClick={onContinue}>{continueLabel}</Button>}
        {onChangeEmail && (
          <Button variant="ghost" onClick={onChangeEmail}>
            Change email
          </Button>
        )}
      </div>
    </div>
  );
}
