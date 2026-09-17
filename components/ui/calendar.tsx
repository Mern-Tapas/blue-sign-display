"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { LOCALE } from "@/lib/format";
import { useHydrated } from "@/lib/use-hydrated";

/* ---- Local-date helpers (no time-zone drift: dates are built from y/m/d) ---- */
export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
export function addDays(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}
export function addMonths(d: Date, n: number) {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last));
}
export function isSameDay(a: Date | null | undefined, b: Date | null | undefined) {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function clamp(d: Date, min?: Date, max?: Date) {
  if (min && d < startOfDay(min)) return startOfDay(min);
  if (max && d > startOfDay(max)) return startOfDay(max);
  return d;
}

export type CalendarProps = {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date) => void;
  /** Month shown first when there is no value. Pass it for server-rendered calendars. */
  defaultMonth?: Date;
  min?: Date;
  max?: Date;
  isDateDisabled?: (date: Date) => boolean;
  /** 0 = Sunday (default), 1 = Monday. */
  weekStartsOn?: 0 | 1;
  /** Month and year selects in the caption — for dates of birth. */
  captionLayout?: "label" | "dropdown";
  fromYear?: number;
  toYear?: number;
  /** Small note under a date number (e.g. "₹99" delivery fee). */
  renderDayNote?: (date: Date) => React.ReactNode;
  autoFocus?: boolean;
  "aria-label"?: string;
  className?: string;
};

/**
 * Month grid (WAI-ARIA date grid). One tab stop; arrows move by day / week, Home / End to
 * week edges, PageUp / PageDown by month (+Shift by year), Enter or Space selects.
 * "Today" is marked only after hydration so server and client HTML match.
 */
