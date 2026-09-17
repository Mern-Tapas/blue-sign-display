import { Star } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { formatCompact } from "@/lib/format";

const pillVariants = cva("inline-flex items-center rounded-xs figures", {
  variants: {
    size: {
      sm: "h-5 gap-0.5 px-1.5 text-caption-strong [&_svg]:size-2.5",
      md: "h-6 gap-1 px-2 text-label [&_svg]:size-3",
      lg: "h-8 gap-1 px-2.5 text-body-strong [&_svg]:size-icon-sm",
    },
  },
  defaultVariants: { size: "sm" },
});

/** Score band → tone. Bands follow Indian marketplace convention: green is good, amber mixed, red poor. */
export function ratingTone(value: number) {
  // Soft fills: solid green / red with white text falls under 4.5:1 at this size
  if (value >= 4) return "bg-success-soft text-success-fg";
  if (value >= 3) return "bg-warning-soft text-warning-fg";
  return "bg-danger-soft text-danger-fg";
}

export type RatingPillProps = VariantProps<typeof pillVariants> & {
  value: number;
  /** Number of ratings, shown compact after a divider ("4.3 ★ | 1.2K"). */
  count?: number;
  className?: string;
};

/**
 * Compact "4.3 ★" score with an optional count. The number is always visible, so colour is a
 * secondary cue; screen readers hear "Rated 4.3 out of 5, 1,284 ratings".
 */
export function RatingPill({ value, count, size, className }: RatingPillProps) {
  const v = Math.max(0, Math.min(5, value));
  return (
    <span
      data-slot="rating-pill"
      role="img"
      aria-label={`Rated ${v.toFixed(1)} out of 5${count !== undefined ? `, ${count.toLocaleString("en-IN")} ratings` : ""}`}
      className={cn("inline-flex items-center gap-1.5", className)}
    >
      <span className={cn(pillVariants({ size }), ratingTone(v))}>
        {v.toFixed(1)}
        <Star aria-hidden className="fill-current" strokeWidth={0} />
      </span>
      {count !== undefined && (
        <span className={cn("text-fg-muted figures", size === "lg" ? "text-body" : "text-caption")}>
          <span aria-hidden className="mr-1.5 text-border-strong">|</span>
          {formatCompact(count)}
        </span>
      )}
    </span>
  );
}
