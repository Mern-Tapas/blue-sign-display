// Date-range presets for admin filters (server-safe, no React).

export type RangePreset = "today" | "7d" | "30d" | "90d" | "mtd" | "qtd" | "custom";

export type DateRangeValue = {
  preset: RangePreset;
  /** ISO dates (yyyy-mm-dd), inclusive. */
  from: string;
  to: string;
  compare?: boolean;
};

export const rangePresets: { id: Exclude<RangePreset, "custom">; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
  { id: "mtd", label: "Month to date" },
  { id: "qtd", label: "Quarter to date" },
];

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Resolve a preset against "today" (pass a fixed date for demo data and SSR stability). */
export function resolveRange(preset: Exclude<RangePreset, "custom">, today: Date): DateRangeValue {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const back = (days: number) => new Date(t.getFullYear(), t.getMonth(), t.getDate() - days);
  switch (preset) {
    case "today":
      return { preset, from: iso(t), to: iso(t) };
    case "7d":
      return { preset, from: iso(back(6)), to: iso(t) };
    case "30d":
      return { preset, from: iso(back(29)), to: iso(t) };
    case "90d":
      return { preset, from: iso(back(89)), to: iso(t) };
    case "mtd":
      return { preset, from: iso(new Date(t.getFullYear(), t.getMonth(), 1)), to: iso(t) };
    case "qtd":
      return { preset, from: iso(new Date(t.getFullYear(), Math.floor(t.getMonth() / 3) * 3, 1)), to: iso(t) };
  }
}

/** The same-length period immediately before the range (for "vs previous period"). */
export function previousPeriod(range: Pick<DateRangeValue, "from" | "to">) {
  const from = new Date(`${range.from}T00:00:00`);
  const to = new Date(`${range.to}T00:00:00`);
  const days = Math.round((to.getTime() - from.getTime()) / 86400000) + 1;
  const prevTo = new Date(from.getFullYear(), from.getMonth(), from.getDate() - 1);
  const prevFrom = new Date(prevTo.getFullYear(), prevTo.getMonth(), prevTo.getDate() - (days - 1));
  return { from: iso(prevFrom), to: iso(prevTo), days };
}

export function rangeLabel(range: DateRangeValue) {
  const preset = rangePresets.find((p) => p.id === range.preset);
  if (preset) return preset.label;
  const fmt = (s: string) => new Date(`${s}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return range.from === range.to ? fmt(range.from) : `${fmt(range.from)} – ${fmt(range.to)}`;
}
