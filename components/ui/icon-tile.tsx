import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const iconTileVariants = cva("inline-flex shrink-0 items-center justify-center rounded-pill [&_svg]:shrink-0", {
  variants: {
    size: {
      sm: "size-8 [&_svg]:size-icon-md",
      md: "size-10 [&_svg]:size-icon-base",
      lg: "size-12 [&_svg]:size-icon-lg",
      xl: "size-16 [&_svg]:size-7",
    },
    tone: {
      neutral: "bg-surface-sunken text-fg",
      muted: "bg-surface-sunken text-fg-muted",
      accent: "bg-accent-soft text-accent-soft-fg",
      success: "bg-success-soft text-success-fg",
      warning: "bg-warning-soft text-warning-fg",
      danger: "bg-danger-soft text-danger-fg",
      info: "bg-info-soft text-info-fg",
      /** On accent / contrast panels. */
      onColor: "bg-tile-on-color text-fg-on-contrast",
    },
  },
  defaultVariants: { size: "md", tone: "neutral" },
});

export type IconTileProps = React.ComponentProps<"span"> & VariantProps<typeof iconTileVariants>;

/**
 * Round icon container used beside titles, in empty states, dialogs and list rows.
 * Decorative by default (aria-hidden) — the adjacent text carries the meaning.
 */
export function IconTile({ size, tone, className, ...props }: IconTileProps) {
  return <span data-slot="icon-tile" aria-hidden className={cn(iconTileVariants({ size, tone }), className)} {...props} />;
}
