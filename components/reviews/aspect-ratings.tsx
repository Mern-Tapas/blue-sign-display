import { Inset } from "@/components/ui/inset";
import { cn } from "@/lib/cn";

export type Aspect = { label: string; value: number };

export type AspectRatingsProps = {
  aspects: Aspect[];
  title?: string;
  /** bars — label, bar, score rows; grid — compact tiles with a score and a short bar. */
  variant?: "bars" | "grid";
  className?: string;
};

function tone(v: number) {
  if (v >= 4) return "bg-success";
  if (v >= 3) return "bg-warning";
  return "bg-danger";
}

/** What reviewers liked, aspect by aspect ("Comfort 4.4"). The number is always shown; the bar is a secondary cue. Server-safe. */
export function AspectRatings({ aspects, title = "Rated by aspect", variant = "bars", className }: AspectRatingsProps) {
  return (
    <section data-slot="aspect-ratings" aria-label={title} className={cn("flex flex-col gap-3", className)}>
      <h3 className="text-label text-fg">{title}</h3>
      {variant === "grid" ? (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {aspects.map((a) => (
            <Inset asChild size="sm" key={a.label} className="flex flex-col gap-2">
              <li>
                <span className="text-figure-lg figures">{a.value.toFixed(1)}</span>
                <span aria-hidden className="h-1 overflow-hidden rounded-pill bg-surface">
                  <span className={cn("block h-full rounded-pill", tone(a.value))} style={{ width: `${(a.value / 5) * 100}%` }} />
                </span>
                <span className="text-caption text-fg-muted">{a.label}</span>
              </li>
            </Inset>
          ))}
        </ul>
      ) : (
        <dl className="flex flex-col gap-2.5">
          {aspects.map((a) => (
            <div key={a.label} className="grid grid-cols-[minmax(6rem,9rem)_1fr_2rem] items-center gap-3 text-caption">
              <dt className="text-fg-muted">{a.label}</dt>
              <dd aria-hidden className="h-2 overflow-hidden rounded-pill bg-surface-sunken">
                <span className={cn("block h-full rounded-pill", tone(a.value))} style={{ width: `${(a.value / 5) * 100}%` }} />
              </dd>
              <dd className="text-right font-medium text-fg figures">
                <span className="sr-only">{a.label} rated </span>
                {a.value.toFixed(1)}
                <span className="sr-only"> out of 5</span>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
