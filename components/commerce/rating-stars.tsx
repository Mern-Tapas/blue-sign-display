import { Star } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

const sizes = { sm: "size-icon-sm", md: "size-icon-md", lg: "size-icon-lg" } as const;

export type RatingStarsProps = React.ComponentProps<"div"> & {
  value: number;
  max?: number;
  count?: number;
  size?: keyof typeof sizes;
  showValue?: boolean;
};

export function RatingStars({
  value,
  max = 5,
  count,
  size = "md",
  showValue = false,
  className,
  ...props
}: RatingStarsProps) {
  const clamped = Math.max(0, Math.min(max, value));
  return (
    <div data-slot="rating" className={cn("inline-flex items-center gap-2", className)} {...props}>
      <span
        role="img"
        aria-label={`Rated ${clamped.toFixed(1)} out of ${max}`}
        className="inline-flex items-center gap-0.5"
      >
        {Array.from({ length: max }, (_, i) => {
          const fill = Math.max(0, Math.min(1, clamped - i));
          return (
            <span key={i} className={cn("relative inline-block", sizes[size])}>
              <Star aria-hidden className={cn("absolute inset-0 fill-surface-sunken text-border-strong", sizes[size])} strokeWidth={1.5} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star aria-hidden className={cn("fill-rating text-rating", sizes[size])} strokeWidth={1.5} />
              </span>
            </span>
          );
        })}
      </span>
      {(showValue || count !== undefined) && (
        <span className="text-label text-fg-muted figures">
          {showValue && <span className="font-medium text-fg">{clamped.toFixed(1)}</span>}
          {count !== undefined && <span> ({formatNumber(count)})</span>}
        </span>
      )}
    </div>
  );
}
