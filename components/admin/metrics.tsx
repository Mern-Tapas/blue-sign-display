import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Sparkline } from "@/components/charts/small-charts";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

/* ---------------------------------------------------------------- MetricDelta */

export type MetricDeltaProps = {
  /** Percentage change vs the comparison period. */
  value: number;
  /** "vs previous 30 days" */
  period?: string;
  /** Whether a rise is good (revenue) or bad (return rate, RTO). */
  goodDirection?: "up" | "down";
  className?: string;
};

/** Signed change with an arrow + words, coloured by whether the direction is good — never colour alone. */
export function MetricDelta({ value, period, goodDirection = "up", className }: MetricDeltaProps) {
  const flat = Math.abs(value) < 0.05;
  const up = value > 0;
  const good = flat ? null : up === (goodDirection === "up");
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;
  return (
    <span data-slot="metric-delta" className={cn("inline-flex items-center gap-1.5 text-caption", className)}>
      <span className={cn("inline-flex items-center gap-0.5 font-medium figures", good === null ? "text-fg-muted" : good ? "text-success-fg" : "text-danger-fg")}>
        <Icon aria-hidden className="size-icon-sm" />
        {flat ? "No change" : `${up ? "+" : "−"}${formatNumber(Math.abs(value), { maximumFractionDigits: 1 })}%`}
        <span className="sr-only">{good === null ? "" : good ? " (better)" : " (worse)"}</span>
      </span>
      {period && <span className="text-fg-muted">{period}</span>}
    </span>
  );
}

/* ---------------------------------------------------------------- KpiTile */

export type KpiTileProps = {
  label: string;
  /** Pre-formatted value (₹12.4L, 1,284, 3.2%). */
  value: string;
  delta?: MetricDeltaProps;
  /** 8–14 points; the latest point is highlighted. */
  trend?: number[];
  href?: string;
  /** One line of context under the value ("38 awaiting dispatch"). */
  note?: React.ReactNode;
  className?: string;
};

/**
 * One headline number with its change and, optionally, a sparkline of the same metric.
 * Value uses proportional figures (large standalone number); the whole tile links when `href` is set.
 */
export function KpiTile({ label, value, delta, trend, href, note, className }: KpiTileProps) {
  return (
    <Card padding="sm" className={cn("relative min-w-0 gap-2", href && "lift", className)} data-slot="kpi-tile">
      <p className="text-label text-fg-muted">
        {href ? (
          <Link href={href} className="focus-ring-card [--focus-card-radius:var(--radius-2xl)] after:absolute after:inset-0">
            {label}
          </Link>
        ) : (
          label
        )}
      </p>
      <div className="flex items-end justify-between gap-3">
        <p className="text-figure-lg">{value}</p>
        {trend && <Sparkline values={trend} className="mb-1.5" />}
      </div>
      {(delta || note) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {delta && <MetricDelta {...delta} />}
          {note && <span className="text-caption text-fg-muted">{note}</span>}
        </div>
      )}
    </Card>
  );
}

/** Responsive row of KPI tiles (1 → 2 → 4 columns). */
export function KpiRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>{children}</div>;
}

/* ---------------------------------------------------------------- Meter */

export type MeterProps = {
  label: string;
  value: number;
  max: number;
  /** Shown on the right, e.g. "₹38,400 of ₹50,000". */
  valueLabel?: string;
  /** Fractions of max where the fill turns warning / danger. */
  thresholds?: { warning: number; danger: number };
  className?: string;
};

/** Usage against a limit (COD cap, storage, shipping credits). Severity changes the fill; the words state it. */
export function Meter({ label, value, max, valueLabel, thresholds = { warning: 0.75, danger: 0.9 }, className }: MeterProps) {
  const ratio = Math.min(1, Math.max(0, value / max));
  const tone = ratio >= thresholds.danger ? "danger" : ratio >= thresholds.warning ? "warning" : "accent";
  return (
    <div data-slot="meter" className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-body">{label}</span>
        <span className="text-caption text-fg-muted figures">{valueLabel ?? `${formatNumber(Math.round(ratio * 100))}%`}</span>
      </div>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${valueLabel ?? `${Math.round(ratio * 100)}%`}${tone === "danger" ? ", near limit" : tone === "warning" ? ", getting close" : ""}`}
        className={cn("h-2 overflow-hidden rounded-pill", tone === "danger" ? "bg-danger-soft" : tone === "warning" ? "bg-warning-soft" : "bg-accent-soft")}
      >
        <div className={cn("h-full rounded-pill", tone === "danger" ? "bg-danger" : tone === "warning" ? "bg-warning" : "bg-accent")} style={{ width: `${ratio * 100}%` }} />
      </div>
    </div>
  );
}
