"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

export type PaymentProcessingOverlayProps = {
  open: boolean;
  amount: number;
  /** "upi" waits for approval in an app; "redirect" covers bank / 3-D Secure pages. */
  kind?: "upi" | "redirect" | "processing";
  /** e.g. the UPI ID or bank the request was sent to. */
  target?: string;
  /** Seconds before the request expires. */
  timeoutSeconds?: number;
  onCancel: () => void;
  onTimeout: () => void;
};

const copy = {
  upi: { title: "Approve the payment in your UPI app", body: "Open the app linked to" },
  redirect: { title: "Completing payment with your bank", body: "Finish the steps on" },
  processing: { title: "Confirming your payment", body: "This usually takes a few seconds for" },
};

/**
 * Blocking wait while a payment is out of the shopper's hands. It can't be dismissed by accident,
 * shows the remaining time, warns against going back, and offers an explicit cancel.
 */
export function PaymentProcessingOverlay({ open, amount, kind = "upi", target, timeoutSeconds = 300, onCancel, onTimeout }: PaymentProcessingOverlayProps) {
  const [remaining, setRemaining] = useState(timeoutSeconds);
  const timeoutRef = useRef(onTimeout);

  useEffect(() => {
    timeoutRef.current = onTimeout;
  });

  useEffect(() => {
    if (!open) return;
    const started = Date.now();
    const t = window.setInterval(() => {
      const left = Math.max(0, timeoutSeconds - Math.floor((Date.now() - started) / 1000));
      setRemaining(left);
      if (left === 0) {
        window.clearInterval(t);
        timeoutRef.current();
      }
    }, 500);
    return () => window.clearInterval(t);
  }, [open, timeoutSeconds]);

  const c = copy[kind];
  const mm = Math.floor(remaining / 60);
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <DialogPrimitive.Root open={open}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-(--z-overlay) bg-overlay backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <DialogPrimitive.Content
          data-slot="payment-processing"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="fixed top-1/2 left-1/2 z-(--z-modal) flex w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-5 rounded-2xl bg-surface p-8 text-center shadow-modal outline-none data-[state=open]:animate-scale-in"
        >
          <span aria-hidden className="relative flex size-20 items-center justify-center rounded-pill bg-accent-soft text-accent-soft-fg">
            {kind === "upi" ? <Smartphone className="size-8" /> : <Spinner size="lg" label="" />}
            {kind === "upi" && <span className="absolute inset-0 rounded-pill border-2 border-accent/40 motion-safe:animate-ping" />}
          </span>
          <div className="flex flex-col gap-1.5">
            <DialogPrimitive.Title className="text-heading-sm">{c.title}</DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-body text-fg-muted">
              {c.body} <span className="text-body-strong text-fg">{target ?? "your account"}</span> and pay{" "}
              <span className="text-body-strong text-fg figures">{formatPrice(amount)}</span>.
            </DialogPrimitive.Description>
          </div>
          {kind !== "processing" && (
            <p className={cn("text-figure-lg figures", remaining <= 30 && "text-warning-fg")} role="timer" aria-label={`${mm} minutes ${ss} seconds left`}>
              {mm}:{ss}
            </p>
          )}
          <p aria-live="polite" className="text-caption text-fg-muted">
            Don’t close this page or press back until the payment is complete.
          </p>
          <Button variant="ghost" onClick={onCancel}>
            Cancel payment
          </Button>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
