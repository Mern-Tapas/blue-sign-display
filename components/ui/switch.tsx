"use client";

import { useId } from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import { useFieldControl } from "./field";

export type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  size?: "sm" | "md";
};

export function Switch({ label, description, size = "md", className, id, disabled, required, ...props }: SwitchProps) {
  const autoId = useId();
  const field = useFieldControl({
    id,
    required,
    "aria-describedby": props["aria-describedby"],
    "aria-invalid": props["aria-invalid"],
  });
  const inputId = id ?? autoId;
  const control = (
    <SwitchPrimitive.Root
      id={inputId}
      data-slot="switch"
      disabled={disabled}
      aria-describedby={field["aria-describedby"]}
      aria-invalid={field["aria-invalid"]}
      required={field.required}
      className={cn(
        "peer inline-flex shrink-0 items-center hit-area relative rounded-pill bg-border-strong p-0.5 transition-colors duration-(--dur-fast)",
        "data-[state=checked]:bg-accent disabled:cursor-not-allowed disabled:bg-disabled data-[state=checked]:disabled:bg-disabled",
        // A track has no border to redden, so invalid rides outside it.
        "aria-invalid:outline-2 aria-invalid:outline-offset-2 aria-invalid:outline-danger",
        size === "sm" ? "h-5 w-9" : "h-6 w-11",
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block rounded-pill bg-white shadow-xs transition-transform duration-(--dur-base) ease-out",
          size === "sm" ? "size-4 data-[state=checked]:translate-x-4" : "size-5 data-[state=checked]:translate-x-5",
        )}
      />
    </SwitchPrimitive.Root>
  );
  if (!label) return <span className={className}>{control}</span>;
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <label htmlFor={inputId} className={cn("flex flex-col", disabled ? "cursor-not-allowed" : "cursor-pointer")}>
        <span className={cn("text-body", disabled ? "text-disabled-fg" : "text-fg")}>{label}</span>
        {description && <span className="mt-0.5 text-caption text-fg-muted">{description}</span>}
      </label>
      {control}
    </div>
  );
}
