import { cn } from "@/lib/cn";

export type DescriptionItem = {
  term: React.ReactNode;
  description: React.ReactNode;
  /** Inline action after the value (copy, edit, "Change"). */
  action?: React.ReactNode;
  /** Emphasise a row (totals). */
  emphasis?: boolean;
  key?: string;
};

export type DescriptionListProps = Omit<React.ComponentProps<"dl">, "children"> & {
  items: DescriptionItem[];
  /**
   * rows — term left, value right (price details, order info)
   * table — fixed term column, value wraps (specifications)
   * stacked — term above value (addresses, profile)
   * grid — stacked pairs in 2 columns from sm
   */
  layout?: "rows" | "table" | "stacked" | "grid";
  dividers?: boolean;
  size?: "sm" | "md";
};

/** Semantic key–value list (<dl>) for specs, order details and summaries. Server-safe. */
export function DescriptionList({ items, layout = "rows", dividers = false, size = "md", className, ...props }: DescriptionListProps) {
  const text = size === "sm" ? "text-caption" : "text-body";
  return (
    <dl
      data-slot="description-list"
      data-layout={layout}
      className={cn(
        layout === "grid" ? "grid gap-x-6 gap-y-4 sm:grid-cols-2" : "flex flex-col",
        layout !== "grid" && (dividers ? "divide-y divide-border-subtle" : size === "sm" ? "gap-2" : "gap-3"),
        text,
        className,
      )}
      {...props}
    >
      {items.map((item, i) => (
        <div
          key={item.key ?? i}
          className={cn(
            layout === "rows" && "flex items-baseline justify-between gap-4",
            layout === "table" && "grid grid-cols-[minmax(7rem,38%)_1fr] gap-4",
            (layout === "stacked" || layout === "grid") && "flex flex-col gap-0.5",
            dividers && layout !== "grid" && (size === "sm" ? "py-2 first:pt-0 last:pb-0" : "py-3 first:pt-0 last:pb-0"),
            item.emphasis && "font-medium",
          )}
        >
          <dt className={cn(item.emphasis ? "text-fg" : "text-fg-muted", (layout === "stacked" || layout === "grid") && "text-caption")}>{item.term}</dt>
          <dd className={cn("flex min-w-0 items-baseline gap-2 text-fg", layout === "rows" && "justify-end text-right", item.emphasis && "text-body-lg")}>
            <span className={cn("min-w-0", layout === "rows" && "figures")}>{item.description}</span>
            {item.action}
          </dd>
        </div>
      ))}
    </dl>
  );
}
