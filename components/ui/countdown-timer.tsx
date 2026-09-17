"use client";

import { useEffect, useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import { useNow } from "@/lib/use-now";

export function splitDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    total,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

const blockVariants = cva("flex min-w-9 flex-col items-center justify-center rounded-sm px-1.5 py-1 figures", {
  variants: {
    tone: {
      neutral: "bg-surface-sunken text-fg",
      contrast: "bg-surface-contrast text-fg-on-contrast",
      accent: "bg-accent text-fg-on-accent",
      /** For use on accent / photo panels. */
      "on-color": "bg-tile-on-color text-fg-on-contrast",
    },
    size: { sm: "text-label", md: "text-heading-sm", lg: "text-heading-md min-w-12 py-1.5" },
  },
  defaultVariants: { tone: "neutral", size: "md" },
});

export type CountdownTimerProps = VariantProps<typeof blockVariants> & {
  /** When the offer really ends (Date, ISO string or epoch ms). */
  endsAt: Date | string | number;
  variant?: "blocks" | "inline";
  /** Prefix for the inline variant and the accessible name. */
  label?: string;
  /** Shown once the time is up. */
  expiredText?: React.ReactNode;
  onExpire?: () => void;
  /** Hide the seconds column for long offers (less motion). */
  showSeconds?: boolean;
  className?: string;
};

/**
 * Countdown to a real deadline. Uses the shared 1 s clock (`useNow`), renders a neutral
 * placeholder until hydration, and exposes a minute-level accessible name instead of
 * announcing every second.
 */
export function CountdownTimer({
  endsAt,
  variant = "blocks",
  label = "Ends in",
  expiredText = "Offer ended",
  onExpire,
  showSeconds = true,
  tone,
  size,
  className,
}: CountdownTimerProps) {
  const now = useNow();
  const end = new Date(endsAt).getTime();
  const remaining = now === null ? null : end - now;
  const parts = splitDuration(remaining ?? 0);
  const expired = remaining !== null && remaining <= 0;

  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  });
  useEffect(() => {
    if (expired) onExpireRef.current?.();
  }, [expired]);

  if (expired) {
    return (
      <span data-slot="countdown" className={cn("text-label text-fg-muted", className)}>
        {expiredText}
      </span>
    );
  }

  const units = [
    ...(parts.days > 0 ? [{ key: "d", value: parts.days, short: "d", long: parts.days === 1 ? "day" : "days" }] : []),
    { key: "h", value: parts.hours, short: "h", long: "hrs" },
    { key: "m", value: parts.minutes, short: "m", long: "mins" },
    ...(showSeconds ? [{ key: "s", value: parts.seconds, short: "s", long: "secs" }] : []),
  ];

  const spoken =
    remaining === null
      ? label
      : `${label} ${[parts.days && `${parts.days} days`, `${parts.hours} hours`, `${parts.minutes} minutes`].filter(Boolean).join(" ")}`;

  if (variant === "inline") {
    return (
      <span data-slot="countdown" role="timer" aria-label={spoken} className={cn("inline-flex items-center gap-1.5 text-label figures", className)}>
        <Clock aria-hidden className="size-icon-sm shrink-0" />
        <span aria-hidden>
          {label}{" "}
          <span className="font-medium">
            {remaining === null ? "--h --m" : units.map((u) => `${pad(u.value)}${u.short}`).join(" ")}
          </span>
        </span>
      </span>
    );
  }

  return (
    <span data-slot="countdown" role="timer" aria-label={spoken} className={cn("inline-flex items-center gap-1", className)}>
      {units.map((u, i) => (
        <span key={u.key} aria-hidden className="flex items-center gap-1">
          {i > 0 && <span className="text-label">:</span>}
          <span className={blockVariants({ tone, size })}>
            <span className="font-medium">{remaining === null ? "--" : pad(u.value)}</span>
            {size !== "sm" && <span className="text-caption leading-3 font-normal">{u.long}</span>}
          </span>
        </span>
      ))}
    </span>
  );
}
