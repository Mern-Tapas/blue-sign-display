"use client";

import { useId } from "react";
import { RadioGroup as RadioPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import { useFieldControl } from "./field";

export function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioPrimitive.Root>) {
  return <RadioPrimitive.Root data-slot="radio-group" className={cn("flex flex-col gap-3", className)} {...props} />;
}

export type RadioProps = React.ComponentProps<typeof RadioPrimitive.Item> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
};

export function Radio({ label, description, className, id, required, ...props }: RadioProps) {
  const autoId = useId();
  const control = useFieldControl({
    id,
    required,
    "aria-describedby": props["aria-describedby"],
    "aria-invalid": props["aria-invalid"],
  });
  const inputId = id ?? autoId;
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <RadioPrimitive.Item
        id={inputId}
        data-slot="radio"
        aria-describedby={control["aria-describedby"]}
        aria-invalid={control["aria-invalid"]}
        required={control.required}
        className={cn(
          "peer mt-px flex size-5 shrink-0 items-center justify-center rounded-pill border border-border-strong bg-surface transition-colors",
          "hit-area relative transition-colors duration-(--dur-fast) hover:border-accent data-[state=checked]:border-accent disabled:cursor-not-allowed disabled:border-(--disabled-border) disabled:bg-disabled",
          "aria-invalid:border-danger",
        )}
        {...props}
      >
        <RadioPrimitive.Indicator className="size-2.5 rounded-pill bg-accent data-[state=checked]:animate-scale-in" />
      </RadioPrimitive.Item>
      {label && (
        <label htmlFor={inputId} className="flex min-w-0 flex-1 cursor-pointer flex-col peer-disabled:cursor-not-allowed peer-disabled:text-disabled-fg">
          <span className="text-body text-fg">{label}</span>
          {description && <span className="mt-0.5 text-caption text-fg-muted">{description}</span>}
        </label>
      )}
    </div>
  );
}
