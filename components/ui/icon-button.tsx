import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/cn";
import { CountBadge } from "./count-badge";

export const iconButtonVariants = cva(
  [
    "press relative inline-flex shrink-0 items-center justify-center rounded-pill select-none",
    "transition-[background-color,color,border-color,transform] duration-(--dur-fast) ease-out",
    "disabled:pointer-events-none disabled:text-disabled-fg aria-disabled:pointer-events-none aria-disabled:text-disabled-fg [&_svg]:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        secondary: "state-layer border border-border bg-surface text-fg disabled:border-disabled-border aria-disabled:border-disabled-border",
        sunken: "state-layer bg-surface-sunken text-fg disabled:bg-disabled aria-disabled:bg-disabled",
        ghost: "state-layer text-fg-muted hover:text-fg",
        primary: "bg-accent text-fg-on-accent hover:bg-accent-hover active:bg-accent-pressed disabled:bg-disabled aria-disabled:bg-disabled",
        neutral: "state-layer bg-surface-inverse text-fg-inverse disabled:bg-disabled aria-disabled:bg-disabled",
        soft: "state-layer bg-accent-soft text-accent-soft-fg disabled:bg-disabled aria-disabled:bg-disabled",
        contrast: "state-layer bg-tile-on-color text-fg-on-contrast hover:bg-tile-on-color-hover disabled:text-fg-on-contrast-muted",
      },
      size: {
        xs: "hit-area size-control-xs [&_svg]:size-icon-sm",
        sm: "hit-area size-control-sm [&_svg]:size-icon-md",
        md: "size-control-md [&_svg]:size-icon-base",
        lg: "size-control-lg [&_svg]:size-icon-lg",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

export type IconButtonProps = Omit<React.ComponentProps<"button">, "aria-label"> &
  VariantProps<typeof iconButtonVariants> & {
    /** Accessible name — required because the button has no visible text. */
    label: string;
    asChild?: boolean;
    /** Small notification dot / count in the top-right corner. */
    badge?: number | boolean;
  };

export function IconButton({
  className,
  variant,
  size,
  label,
  asChild = false,
  badge,
  children,
  type,
  ...props
}: IconButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  const showCount = typeof badge === "number" && badge > 0;
  return (
    <Comp
      data-slot="icon-button"
      aria-label={label}
      title={label}
      type={asChild ? undefined : (type ?? "button")}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    >
      <Slot.Slottable>{children}</Slot.Slottable>
      {badge === true && (
        <span aria-hidden className="absolute top-2 right-2 size-2 rounded-pill bg-danger ring-2 ring-surface" />
      )}
      {showCount && (
        <CountBadge aria-hidden count={badge} tone="accent" size="sm" className="absolute -top-1 -right-1 ring-2 ring-surface" />
      )}
    </Comp>
  );
}
