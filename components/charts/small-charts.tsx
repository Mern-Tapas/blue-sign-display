import { cn } from "@/lib/cn";
import { CHART_ORDINAL, CHART_OTHER, formatValue, slotColor, type ValueFormat } from "./scales";

/* ---------------------------------------------------------------- Sparkline */

export type SparklineProps = {
  values: number[];
  width?: number;
  height?: number;
  /** Highlights the current (last) point in the accent; history stays de-emphasised. */
  className?: string;
};

/** Decorative trend next to a stat value; the value and delta beside it carry the meaning. */
export function Sparkline({ values, width = 96, height = 32, className }: SparklineProps) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const px = (i: number) => 2 + (i / (values.length - 1)) * (width - 6);
  const py = (v: number) => height - 3 - ((v - min) / span) * (height - 6);
  const d = values.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join("");
  const last = values.length - 1;
  return (
    <svg aria-hidden width={width} height={height} className={cn("block overflow-visible", className)}>
      <path d={d} fill="none" stroke={CHART_OTHER} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={px(last)} cy={py(values[last]!)} r={3} fill="var(--chart-1)" stroke="var(--surface)" strokeWidth={1.5} />
    </svg>
  );
}

/* ---------------------------------------------------------------- Part-to-whole bar */

export type ShareSegment = { id: string; label: string; value: number; slot: number };

export type ShareBarProps = {
  segments: ShareSegment[];
  format?: ValueFormat;
  /** Accessible name, e.g. "Payment mix, last 30 days". */
  label: string;
  /** Show absolute values next to the share (off when values are already shares). */
  showValues?: boolean;
  className?: string;
};

/**
 * Part-to-whole on one stacked bar with a 2px surface gap between segments and a legend that
 * carries every label, value and share — nothing is gated behind hover.
 */
export function ShareBar({ segments, format = "number", label, showValues = true, className }: ShareBarProps) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div data-slot="share-bar" className={cn("flex flex-col gap-3", className)}>
      <div role="img" aria-label={`${label}: ${segments.map((s) => `${s.label} ${Math.round((s.value / total) * 100)}%`).join(", ")}`} className="flex h-3 w-full gap-0.5 overflow-hidden rounded-pill">
        {segments.map((s) => (
          <span key={s.id} className="h-full first:rounded-l-pill last:rounded-r-pill" style={{ width: `${(s.value / total) * 100}%`, background: slotColor(s.slot) }} />
        ))}
      </div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-x-6 gap-y-2">
        {segments.map((s) => (
          <li key={s.id} className="flex items-center gap-2 text-body">
            <span aria-hidden className="size-2.5 shrink-0 rounded-xs" style={{ background: slotColor(s.slot) }} />
            <span className="min-w-0 flex-1 truncate">{s.label}</span>
            {showValues && <span className="text-fg-muted figures">{formatValue(s.value, format)}</span>}
            <span className="w-10 text-right text-body-strong figures">{Math.round((s.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------- Donut */

export type DonutProps = {
  segments: ShareSegment[];
  /** Figure in the centre (the total) and its caption. */
  centerValue: string;
  centerLabel: string;
  label: string;
  size?: number;
  format?: ValueFormat;
  showValues?: boolean;
  className?: string;
};

/** At-a-glance share for ≤5 segments only; comparisons of close values belong in a bar. */
export function Donut({ segments, centerValue, centerLabel, label, size = 160, format = "number", showValues = true, className }: DonutProps) {
  if (segments.length > 5) throw new Error("Donut supports at most 5 segments — use ShareBar or a bar chart.");
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  const gap = 3;
  const offsets = segments.map((_, i) => segments.slice(0, i).reduce((sum, x) => sum + (x.value / total) * c, 0));
  return (
    <div data-slot="donut" className={cn("flex flex-wrap items-center gap-6", className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} role="img" aria-label={`${label}: ${segments.map((s) => `${s.label} ${Math.round((s.value / total) * 100)}%`).join(", ")}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--chart-grid)" strokeWidth={14} />
          {segments.map((s, i) => {
            const dash = Math.max(0, (s.value / total) * c - gap);
            return <circle key={s.id} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={slotColor(s.slot)} strokeWidth={14} strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={-offsets[i]!} />;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-heading-sm">{centerValue}</span>
          <span className="text-caption text-fg-muted">{centerLabel}</span>
        </div>
      </div>
      <ul className="flex min-w-40 flex-1 flex-col gap-2">
        {segments.map((s) => (
          <li key={s.id} className="flex items-center gap-2 text-body">
            <span aria-hidden className="size-2.5 shrink-0 rounded-xs" style={{ background: slotColor(s.slot) }} />
            <span className="min-w-0 flex-1 truncate">{s.label}</span>
            {showValues && <span className="text-fg-muted figures">{formatValue(s.value, format)}</span>}
            <span className="w-10 text-right text-body-strong figures">{Math.round((s.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------- Funnel */

export type FunnelStage = { id: string; label: string; value: number };

/** Ordered stages on the ordinal ramp, with the count and step conversion visible for every stage. */
export function Funnel({ stages, label, format = "number", className }: { stages: FunnelStage[]; label: string; format?: ValueFormat; className?: string }) {
  const top = stages[0]?.value || 1;
  return (
    <ol aria-label={label} data-slot="funnel" className={cn("flex flex-col gap-3", className)}>
      {stages.map((s, i) => {
        const prev = stages[i - 1]?.value;
        const color = CHART_ORDINAL[Math.min(CHART_ORDINAL.length - 1, Math.round((i / Math.max(1, stages.length - 1)) * (CHART_ORDINAL.length - 1)))];
        return (
          <li key={s.id} className="grid grid-cols-[minmax(6rem,9rem)_1fr_auto] items-center gap-3">
            <span className="truncate text-body">{s.label}</span>
            <span className="h-6 w-full rounded-r-xs bg-transparent">
              <span className="block h-full rounded-r-xs" style={{ width: `${Math.max(1, (s.value / top) * 100)}%`, background: color }} />
            </span>
            <span className="flex w-28 items-baseline justify-end gap-2 text-right">
              <span className="text-body-strong figures">{formatValue(s.value, format)}</span>
              <span className="w-12 text-caption text-fg-muted figures">{prev ? `${Math.round((s.value / prev) * 100)}%` : ""}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
