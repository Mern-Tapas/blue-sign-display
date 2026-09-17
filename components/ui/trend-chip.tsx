import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatPercent } from "@/lib/format";

export type TrendChipProps = React.ComponentProps<"span"> & {
  /** Percentage change; sign decides direction and color. */
  value: number;
  variant?: "soft" | "solid" | "plain";
  /** Optional trailing context, e.g. "vs last month". */
  caption?: string;
};

export function TrendChip({ value, variant = "soft", caption, className, ...props }: TrendChipProps) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span data-slot="trend-chip" className={cn("inline-flex items-center gap-2 text-caption", className)} {...props}>
      <span
        className={cn(
          "inline-flex items-center gap-0.5 rounded-pill font-medium figures",
          variant !== "plain" && "h-6 px-2",
          variant === "soft" && (up ? "bg-success-soft text-success-fg" : "bg-danger-soft text-danger-fg"),
          variant === "solid" && (up ? "bg-success text-fg-on-success" : "bg-danger text-fg-on-danger"),
          variant === "plain" && (up ? "text-success-fg" : "text-danger-fg"),
        )}
      >
        <Icon aria-hidden className="size-3.5" />
        <span className="sr-only">{up ? "Increased by" : "Decreased by"}</span>
        {formatPercent(value)}
      </span>
      {caption && (
        <span className="text-fg-muted in-data-[variant=accent]:text-fg-on-accent-muted in-data-[variant=contrast]:text-fg-on-contrast-muted">
          {caption}
        </span>
      )}
    </span>
  );
}
