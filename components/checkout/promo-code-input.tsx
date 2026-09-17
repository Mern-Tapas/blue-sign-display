"use client";

import { useState } from "react";
import { BadgePercent, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

export type PromoResult = { ok: true; label: string } | { ok: false; error: string };

export type PromoCodeInputProps = {
  /** Validate a code. Return a label for a valid code or an error message. */
  onApply: (code: string) => PromoResult | Promise<PromoResult>;
  onRemove?: () => void;
  className?: string;
};

export function PromoCodeInput({ onApply, onRemove, className }: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [applied, setApplied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function apply(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setPending(true);
    setError(null);
    const result = await onApply(code.trim().toUpperCase());
    setPending(false);
    if (result.ok) {
      setApplied(result.label);
      setCode("");
    } else {
      setError(result.error);
    }
  }

  if (applied) {
    return (
      <div
        className={cn(
          "flex h-11 items-center gap-2 rounded-pill bg-success-soft pr-1.5 pl-4 text-body text-success-fg",
          className,
        )}
      >
        <Check aria-hidden className="size-icon-md" />
        <span className="flex-1 text-body-strong">{applied}</span>
        <button
          type="button"
          aria-label="Remove promo code"
          onClick={() => {
            setApplied(null);
            onRemove?.();
          }}
          className="state-layer hit-area relative flex size-8 items-center justify-center rounded-pill"
        >
          <X aria-hidden className="size-icon-md" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={apply} className={cn("flex flex-col gap-1.5", className)}>
      <Input
        aria-label="Promo code"
        placeholder="Promo code"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          setError(null);
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "promo-error" : undefined}
        startSlot={<BadgePercent aria-hidden />}
        wrapperClassName="pr-1"
        className="uppercase placeholder:normal-case"
        endSlot={
          <Button type="submit" size="sm" variant="neutral" loading={pending} disabled={!code.trim()}>
            Apply
          </Button>
        }
      />
      {error && (
        <p id="promo-error" role="alert" className="px-4 text-caption text-danger-fg">
          {error}
        </p>
      )}
    </form>
  );
}
