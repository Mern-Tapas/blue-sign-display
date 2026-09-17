import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const textButtonVariants = cva(
  [
    "hit-area relative inline-flex items-center gap-1 rounded-xs font-medium underline-offset-4",
    "transition-[color,text-decoration-color] duration-(--dur-fast)",
    "disabled:cursor-not-allowed disabled:text-disabled-fg disabled:no-underline",
    "[&_svg]:size-[1em] [&_svg]:shrink-0",
  ],
  {
    variants: {
      tone: {
        accent: "text-accent-fg hover:underline",
        neutral: "text-fg hover:underline",
        muted: "text-fg-muted hover:text-fg hover:underline",
        danger: "text-danger-fg hover:underline",
      },
      size: { inherit: "", sm: "text-caption", md: "text-label", lg: "text-body" },
    },
    defaultVariants: { tone: "accent", size: "md" },
  },
);

export type TextButtonProps = React.ComponentProps<"button"> & VariantProps<typeof textButtonVariants>;

/**
 * An action that reads like a link ("Change", "View offers", "Size chart") but doesn't navigate.
 * Same look as TextLink; uses a real <button> and a 44px touch target.
 */
export function TextButton({ tone, size, className, type, ...props }: TextButtonProps) {
  return <button data-slot="text-button" type={type ?? "button"} className={cn(textButtonVariants({ tone, size }), className)} {...props} />;
}
