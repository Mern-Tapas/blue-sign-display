"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { cn } from "@/lib/cn";
import { Button, type ButtonProps } from "./button";
import { IconButton, type IconButtonProps } from "./icon-button";

/** Clipboard write with a textarea fallback for older browsers and non-secure contexts. */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    el.remove();
    return ok;
  }
}

type Shared = {
  value: string;
  /** Visible / accessible label before copying. */
  label?: string;
  copiedLabel?: string;
  /** Also raise a toast (for icon-only buttons far from where attention is). */
  notify?: boolean;
  onCopied?: (value: string) => void;
};

export type CopyButtonProps = Shared &
  (
    | ({ appearance?: "icon" } & Omit<IconButtonProps, "label" | "onClick" | "children" | "value">)
    | ({ appearance: "button" } & Omit<ButtonProps, "onClick" | "children" | "value">)
    | ({ appearance: "inline" } & { className?: string })
  );

/**
 * Copies a coupon code, AWB number, UPI ID or link. The icon swaps to a check for 2 s and a
 * polite live region says "Copied" so the confirmation isn't visual-only.
 */
export function CopyButton({ value, label = "Copy", copiedLabel = "Copied", notify = false, onCopied, ...rest }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    const ok = await copyText(value);
    if (!ok) {
      toast({ title: "Couldn’t copy", description: "Select the text and copy it manually.", tone: "danger" });
      return;
    }
    setCopied(true);
    onCopied?.(value);
    if (notify) toast({ title: copiedLabel, description: value, tone: "success" });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  const icon = copied ? <Check aria-hidden className="text-success-fg" /> : <Copy aria-hidden />;
  const live = (
    <span aria-live="polite" className="sr-only">
      {copied ? `${copiedLabel}: ${value}` : ""}
    </span>
  );

  if (rest.appearance === "button") {
    const { appearance: _a, ...buttonProps } = rest;
    void _a;
    return (
      <>
        <Button variant="secondary" size="sm" leadingIcon={icon} onClick={copy} {...buttonProps}>
          {copied ? copiedLabel : label}
        </Button>
        {live}
      </>
    );
  }

  if (rest.appearance === "inline") {
    return (
      <>
        <button
          type="button"
          onClick={copy}
          className={cn(
            "hit-area relative inline-flex items-center gap-1 rounded-xs text-label font-medium text-accent-fg underline-offset-4 hover:underline [&_svg]:size-icon-sm",
            rest.className,
          )}
        >
          {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
          {copied ? copiedLabel : label}
        </button>
        {live}
      </>
    );
  }

  const { appearance: _b, size = "sm", variant = "ghost", ...iconProps } = rest;
  void _b;
  return (
    <>
      <IconButton label={copied ? copiedLabel : `${label} ${value}`} size={size} variant={variant} onClick={copy} {...iconProps}>
        {icon}
      </IconButton>
      {live}
    </>
  );
}
