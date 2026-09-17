"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";

/** Code snippet with a copy button. Monospace is used for code only. */
export function DsCode({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable (insecure context) — leave button state unchanged */
    }
  }

  return (
    <div data-slot="ds-code" className={cn("group/code relative bg-surface-sunken", className)}>
      <pre className="overflow-x-auto py-3.5 pr-14 pl-5 font-mono text-caption leading-relaxed text-fg">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="press state-layer hit-area absolute top-2 right-2 flex size-control-sm items-center justify-center rounded-pill text-fg-muted transition-[color,transform] duration-(--dur-fast) hover:text-fg"
      >
        {copied ? <Check aria-hidden className="size-icon-md text-success" /> : <Copy aria-hidden className="size-icon-md" />}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Code copied to clipboard" : ""}
      </span>
    </div>
  );
}
