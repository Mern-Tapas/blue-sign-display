import { Banknote, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { FREE_DELIVERY_THRESHOLD, RETURN_WINDOW_DAYS } from "@/lib/data/india";

export type ValueProp = { icon: React.ReactNode; title: string; description?: string };

/** Store promises that are true for every order (driven by the commerce rules, not marketing copy). */
export const defaultValueProps: ValueProp[] = [
  { icon: <Truck />, title: "Free delivery", description: `On orders above ${formatPrice(FREE_DELIVERY_THRESHOLD)}` },
  { icon: <RotateCcw />, title: `${RETURN_WINDOW_DAYS}-day returns`, description: "Free pickup from your door" },
  { icon: <Banknote />, title: "Cash on Delivery", description: "Available on most PIN codes" },
  { icon: <ShieldCheck />, title: "Secure payments", description: "UPI, cards, net banking and EMI" },
];

export type ValuePropsStripProps = {
  items?: ValueProp[];
  /**
   * strip — bordered segments on a surface (home, footer top)
   * inline — compact single row of icon + title (product page, bag)
   * stacked — icon above text, centred (landing pages)
   */
  variant?: "strip" | "inline" | "stacked";
  "aria-label"?: string;
  className?: string;
};

/** "Free delivery · 14-day returns · COD · Secure payments". Server-safe. */
export function ValuePropsStrip({ items = defaultValueProps, variant = "strip", "aria-label": ariaLabel = "Why shop with us", className }: ValuePropsStripProps) {
  if (variant === "inline") {
    return (
      <ul aria-label={ariaLabel} data-slot="value-props" className={cn("flex flex-wrap gap-x-5 gap-y-2", className)}>
        {items.map((p) => (
          <li key={p.title} className="flex items-center gap-2 text-label text-fg [&_svg]:size-icon-md [&_svg]:shrink-0 [&_svg]:text-accent-fg">
            {p.icon}
            {p.title}
          </li>
        ))}
      </ul>
    );
  }

  if (variant === "stacked") {
    return (
      <ul aria-label={ariaLabel} data-slot="value-props" className={cn("grid grid-cols-2 gap-6 lg:grid-cols-4", className)}>
        {items.map((p) => (
          <li key={p.title} className="flex flex-col items-center gap-3 text-center">
            <IconTile size="lg" tone="accent">
              {p.icon}
            </IconTile>
            <span className="flex flex-col gap-0.5">
              <span className="text-body-strong">{p.title}</span>
              {p.description && <span className="text-caption text-fg-muted">{p.description}</span>}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Card
      asChild
      variant="outline"
      padding="none"
      className={cn(
        "grid overflow-hidden sm:grid-cols-2 lg:grid-cols-4",
        "[&>*]:border-border-subtle max-sm:[&>*+*]:border-t sm:max-lg:[&>*:nth-child(n+3)]:border-t sm:[&>*:nth-child(even)]:border-l lg:[&>*+*]:border-l",
        className,
      )}
    >
      <ul aria-label={ariaLabel} data-slot="value-props">
        {items.map((p) => (
          <li key={p.title} className="flex items-start gap-4 p-5">
            <IconTile size="lg" tone="accent" className="size-11">
              {p.icon}
            </IconTile>
            <span className="flex flex-col">
              <span className="text-body-strong">{p.title}</span>
              {p.description && <span className="mt-0.5 text-caption text-fg-muted">{p.description}</span>}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
