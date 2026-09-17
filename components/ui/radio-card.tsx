"use client";

import { RadioGroup as RadioPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";

export function RadioCardGroup({ className, ...props }: React.ComponentProps<typeof RadioPrimitive.Root>) {
  return <RadioPrimitive.Root data-slot="radio-card-group" className={cn("grid gap-3", className)} {...props} />;
}

/**
 * The radio dot on its own, for custom selectable layouts. Reads selection from the nearest
 * `group` ancestor (`data-state=checked`, `aria-checked=true` or `aria-pressed=true`).
 */
export function RadioIndicator({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      data-slot="radio-indicator"
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-pill border border-border-strong bg-surface transition-colors duration-(--dur-fast)",
        "group-data-[state=checked]:border-accent group-aria-checked:border-accent group-aria-pressed:border-accent",
        "group-disabled:border-disabled-border group-disabled:bg-disabled",
        className,
      )}
    >
      <span className="size-2.5 scale-0 rounded-pill bg-accent transition-transform duration-(--dur-fast) group-data-[state=checked]:scale-100 group-aria-checked:scale-100 group-aria-pressed:scale-100" />
    </span>
  );
}

/** Class list for any selectable card built outside RadioCard (checkbox cards, toggle cards). */
export const selectableCardClass = cn(
  "group relative flex w-full gap-4 rounded-xl border border-border bg-surface text-left transition-[border-color,background-color,box-shadow] duration-(--dur-fast)",
  "hover:border-border-strong",
  "data-[state=checked]:selected data-[state=checked]:border-transparent aria-checked:selected aria-checked:border-transparent aria-pressed:selected aria-pressed:border-transparent",
  "disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-disabled disabled:text-disabled-fg",
  // Invalid outranks the resting edge, but never the selected fill.
  "aria-invalid:border-danger group-aria-invalid/field-group:border-danger",
);

export type RadioCardProps = Omit<React.ComponentProps<typeof RadioPrimitive.Item>, "title"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  /** Right side — price, ETA, brand logos. */
  aside?: React.ReactNode;
  /** sm: dense lists (wallets, banks, slots); md: default. */
  size?: "sm" | "md";
  /** Show the radio dot. Turn off when the whole card reads as the choice (slot chips, bank tiles). */
  indicator?: boolean;
  /** Vertical alignment of the dot and icon — `start` for multi-line content. */
  align?: "center" | "start";
};

export function RadioCard({
  title,
  description,
  icon,
  aside,
  size = "md",
  indicator = true,
  align = "center",
  className,
  children,
  ...props
}: RadioCardProps) {
  return (
    <RadioPrimitive.Item
      data-slot="radio-card"
      className={cn(selectableCardClass, size === "sm" ? "gap-3 p-3" : "p-4", align === "start" ? "items-start" : "items-center", className)}
      {...props}
    >
      {indicator && <RadioIndicator className={align === "start" ? "mt-0.5" : undefined} />}
      {icon && (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-pill bg-surface-sunken text-fg group-data-[state=checked]:bg-surface",
            size === "sm" ? "size-8 [&_svg]:size-icon-md" : "size-10 [&_svg]:size-icon-base",
          )}
        >
          {icon}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-body-strong text-fg">{title}</span>
        {description && <span className="text-caption text-fg-muted">{description}</span>}
        {children}
      </span>
      {aside && <span className="shrink-0 text-body-strong text-fg figures">{aside}</span>}
    </RadioPrimitive.Item>
  );
}
