"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";

export const chipVariants = cva(
  [
    "press state-layer hit-area relative inline-flex shrink-0 items-center gap-1.5 rounded-pill border font-medium whitespace-nowrap select-none",
    "transition-[background-color,border-color,color,transform] duration-(--dur-fast) ease-out",
    "disabled:pointer-events-none disabled:border-transparent disabled:bg-disabled disabled:text-disabled-fg",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    // Selected (standalone aria-pressed or ToggleGroup data-state=on)
    "aria-pressed:selected aria-pressed:border-transparent aria-pressed:text-accent-soft-fg",
    "data-[state=on]:selected data-[state=on]:border-transparent data-[state=on]:text-accent-soft-fg",
  ],
  {
    variants: {
      variant: {
        outline: "border-border bg-surface text-fg hover:border-border-strong",
        sunken: "border-transparent bg-surface-sunken text-fg",
      },
      size: {
        xs: "h-control-xs px-2.5 text-caption-strong [&_svg]:size-icon-sm",
        sm: "h-control-sm px-3 text-label [&_svg]:size-icon-sm",
        md: "h-control-md px-4 text-body [&_svg]:size-icon-md",
      },
    },
    defaultVariants: { variant: "outline", size: "sm" },
  },
);

type ChipOwnProps = VariantProps<typeof chipVariants> & {
  icon?: React.ReactNode;
  /** Trailing count, e.g. results for a filter value. */
  count?: number;
  /** Shows a check when selected. */
  showCheck?: boolean;
};

export type ChipProps = Omit<React.ComponentProps<"button">, "children"> &
  ChipOwnProps & {
    children: React.ReactNode;
    /** Toggle chip: sets aria-pressed. Leave undefined for a plain action chip. */
    selected?: boolean;
    /** Removable input chip: renders a separate remove button. */
    onRemove?: () => void;
    removeLabel?: string;
  };

function ChipInner({ icon, count, showCheck, selected, children }: ChipOwnProps & { selected?: boolean; children: React.ReactNode }) {
  return (
    <>
      {showCheck && selected ? <Check aria-hidden strokeWidth={2.5} /> : icon}
      {children}
      {count !== undefined && <span className="font-normal figures">({count})</span>}
    </>
  );
}

/**
 * Compact choice. Three shapes:
 * - Toggle (`selected`) — filter or suggestion chips, aria-pressed.
 * - Removable (`onRemove`) — applied filters, entered tags.
 * - In a `ChipGroup` — single or multiple selection with arrow-key focus.
 */
export function Chip({
  variant,
  size,
  icon,
  count,
  showCheck = true,
  selected,
  onRemove,
  removeLabel,
  className,
  children,
  type,
  ...props
}: ChipProps) {
  if (onRemove) {
    const label = typeof children === "string" ? children : "item";
    return (
      <span
        data-slot="chip"
        className={cn(
          chipVariants({ variant, size }),
          "[&::after]:hidden [&::before]:hidden active:scale-100",
          size === "md" ? "pr-1.5" : size === "xs" ? "pr-0.5" : "pr-1",
          className,
        )}
      >
        <ChipInner icon={icon} count={count}>
          {children}
        </ChipInner>
        <button
          type="button"
          aria-label={removeLabel ?? `Remove ${label}`}
          onClick={onRemove}
          disabled={props.disabled}
          className="state-layer hit-area relative flex size-6 items-center justify-center rounded-pill text-fg-muted hover:text-fg"
        >
          <X aria-hidden className="size-icon-sm!" />
        </button>
      </span>
    );
  }

  return (
    <button
      data-slot="chip"
      type={type ?? "button"}
      aria-pressed={selected}
      className={cn(chipVariants({ variant, size }), className)}
      {...props}
    >
      <ChipInner icon={icon} count={count} showCheck={showCheck} selected={selected}>
        {children}
      </ChipInner>
    </button>
  );
}

export type ChipOption = { value: string; label: React.ReactNode; icon?: React.ReactNode; count?: number; disabled?: boolean };

type ChipGroupBase = VariantProps<typeof chipVariants> & {
  options: ChipOption[];
  "aria-label": string;
  className?: string;
  /** Horizontal scroll rail instead of wrapping (mobile filter rows). */
  scroll?: boolean;
  showCheck?: boolean;
  disabled?: boolean;
};

export type ChipGroupProps =
  | (ChipGroupBase & { type?: "multiple"; value?: string[]; defaultValue?: string[]; onValueChange?: (v: string[]) => void })
  | (ChipGroupBase & { type: "single"; value?: string; defaultValue?: string; onValueChange?: (v: string) => void });

/** Radix ToggleGroup of chips: roving focus with arrow keys, single or multiple selection. */
export function ChipGroup({ options, variant, size, className, scroll = false, showCheck = true, ...props }: ChipGroupProps) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="chip-group"
      {...({ ...props, type: props.type ?? "multiple" } as React.ComponentProps<typeof ToggleGroupPrimitive.Root>)}
      className={cn(
        "flex gap-2",
        scroll ? "scrollbar-none -mx-1 overflow-x-auto px-1 py-1" : "flex-wrap",
        className,
      )}
    >
      {options.map((o) => (
        <ToggleGroupPrimitive.Item
          key={o.value}
          value={o.value}
          disabled={o.disabled}
          className={cn(chipVariants({ variant, size }), "group/chip")}
        >
          {showCheck && <Check aria-hidden strokeWidth={2.5} className="hidden group-data-[state=on]/chip:block" />}
          {o.icon && <span className={cn("contents", showCheck && "group-data-[state=on]/chip:[&>svg]:hidden")}>{o.icon}</span>}
          {o.label}
          {o.count !== undefined && <span className="font-normal figures">({o.count})</span>}
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  );
}