export function Calendar({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  defaultMonth,
  min,
  max,
  isDateDisabled,
  weekStartsOn = 0,
  captionLayout = "label",
  fromYear,
  toYear,
  renderDayNote,
  autoFocus = false,
  "aria-label": ariaLabel,
  className,
}: CalendarProps) {
  const hydrated = useHydrated();
  const [valueState, setValueState] = useState<Date | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : valueState;
  const [focused, setFocused] = useState<Date>(() => startOfDay(value ?? defaultMonth ?? min ?? new Date()));
  const gridRef = useRef<HTMLTableElement>(null);
  const shouldFocus = useRef(autoFocus);

  const month = new Date(focused.getFullYear(), focused.getMonth(), 1);
  const today = hydrated ? startOfDay(new Date()) : null;

  const isDisabled = (d: Date) => (min && d < startOfDay(min)) || (max && d > startOfDay(max)) || Boolean(isDateDisabled?.(d));

  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>('button[tabindex="0"]')?.focus();
  }, [focused]);

  const year = focused.getFullYear();
  const monthIndex = focused.getMonth();
  const weeks = useMemo(() => {
    const offset = (new Date(year, monthIndex, 1).getDay() - weekStartsOn + 7) % 7;
    const days = new Date(year, monthIndex + 1, 0).getDate();
    const cells: (Date | null)[] = [...Array<null>(offset).fill(null), ...Array.from({ length: days }, (_, i) => new Date(year, monthIndex, i + 1))];
    while (cells.length % 7) cells.push(null);
    return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
  }, [year, monthIndex, weekStartsOn]);

  const weekdayNames = useMemo(() => {
    const base = new Date(2026, 1, 1); // a Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(base, i + weekStartsOn);
      return {
        short: new Intl.DateTimeFormat(LOCALE, { weekday: "narrow" }).format(d),
        long: new Intl.DateTimeFormat(LOCALE, { weekday: "long" }).format(d),
      };
    });
  }, [weekStartsOn]);

  const monthLabel = new Intl.DateTimeFormat(LOCALE, { month: "long", year: "numeric" }).format(month);
  const prevDisabled = Boolean(min && new Date(month.getFullYear(), month.getMonth(), 0) < startOfDay(min));
  const nextDisabled = Boolean(max && new Date(month.getFullYear(), month.getMonth() + 1, 1) > startOfDay(max));

  function moveTo(d: Date, focus = true) {
    shouldFocus.current = focus;
    setFocused(clamp(startOfDay(d), min, max));
  }

  function select(d: Date) {
    if (isDisabled(d)) return;
    if (valueProp === undefined) setValueState(d);
    setFocused(d);
    onValueChange?.(d);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const dow = (focused.getDay() - weekStartsOn + 7) % 7;
    const map: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -dow),
      End: () => addDays(focused, 6 - dow),
      PageUp: () => addMonths(focused, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, e.shiftKey ? 12 : 1),
    };
    const next = map[e.key];
    if (next) {
      e.preventDefault();
      moveTo(next());
    }
  }

  const years = useMemo(() => {
    const now = new Date().getFullYear();
    const from = fromYear ?? min?.getFullYear() ?? now - 100;
    const to = toYear ?? max?.getFullYear() ?? now + 5;
    return Array.from({ length: to - from + 1 }, (_, i) => to - i);
  }, [fromYear, toYear, min, max]);

  const selectClass =
    "h-control-sm cursor-pointer rounded-pill bg-surface-sunken pr-2 pl-3 text-label transition-colors duration-(--dur-fast) hover:bg-surface-hover font-medium text-fg outline-none focus-ring";

  return (
    <div data-slot="calendar" className={cn("inline-flex w-fit flex-col gap-3", className)}>
      <div className="flex items-center justify-between gap-2">
        {captionLayout === "dropdown" ? (
          <div className="flex items-center gap-1.5">
            <select
              aria-label="Month"
              value={month.getMonth()}
              onChange={(e) => moveTo(new Date(month.getFullYear(), Number(e.target.value), Math.min(focused.getDate(), 28)), false)}
              className={selectClass}
            >
              {Array.from({ length: 12 }, (_, m) => (
                <option key={m} value={m}>
                  {new Intl.DateTimeFormat(LOCALE, { month: "short" }).format(new Date(2026, m, 1))}
                </option>
              ))}
            </select>
            <select
              aria-label="Year"
              value={month.getFullYear()}
              onChange={(e) => moveTo(new Date(Number(e.target.value), month.getMonth(), Math.min(focused.getDate(), 28)), false)}
              className={cn(selectClass, "figures")}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p aria-live="polite" className="pl-2 text-title">
            {monthLabel}
          </p>
        )}
        <div className="flex items-center gap-1">
          {[
            { label: "Previous month", icon: ChevronLeft, delta: -1, disabled: prevDisabled },
            { label: "Next month", icon: ChevronRight, delta: 1, disabled: nextDisabled },
          ].map(({ label, icon: Icon, delta, disabled }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              disabled={disabled}
              onClick={() => moveTo(addMonths(focused, delta), false)}
              className="press state-layer hit-area relative flex size-control-sm items-center justify-center rounded-pill text-fg transition-[color,transform] duration-(--dur-fast) disabled:text-disabled-fg"
            >
              <Icon aria-hidden className="size-icon-md" />
            </button>
          ))}
        </div>
      </div>

      <table ref={gridRef} role="grid" aria-label={ariaLabel ?? monthLabel} onKeyDown={onKeyDown} className="border-collapse">
        <thead>
          <tr>
            {weekdayNames.map((w) => (
              <th key={w.long} scope="col" abbr={w.long} className="h-8 w-10 text-center text-caption font-medium text-fg-muted">
                {w.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                if (!day) return <td key={di} className="p-0.5" />;
                const selected = isSameDay(day, value);
                const disabled = isDisabled(day);
                const isToday = isSameDay(day, today);
                const note = renderDayNote?.(day);
                return (
                  <td key={di} className="p-0.5 text-center">
                    <button
                      type="button"
                      tabIndex={isSameDay(day, focused) ? 0 : -1}
                      aria-pressed={selected}
                      aria-disabled={disabled || undefined}
                      aria-current={isToday ? "date" : undefined}
                      aria-label={new Intl.DateTimeFormat(LOCALE, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(day)}
                      onClick={() => select(day)}
                      onFocus={() => !isSameDay(day, focused) && setFocused(day)}
                      className={cn(
                        "state-layer relative flex w-10 flex-col items-center justify-center rounded-md text-body figures",
                        note ? "h-12" : "h-10",
                        "transition-colors duration-(--dur-fast)",
                        selected ? "bg-accent text-fg-on-accent" : "text-fg",
                        isToday && !selected && "font-medium text-accent-fg underline decoration-2 underline-offset-4",
                        disabled && "cursor-not-allowed text-disabled-fg line-through decoration-1 before:hidden",
                      )}
                    >
                      {day.getDate()}
                      {isToday && !selected && <span aria-hidden className="absolute bottom-1 size-1 rounded-pill bg-accent" />}
                      {note && !disabled && <span className={cn("text-caption leading-none", selected ? "text-fg-on-accent-muted" : "text-fg-muted")}>{note}</span>}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
