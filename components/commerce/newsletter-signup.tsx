"use client";

import { useState } from "react";
import { ArrowRight, CircleCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cardVariants } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type NewsletterSignupProps = {
  variant?: "surface" | "contrast" | "accent";
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Called with the email; resolve to finish. */
  onSubscribe?: (email: string) => Promise<void> | void;
  className?: string;
};

export function NewsletterSignup({
  variant = "surface",
  title = "Get 10% off your first order",
  description = "Drops, restocks and members-only offers. One email a week, unsubscribe anytime.",
  onSubscribe,
  className,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "done">("idle");
  const onDark = variant !== "surface";
  const onColorFg = variant === "accent" ? "text-fg-on-accent" : "text-fg-on-contrast";
  const onColorMuted = variant === "accent" ? "text-fg-on-accent-muted" : "text-fg-on-contrast-muted";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("pending");
    await (onSubscribe?.(email) ?? new Promise((r) => setTimeout(r, 700)));
    setStatus("done");
  }

  return (
    <section
      data-slot="newsletter"
      className={cn(
        "@container",
        variant === "surface" && cn(cardVariants({ padding: "none" }), "p-6 sm:p-8"),
        variant === "accent" && "rounded-2xl bg-accent p-6 text-fg-on-accent sm:p-8",
        variant === "contrast" && "text-fg-on-contrast",
        className,
      )}
    >
      {/* Container query: stacks inside narrow columns regardless of viewport width */}
      <div className="flex flex-col gap-6 @3xl:flex-row @3xl:items-center @3xl:justify-between">
      <div className="max-w-md">
        <h2 className={cn("text-heading-lg", onDark && onColorFg)}>{title}</h2>
        <p className={cn("mt-2 text-body", onDark ? onColorMuted : "text-fg-muted")}>{description}</p>
      </div>
      {status === "done" ? (
        <p role="status" className={cn("flex items-center gap-2 text-body-lg font-medium", onDark ? onColorFg : "text-success-fg")}>
          <CircleCheck aria-hidden className="size-icon-lg" /> You’re on the list. Check your inbox.
        </p>
      ) : (
        <form
          onSubmit={submit}
          className={cn(
            "flex w-full max-w-md items-center gap-1 rounded-pill p-1.5 focus-ring-inset",
            onDark ? cn("bg-tile-on-color", onColorFg) : "bg-surface-sunken text-fg",
          )}
        >
          <Mail aria-hidden className={cn("ml-3 size-icon-md shrink-0", onDark ? onColorMuted : "text-fg-muted")} />
          <label htmlFor={`newsletter-${variant}`} className="sr-only">
            Email address
          </label>
          <input
            id={`newsletter-${variant}`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={cn(
              "h-10 min-w-0 flex-1 bg-transparent px-2 text-body outline-none",
              onDark ? (variant === "accent" ? "placeholder:text-fg-on-accent-muted" : "placeholder:text-fg-on-contrast-muted") : "placeholder:text-fg-placeholder",
            )}
          />
          <Button
            type="submit"
            loading={status === "pending"}
            variant={onDark ? "inverse" : "primary"}
            trailingIcon={<ArrowRight aria-hidden />}


          >
            Subscribe
          </Button>
        </form>
      )}
      </div>
    </section>
  );
}
