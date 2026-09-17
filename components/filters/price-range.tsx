"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/cn";

export type PriceRangeProps = {
  min: number;
  max: number;
  value: [number, number] | null;
  /** Fired on slider release / input blur, not on every drag tick. */
  onValueCommit: (value: [number, number] | null) => void;
  step?: number;
  currencySymbol?: string;
  className?: string;
};

function PriceInput({
  label,
  value,
  onChange,
  onCommit,
  symbol,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  onCommit: () => void;
  symbol: string;
}) {
  return (
    <label className="flex h-control-md min-w-0 flex-1 items-center gap-1 rounded-pill border border-border bg-surface px-3 text-body transition-[border-color] duration-(--dur-fast) hover:border-border-strong focus-ring-inset">
      <span className="sr-only">{label}</span>
      <span className="text-fg-muted">{symbol}</span>
      <input
        inputMode="numeric"
        value={value}
        aria-label={`${label} price`}
        onChange={(e) => {
          const n = Number(e.target.value.replace(/\D/g, ""));
          if (Number.isFinite(n)) onChange(n);
        }}
        onBlur={onCommit}
        onKeyDown={(e) => e.key === "Enter" && onCommit()}
        className="w-full min-w-0 bg-transparent font-medium outline-none figures"
      />
    </label>
  );
}

export function PriceRange({ min, max, value, onValueCommit, step = 100, currencySymbol = "₹", className }: PriceRangeProps) {
  const committed: [number, number] = value ?? [min, max];
  // Local draft while dragging/typing; re-synced when the committed value changes.
  const [draft, setDraft] = useState<{ source: [number, number]; value: [number, number] }>({ source: committed, value: committed });
  const current =
    draft.source[0] === committed[0] && draft.source[1] === committed[1] ? draft.value : committed;
  const setCurrent = (v: [number, number]) => setDraft({ source: committed, value: v });

  const commit = (v: [number, number]) => {
    const lo = Math.max(min, Math.min(v[0], v[1]));
    const hi = Math.min(max, Math.max(v[0], v[1]));
    setCurrent([lo, hi]);
    onValueCommit(lo === min && hi === max ? null : [lo, hi]);
  };

  return (
    <div data-slot="price-range" className={cn("flex flex-col gap-4", className)}>
      <Slider
        min={min}
        max={max}
        step={step}
        value={current}
        onValueChange={(v) => setCurrent([v[0]!, v[1]!])}
        onValueCommit={(v) => commit([v[0]!, v[1]!])}
        thumbLabels={["Minimum price", "Maximum price"]}
        minStepsBetweenThumbs={1}
      />
      <div className="flex items-center gap-2">
        <PriceInput label="Min" symbol={currencySymbol} value={current[0]} onChange={(n) => setCurrent([n, current[1]])} onCommit={() => commit(current)} />
        <span aria-hidden className="text-fg-subtle">–</span>
        <PriceInput label="Max" symbol={currencySymbol} value={current[1]} onChange={(n) => setCurrent([current[0], n])} onCommit={() => commit(current)} />
      </div>
    </div>
  );
}
