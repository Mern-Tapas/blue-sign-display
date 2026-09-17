"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useFieldControl } from "./field";
import { IconButton } from "./icon-button";

/** Shared shell styles for text-like controls (input, select trigger, search). */
export const controlShellVariants = cva(
  [
    "group/control relative flex w-full min-w-0 items-center gap-2 text-fg",
    "border transition-[border-color,background-color] duration-(--dur-fast) ease-out",
    // Focus: inset 2px ring on the shell; invalid swaps the ring color to danger
    "focus-ring-inset",
    // Invalid / disabled apply whether the state is on a nested <input> (has-*) or on the shell
    // itself when it is the trigger (Select, Combobox, DatePicker)
    "has-[[aria-invalid=true]]:border-danger has-[[aria-invalid=true]]:[--focus-ring:var(--danger)] aria-invalid:border-danger aria-invalid:[--focus-ring:var(--danger)]",
    "has-disabled:cursor-not-allowed has-disabled:border-transparent has-disabled:bg-disabled has-disabled:text-disabled-fg",
    "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-disabled disabled:text-disabled-fg data-disabled:cursor-not-allowed data-disabled:border-transparent data-disabled:bg-disabled data-disabled:text-disabled-fg",
    // Read-only is still readable and still focusable — quieter than disabled, not dead.
    "has-[input:read-only:not([type=search])]:border-transparent has-[input:read-only:not([type=search])]:bg-surface-sunken",
    "[&:is(:disabled,[data-disabled])_svg]:text-disabled-fg",
    "[&_svg]:size-icon-md [&_svg]:shrink-0 [&_svg]:text-fg-muted",
  ],
  {
    variants: {
      variant: {
        surface: "border-border bg-surface hover:border-border-strong",
        sunken: "border-transparent bg-surface-sunken hover:border-border focus-within:bg-surface",
      },
      size: {
        sm: "h-control-sm px-3.5 text-label",
        md: "h-control-md px-4 text-body",
        lg: "h-control-lg px-5 text-body-lg",
      },
      shape: { pill: "rounded-pill", rounded: "rounded-md" },
    },
    defaultVariants: { variant: "surface", size: "md", shape: "pill" },
  },
);

export type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof controlShellVariants> & {
    startSlot?: React.ReactNode;
    /** End adornments render in this order: clear, then status, then endSlot. */
    endSlot?: React.ReactNode;
    /** Show a clear button while the field has a value. Needs `onClear`. */
    clearable?: boolean;
    onClear?: () => void;
    clearLabel?: string;
    /**
     * Async feedback for a value being checked against something (a slug, a SKU, a PIN).
     * The surface only: debouncing, cancellation and races belong to the caller.
     */
    status?: "idle" | "checking" | "valid";
    /** What the status means, announced politely. */
    statusLabel?: string;
    wrapperClassName?: string;
  };

export function Input({
  variant,
  size,
  shape,
  startSlot,
  endSlot,
  clearable = false,
  onClear,
  clearLabel = "Clear",
  status = "idle",
  statusLabel,
  className,
  wrapperClassName,
  id,
  required,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: InputProps) {
  const control = useFieldControl({ id, required, "aria-describedby": describedBy, "aria-invalid": invalid });
  return (
    <div data-slot="input" className={cn(controlShellVariants({ variant, size, shape }), wrapperClassName)}>
      {startSlot}
      <input
        className={cn(
          // w-0 + flex-1: the native size=20 intrinsic width can't push the shell wider than its column
          "h-full w-0 min-w-0 flex-1 bg-transparent outline-none placeholder:text-fg-placeholder disabled:cursor-not-allowed",
          "[&::-webkit-search-cancel-button]:hidden",
          className,
        )}
        {...control}
        {...props}
      />
      {clearable && String(props.value ?? "").length > 0 && !props.disabled && !props.readOnly && (
        <IconButton label={clearLabel} variant="ghost" size="xs" onClick={onClear} tabIndex={-1}>
          <X aria-hidden />
        </IconButton>
      )}
      {status !== "idle" && (
        <span data-slot="input-status" className={cn("flex shrink-0 items-center", status === "valid" && "[&_svg]:text-success-fg")}>
          {status === "checking" ? <Loader2 aria-hidden className="motion-safe:animate-spin" /> : <Check aria-hidden />}
          <span className="sr-only" aria-live="polite">
            {statusLabel ?? (status === "checking" ? "Checking" : "Available")}
          </span>
        </span>
      )}
      {endSlot}
    </div>
  );
}
