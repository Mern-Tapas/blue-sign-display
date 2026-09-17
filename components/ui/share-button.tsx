"use client";

import { useState } from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { Check, Link2, Mail, MessageCircle, Send, Share2 } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { cn } from "@/lib/cn";
import { useHydrated } from "@/lib/use-hydrated";
import { Button } from "./button";
import { copyText } from "./copy-button";
import { IconButton } from "./icon-button";

export type ShareButtonProps = {
  /** Shared title (product name). */
  title: string;
  text?: string;
  /** Defaults to the current page URL at click time. */
  url?: string;
  appearance?: "icon" | "button";
  variant?: "secondary" | "ghost" | "sunken";
  size?: "sm" | "md";
  label?: string;
  className?: string;
};

/**
 * Uses the system share sheet where available (most phones). Elsewhere it opens a small
 * menu: copy link, WhatsApp, Telegram and email — the channels Indian shoppers use most.
 */
export function ShareButton({
  title,
  text,
  url,
  appearance = "icon",
  variant = "secondary",
  size = "md",
  label = "Share",
  className,
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const hydrated = useHydrated();

  const resolveUrl = () => url ?? window.location.href;
  const pageUrl = url ?? (hydrated ? window.location.href : "");
  const body = text ?? title;

  async function onOpenChange(next: boolean) {
    if (next && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url: resolveUrl() });
        return;
      } catch (err) {
        // User dismissed the sheet: do nothing. Other failures fall back to the menu.
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    setOpen(next);
    if (!next) setCopied(false);
  }

  async function copyLink() {
    const ok = await copyText(resolveUrl());
    if (ok) {
      setCopied(true);
      toast({ title: "Link copied", tone: "success" });
    }
  }

  const targets = [
    { label: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(`${body} ${pageUrl}`)}` },
    { label: "Telegram", icon: Send, href: `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(body)}` },
    { label: "Email", icon: Mail, href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${body}\n${pageUrl}`)}` },
  ];

  const row =
    "state-layer focus-ring-row relative flex h-row-sm w-full items-center gap-3 rounded-md px-3 text-body text-fg outline-none transition-colors duration-(--dur-instant) [&_svg]:size-icon-md [&_svg]:text-fg-muted";

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        {appearance === "button" ? (
          <Button variant={variant === "sunken" ? "soft" : variant} size={size} leadingIcon={<Share2 aria-hidden />} className={className}>
            {label}
          </Button>
        ) : (
          <IconButton label={`${label} ${title}`} variant={variant} size={size} className={className}>
            <Share2 aria-hidden />
          </IconButton>
        )}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="share-menu"
          aria-label={`Share ${title}`}
          sideOffset={8}
          align="end"
          collisionPadding={16}
          className={cn(
            "z-(--z-popover) w-56 rounded-xl bg-surface-raised p-1.5 text-fg shadow-popover outline-none",
            "origin-(--radix-popover-content-transform-origin) data-[state=closed]:animate-scale-out data-[state=open]:animate-scale-in",
          )}
        >
          <p className="px-3 pt-1.5 pb-1 text-caption text-fg-muted">Share via</p>
          <button type="button" onClick={copyLink} className={row}>
            {copied ? <Check aria-hidden className="text-success-fg!" /> : <Link2 aria-hidden />}
            {copied ? "Link copied" : "Copy link"}
          </button>
          {targets.map((t) => (
            <a
              key={t.label}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={row}
            >
              <t.icon aria-hidden />
              {t.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
