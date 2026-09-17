import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/cn";
import { Spinner } from "./spinner";

/* Disabled styling. A loading button is natively `disabled` (blocks mouse + keyboard) but
   keeps its variant color — `not-data-loading:` excludes it from the disabled look. */
const disabledFilled =
  "not-data-loading:disabled:bg-disabled not-data-loading:disabled:text-disabled-fg aria-disabled:bg-disabled aria-disabled:text-disabled-fg";
const disabledQuiet = "not-data-loading:disabled:text-disabled-fg aria-disabled:text-disabled-fg";

export const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-pill font-medium select-none",
    "transition-[background-color,color,border-color,transform] duration-(--dur-fast) ease-out",
    "not-data-loading:disabled:pointer-events-none aria-disabled:pointer-events-none",
    "data-loading:cursor-progress",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: cn("press bg-accent text-fg-on-accent hover:bg-accent-hover active:bg-accent-pressed data-[force-state=active]:bg-accent-pressed", disabledFilled),
        neutral: cn("press state-layer bg-surface-inverse text-fg-inverse", disabledFilled),
        secondary: cn(
          "press state-layer border border-border bg-surface text-fg",
          "not-data-loading:disabled:border-(--disabled-border) aria-disabled:border-(--disabled-border)",
          disabledQuiet,
        ),
        soft: cn("press state-layer bg-accent-soft text-accent-soft-fg", disabledFilled),
        ghost: cn("press state-layer text-fg", disabledQuiet),
        danger: cn("press state-layer bg-danger text-fg-on-danger", disabledFilled),
        /** White button for accent / contrast panels and imagery ("Payout now"). */
        inverse: cn("press state-layer bg-white text-black", disabledFilled),
        link: cn("h-auto! px-0! text-accent-fg underline-offset-4 hover:underline", disabledQuiet),
      },
      size: {
        sm: "hit-area h-control-sm px-3.5 text-label [&_svg]:size-icon-sm",
        md: "h-control-md px-5 text-body [&_svg]:size-icon-md",
        lg: "h-control-lg px-6 text-body-lg [&_svg]:size-icon-base",
        xl: "h-control-xl px-8 text-body-lg [&_svg]:size-icon-lg",
      },
      fullWidth: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    /** Keeps the variant color, announces busy, and blocks repeat activation. */
    loading?: boolean;
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
  };

export function Button({
  className,
  variant,
  size,
  fullWidth,
  asChild = false,
  loading = false,
  leadingIcon,
  trailingIcon,
  disabled,
  children,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      data-loading={loading || undefined}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={asChild ? undefined : disabled || loading}
      aria-busy={loading || undefined}
      type={asChild ? undefined : (type ?? "button")}
      {...props}
    >
      {loading ? <Spinner size="sm" label="Loading" /> : leadingIcon}
      <Slot.Slottable>{children}</Slot.Slottable>
      {!loading && trailingIcon}
    </Comp>
  );
}
