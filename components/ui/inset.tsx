import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/cn";

export const insetVariants = cva("rounded-lg", {
  variants: {
    tone: {
      /** Grey panel inside a card: totals, notes, meta blocks. Keeps a hairline (D-035). */
      sunken: "bg-surface-sunken text-fg shadow-flat",
      accent: "bg-accent-soft text-accent-soft-fg",
      success: "bg-success-soft text-success-fg",
      warning: "bg-warning-soft text-warning-fg",
      danger: "bg-danger-soft text-danger-fg",
      info: "bg-info-soft text-info-fg",
    },
    size: {
      sm: "p-3",
      md: "p-4",
    },
  },
  defaultVariants: { tone: "sunken", size: "md" },
});

export type InsetProps = React.ComponentProps<"div"> & VariantProps<typeof insetVariants> & { asChild?: boolean };

/** Nested panel inside a Card, Sheet or Dialog. Radius steps down from the parent (2xl → lg). */
export function Inset({ tone, size, asChild, className, ...props }: InsetProps) {
  const Comp = asChild ? Slot.Root : "div";
  return <Comp data-slot="inset" className={cn(insetVariants({ tone, size }), className)} {...props} />;
}
