"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ToggleGroup } from "radix-ui";
import { cn } from "@/lib/cn";
import { CountBadge } from "./count-badge";

const rootVariants = cva("inline-flex items-center rounded-pill", {
  variants: {
    variant: {
      surface: "bg-surface p-1 shadow-flat",
      sunken: "bg-surface-sunken p-1",
      contrast: "bg-surface-contrast p-1",
    },
    fullWidth: { true: "flex w-full [&>*]:flex-1" },
  },
  defaultVariants: { variant: "sunken" },
});

const itemVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-pill font-medium",
    "transition-[background-color,color,box-shadow] duration-(--dur-fast) ease-out disabled:text-disabled-fg [&_svg]:size-icon-md",
  ],
  {
    variants: {
      size: { sm: "h-6 px-3 text-caption", md: "h-8 px-4 text-label", lg: "h-10 px-5 text-body" },
      active: {
        surface: "text-fg-muted hover:text-fg data-[state=on]:bg-surface-raised data-[state=on]:text-fg data-[state=on]:shadow-xs",
        accent: "text-fg-muted hover:text-fg data-[state=on]:bg-accent data-[state=on]:text-fg-on-accent",
        neutral: "text-fg-muted hover:text-fg data-[state=on]:bg-surface-inverse data-[state=on]:text-fg-inverse",
        contrast:
          "text-fg-on-contrast-muted hover:text-fg-on-contrast data-[state=on]:bg-white data-[state=on]:text-black",
      },
    },
    defaultVariants: { size: "md", active: "surface" },
  },
);

export type SegmentedOption = {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  count?: number;
  disabled?: boolean;
  /** Accessible label when `label` is icon-only. */
  ariaLabel?: string;
};

export type SegmentedControlProps = Omit<
  React.ComponentProps<typeof ToggleGroup.Root>,
  "type" | "value" | "defaultValue" | "onValueChange"
> &
  VariantProps<typeof rootVariants> &
  VariantProps<typeof itemVariants> & {
    options: SegmentedOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
  };

export function SegmentedControl({
  options,
  value,
  defaultValue,
  onValueChange,
  variant,
  size,
  active,
  fullWidth,
  className,
  ...props
}: SegmentedControlProps) {
  return (
    <ToggleGroup.Root
      data-slot="segmented-control"
      type="single"
      value={value}
      defaultValue={defaultValue}
      // Radix allows deselecting; a segmented control must always have a value.
      onValueChange={(v) => v && onValueChange?.(v)}
      className={cn(rootVariants({ variant, fullWidth }), className)}
      {...props}
    >
      {options.map((o) => (
        <ToggleGroup.Item
          key={o.value}
          value={o.value}
          disabled={o.disabled}
          aria-label={o.ariaLabel}
          className={cn(itemVariants({ size, active }), "group")}
        >
          {o.icon}
          {o.label}
          {o.count !== undefined && (
            <CountBadge count={o.count} className="group-data-[state=on]:bg-current/15 group-data-[state=on]:text-current" />
          )}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
