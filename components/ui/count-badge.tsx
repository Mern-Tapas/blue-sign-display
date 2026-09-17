import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const countBadgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-pill text-caption-strong leading-none figures",
  {
    variants: {
      tone: {
        neutral: "bg-surface-sunken text-fg",
        accent: "bg-accent text-fg-on-accent",
        inverse: "bg-surface-inverse text-fg-inverse",
        danger: "bg-danger text-fg-on-danger",
        /** Follows the parent's colour — for counts inside selected tabs / segments. */
        current: "bg-current/15 text-current",
      },
      size: {
        sm: "h-icon-base min-w-icon-base px-1",
        md: "h-5 min-w-5 px-1.5",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

export type CountBadgeProps = Omit<React.ComponentProps<"span">, "children"> &
  VariantProps<typeof countBadgeVariants> & {
    count: number;
    /** Caps the displayed number ("99+"). */
    max?: number;
  };

/** Numeric count pill for tabs, nav items, filters and icon buttons. */
export function CountBadge({ count, max = 99, tone, size, className, ...props }: CountBadgeProps) {
  return (
    <span data-slot="count-badge" className={cn(countBadgeVariants({ tone, size }), className)} {...props}>
      {count > max ? `${max}+` : count}
    </span>
  );
}
