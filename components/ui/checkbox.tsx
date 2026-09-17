"use client";

import { useId } from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/cn";
import { useFieldControl } from "./field";

export type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** Trailing content on the label row (e.g. result count in filters). */
  trailing?: React.ReactNode;
  size?: "sm" | "md";
};

export function Checkbox({ label, description, trailing, size = "md", className, id, required, ...props }: CheckboxProps) {
  const autoId = useId();
  const control = useFieldControl({
    id,
    required,
    "aria-describedby": props["aria-describedby"],
    "aria-invalid": props["aria-invalid"],
  });
  const inputId = id ?? autoId;
  const box = (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      id={inputId}
      aria-describedby={control["aria-describedby"]}
      aria-invalid={control["aria-invalid"]}
      required={control.required}
      className={cn(
        "peer flex shrink-0 items-center justify-center hit-area relative rounded-xs border border-border-strong bg-surface text-fg-on-accent transition-colors duration-(--dur-fast)",
        "hover:border-accent data-[state=checked]:border-accent data-[state=checked]:bg-accent",
        "data-[state=indeterminate]:border-accent data-[state=indeterminate]:bg-accent",
        "disabled:cursor-not-allowed disabled:border-(--disabled-border) disabled:bg-disabled aria-invalid:border-danger",
        size === "sm" ? "size-4 [&_svg]:size-3" : "size-5 [&_svg]:size-3.5",
        !label && className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center data-[state=checked]:animate-scale-in">
        {props.checked === "indeterminate" ? <Minus aria-hidden strokeWidth={3} /> : <Check aria-hidden strokeWidth={3} />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (!label) return box;

  return (
    <div className={cn("flex items-start gap-3 has-disabled:text-disabled-fg [&:has(:disabled)_label]:cursor-not-allowed", className)}>
      <div className="flex h-5 items-center">{box}</div>
      <label htmlFor={inputId} className="flex min-w-0 flex-1 cursor-pointer flex-col">
        <span className="flex items-center justify-between gap-2 text-body text-fg">
          {label}
          {trailing && <span className="text-caption text-fg-muted figures">{trailing}</span>}
        </span>
        {description && <span className="mt-0.5 text-caption text-fg-muted">{description}</span>}
      </label>
    </div>
  );
}
