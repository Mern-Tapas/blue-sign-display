import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/cn";
import { IconTile } from "./icon-tile";
import { Inset } from "./inset";

export const cardVariants = cva("relative flex flex-col text-fg", {
  variants: {
    variant: {
      surface: "bg-surface shadow-card",
      sunken: "bg-surface-sunken",
      outline: "bg-surface shadow-flat",
      contrast: "bg-surface-contrast text-fg-on-contrast shadow-card",
      accent: "bg-accent text-fg-on-accent shadow-card",
      /** Destructive zone (delete account): surface with a danger hairline instead of a bare border. */
      danger: "bg-surface shadow-[0_0_0_1px_color-mix(in_srgb,var(--danger)_45%,transparent)]",
    },
    padding: {
      none: "",
      sm: "gap-3 p-4",
      /** Default: 20px → 24px from sm (--card-pad). */
      md: "gap-4 p-(--card-pad)",
      lg: "gap-6 p-8",
    },
    radius: {
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
    },
    interactive: {
      true: "lift",
    },
  },
  defaultVariants: { variant: "surface", padding: "md", radius: "2xl" },
});

export type CardProps = React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & { asChild?: boolean };

export function Card({ className, variant, padding, radius, interactive, asChild, ...props }: CardProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="card"
      data-variant={variant ?? "surface"}
      className={cn(cardVariants({ variant, padding, radius, interactive }), className)}
      {...props}
    />
  );
}

export type CardHeaderProps = Omit<React.ComponentProps<"div">, "title"> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned slot — typically an arrow IconButton or a SegmentedControl. */
  action?: React.ReactNode;
  icon?: React.ReactNode;
};

export function CardHeader({ title, description, action, icon, className, children, ...props }: CardHeaderProps) {
  return (
    <div data-slot="card-header" className={cn("flex items-start gap-3", className)} {...props}>
      {icon && (
        <IconTile size="md" className="in-data-[variant=accent]:bg-tile-on-color in-data-[variant=accent]:text-fg-on-accent in-data-[variant=contrast]:bg-tile-on-color in-data-[variant=contrast]:text-fg-on-contrast">
          {icon}
        </IconTile>
      )}
      <div className="min-w-0 flex-1">
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="card-title" className={cn("text-title", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("mt-0.5 text-caption text-fg-muted in-data-[variant=accent]:text-fg-on-accent-muted in-data-[variant=contrast]:text-fg-on-contrast-muted", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("flex flex-col gap-3", className)} {...props} />;
}

/** @deprecated Use `Inset` (same look, adds tones and sizes). */
export function CardInset(props: React.ComponentProps<"div">) {
  return <Inset data-slot="card-inset" {...props} />;
}

export function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("mt-auto flex items-center gap-3 border-t border-border-subtle pt-4", className)}
      {...props}
    />
  );
}
