import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill font-medium [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        neutral: "bg-surface-sunken text-fg",
        accent: "bg-accent-soft text-accent-soft-fg",
        success: "bg-success-soft text-success-fg",
        warning: "bg-warning-soft text-warning-fg",
        danger: "bg-danger-soft text-danger-fg",
        info: "bg-info-soft text-info-fg",
        solid: "bg-accent text-fg-on-accent",
        /** Opaque red — use on imagery where soft (translucent) tones lose contrast. */
        sale: "bg-danger text-fg-on-danger",
        inverse: "bg-surface-inverse text-fg-inverse",
        outline: "border border-border bg-surface text-fg",
      },
      size: {
        sm: "h-5 px-2 text-caption-strong leading-none",
        md: "h-6 px-2.5 text-caption",
        lg: "h-7 px-3 text-label",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

export type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, size, ...props }: BadgeProps) {
  return <span data-slot="badge" className={cn(badgeVariants({ tone, size }), className)} {...props} />;
}
