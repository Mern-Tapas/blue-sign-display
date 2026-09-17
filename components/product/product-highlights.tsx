import { Check } from "lucide-react";
import { IconTile } from "@/components/ui/icon-tile";
import { Inset } from "@/components/ui/inset";
import { cn } from "@/lib/cn";

export type Highlight = string | { icon?: React.ReactNode; title: string; description?: string };

export type ProductHighlightsProps = {
  items: Highlight[];
  title?: string;
  /** list — check rows in two columns; tiles — icon tiles for key specs (battery, weight…). */
  variant?: "list" | "tiles";
  className?: string;
};

/** The few facts that decide a purchase, above the long specification table. Server-safe. */
export function ProductHighlights({ items, title = "Highlights", variant = "list", className }: ProductHighlightsProps) {
  const normalized = items.map((i) => (typeof i === "string" ? { title: i } : i));
  return (
    <section data-slot="product-highlights" aria-label={title} className={cn("flex flex-col gap-3", className)}>
      <h2 className="text-title">{title}</h2>
      {variant === "tiles" ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {normalized.map((h) => (
            <Inset asChild size="sm" key={h.title}>
            <li className="flex flex-col gap-2">
              {h.icon && (
                <span aria-hidden className="text-accent-fg [&_svg]:size-icon-lg">
                  {h.icon}
                </span>
              )}
              <span className="text-label text-fg">{h.title}</span>
              {h.description && <span className="text-caption text-fg-muted">{h.description}</span>}
            </li>
            </Inset>
          ))}
        </ul>
      ) : (
        <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {normalized.map((h) => (
            <li key={h.title} className="flex items-start gap-2.5 text-body text-fg">
              <IconTile tone="accent" className="mt-0.5 size-5 [&_svg]:size-3">
                <Check strokeWidth={3} />
              </IconTile>
              <span>
                {h.title}
                {h.description && <span className="block text-caption text-fg-muted">{h.description}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
