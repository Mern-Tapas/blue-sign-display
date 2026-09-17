import { Check, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import type { OrderEvent } from "@/lib/data/types";
import { formatDate } from "@/lib/format";

export type OrderTimelineProps = {
  events: OrderEvent[];
  /** Newest scan first (courier-style) instead of chronological. */
  newestFirst?: boolean;
  className?: string;
};

/**
 * Detailed scan history. Each reached event shows its IST timestamp and scan location; the last
 * completed event is the "current" step. Server-safe.
 */
export function OrderTimeline({ events, newestFirst = false, className }: OrderTimelineProps) {
  const currentIndex = events.map((e) => e.done).lastIndexOf(true);
  const list = events.map((e, i) => ({ e, i }));
  const ordered = newestFirst ? [...list].reverse() : list;

  return (
    <ol data-slot="order-timeline" className={cn("flex flex-col", className)}>
      {ordered.map(({ e, i }, pos) => {
        const current = i === currentIndex;
        const last = pos === ordered.length - 1;
        const nextDone = newestFirst ? ordered[pos + 1]?.e.done : events[i + 1]?.done;
        return (
          <li key={`${e.status}-${i}`} className="relative flex gap-4 pb-6 last:pb-0" aria-current={current ? "step" : undefined}>
            {!last && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-8 bottom-1 left-[0.9375rem] w-0.5 rounded-pill",
                  (newestFirst ? e.done && nextDone : nextDone) ? "bg-accent" : "bg-hatch bg-surface-sunken text-fg-subtle",
                )}
              />
            )}
            <span
              className={cn(
                "relative flex size-8 shrink-0 items-center justify-center rounded-pill",
                e.done ? "bg-accent text-fg-on-accent" : "border-2 border-dashed border-border-strong bg-surface",
                current && "ring-4 ring-accent-soft",
              )}
            >
              {e.done && !current && <Check aria-hidden className="size-icon-md" strokeWidth={3} />}
              {current && <span aria-hidden className="size-2.5 animate-pulse rounded-pill bg-fg-on-accent" />}
              <span className="sr-only">{e.done ? (current ? "Latest update" : "Completed") : "Pending"}</span>
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className={cn("text-body-strong", !e.done && "text-fg-muted")}>{e.status}</p>
                {e.date && (
                  <time dateTime={e.date} className="text-caption text-fg-muted figures">
                    {formatDate(e.date, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                  </time>
                )}
              </div>
              {e.description && <p className="text-caption text-fg-muted">{e.description}</p>}
              {e.location && e.done && (
                <p className="flex items-center gap-1 text-caption text-fg-muted">
                  <MapPin aria-hidden className="size-3 shrink-0" />
                  {e.location}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
