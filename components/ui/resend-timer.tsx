"use client";

import { useEffect, useState } from "react";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/cn";

function mmss(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export type ResendTimerProps = {
  /** Cooldown in seconds before the action unlocks. */
  seconds?: number;
  /** Called when the shopper resends; may return a promise (the button shows a busy state). */
  onResend: () => void | Promise<void>;
  label?: string;
  /** Remaining attempts; at 0 the action stays locked with `exhaustedText`. */
  attemptsLeft?: number;
  exhaustedText?: React.ReactNode;
  /** Start with the cooldown running (default). False shows the action immediately; the cooldown starts after the first resend. */
  startLocked?: boolean;
  className?: string;
};

/**
 * "Resend OTP in 0:24" countdown that turns into a Resend action. Time is measured from
 * Date.now() so background tabs stay accurate; state only changes inside the interval.
 * The ticking digits are hidden from screen readers — only the unlock is announced.
 */
export function ResendTimer({
  seconds = 30,
  onResend,
  label = "Resend OTP",
  attemptsLeft,
  exhaustedText = "Too many attempts. Try again later.",
  startLocked = true,
  className,
}: ResendTimerProps) {
  const [remaining, setRemaining] = useState(startLocked ? seconds : 0);
  const [round, setRound] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (round === 0 && !startLocked) return;
    const started = Date.now();
    const id = window.setInterval(() => {
      const left = Math.max(0, seconds - Math.floor((Date.now() - started) / 1000));
      setRemaining(left);
      if (left === 0) window.clearInterval(id);
    }, 250);
    return () => window.clearInterval(id);
  }, [seconds, round, startLocked]);

  async function resend() {
    setBusy(true);
    try {
      await onResend();
      setRemaining(seconds);
      setRound((r) => r + 1);
    } finally {
      setBusy(false);
    }
  }

  const exhausted = attemptsLeft !== undefined && attemptsLeft <= 0;

  return (
    <div data-slot="resend-timer" aria-live="polite" className={cn("flex min-h-control-xs items-center text-body text-fg-muted", className)}>
      {exhausted ? (
        <p>{exhaustedText}</p>
      ) : remaining > 0 ? (
        <p>
          <span className="sr-only">{label} will be available shortly</span>
          <span aria-hidden>
            {label} in <span className="text-fg figures">{mmss(remaining)}</span>
          </span>
        </p>
      ) : (
        <button
          type="button"
          onClick={resend}
          disabled={busy}
          aria-busy={busy || undefined}
          className="hit-area relative -mx-1 inline-flex items-center gap-1.5 rounded-xs px-1 font-medium text-accent-fg underline-offset-4 hover:underline disabled:cursor-progress disabled:text-fg-muted"
        >
          <RotateCw aria-hidden className={cn("size-icon-sm", busy && "motion-safe:animate-spin")} />
          {label}
          {attemptsLeft !== undefined && <span className="font-normal text-fg-muted">· {attemptsLeft} left</span>}
        </button>
      )}
    </div>
  );
}
