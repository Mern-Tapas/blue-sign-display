// Pure scale + formatting helpers for the in-house SVG charts (server-safe).
import { formatCompact, formatNumber, formatPrice } from "@/lib/format";

/** Categorical slot colours in fixed order (D-064). Never cycle past the end — fold extra series into "Other". */
export const CHART_SLOTS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-6)"] as const;
export const CHART_OTHER = "var(--chart-other)";
export const CHART_ORDINAL = ["var(--chart-ord-1)", "var(--chart-ord-2)", "var(--chart-ord-3)", "var(--chart-ord-4)", "var(--chart-ord-5)"] as const;
export const CHART_SEQUENTIAL = ["var(--chart-seq-1)", "var(--chart-seq-2)", "var(--chart-seq-3)", "var(--chart-seq-4)", "var(--chart-seq-5)", "var(--chart-seq-6)", "var(--chart-seq-7)"] as const;

export function slotColor(slot: number) {
  if (slot < 0 || slot >= CHART_SLOTS.length) {
    throw new Error(`Chart slot ${slot} is out of range: fold series past ${CHART_SLOTS.length} into "Other".`);
  }
  return CHART_SLOTS[slot]!;
}

/** "Nice" tick values covering [min, max] with roughly `count` steps (1 / 2 / 2.5 / 5 × 10ⁿ). */
export function niceTicks(min: number, max: number, count = 4): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0];
  if (min === max) max = min + 1;
  const span = max - min;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count) ?? 10 * mag;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= end + step / 2; v += step) ticks.push(Math.round(v * 1e6) / 1e6);
  return ticks;
}

export function linearScale(domain: [number, number], range: [number, number]) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const k = d1 === d0 ? 0 : (r1 - r0) / (d1 - d0);
  return (v: number) => r0 + (v - d0) * k;
}

export type ValueFormat = "number" | "compact" | "inr" | "inr-compact" | "percent";

export function formatValue(v: number, format: ValueFormat = "number") {
  switch (format) {
    case "compact":
      return formatCompact(v);
    case "inr":
      return formatPrice(v);
    case "inr-compact":
      return `₹${formatCompact(v)}`;
    case "percent":
      return `${formatNumber(v, { maximumFractionDigits: 1 })}%`;
    default:
      return formatNumber(v);
  }
}

/** SVG path for a bar with a 4px rounded data-end and a square baseline end. */
export function barPath(x: number, y: number, w: number, h: number, orientation: "vertical" | "horizontal", radius = 4) {
  if (w <= 0 || h <= 0) return "";
  if (orientation === "vertical") {
    const r = Math.min(radius, w / 2, h);
    return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
  }
  const r = Math.min(radius, h / 2, w);
  return `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`;
}
