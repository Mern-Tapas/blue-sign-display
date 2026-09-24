"use client";

import { Select as SelectPrimitive } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { useFieldControl } from "./field";
import { controlShellVariants } from "./input";

export type SelectOption = { value: string; label: React.ReactNode; icon?: React.ReactNode; disabled?: boolean };
export type SelectGroup = { label: string; options: SelectOption[] };

export type SelectProps = Omit<React.ComponentProps<typeof SelectPrimitive.Root>, "children"> &
  VariantProps<typeof controlShellVariants> & {
    options?: SelectOption[];
    groups?: SelectGroup[];
    placeholder?: string;
    /** Shown in place of the list when there is nothing to choose from. */
    emptyText?: React.ReactNode;
    id?: string;
    className?: string;
    /** Inline prefix inside the trigger, e.g. "Sort:" */
    prefix?: React.ReactNode;
    "aria-label"?: string;
    "aria-invalid"?: React.AriaAttributes["aria-invalid"];
    "aria-describedby"?: string;
  };

export function Select({
  options,
  groups,
  placeholder = "Select…",
  emptyText = "No options",
  variant,
  size,
  shape,
  id,
  className,
  prefix,
  required,
  "aria-label": ariaLabel,
  "aria-invalid": invalid,
  "aria-describedby": describedBy,
  ...props
}: SelectProps) {
  const control = useFieldControl({ id, required, "aria-invalid": invalid, "aria-describedby": describedBy });
  const allGroups: SelectGroup[] = groups ?? [{ label: "", options: options ?? [] }];
  return (
    <SelectPrimitive.Root required={control.required} {...props}>
      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        id={control.id}
        aria-label={ariaLabel}
        aria-describedby={control["aria-describedby"]}
        aria-invalid={control["aria-invalid"]}
        className={cn(
          controlShellVariants({ variant, size, shape }),
          "justify-between text-left outline-none data-placeholder:text-fg-placeholder",
          className,
        )}
      >
        {/* `text-overflow` is ignored on a flex container, so the value gets its own block to
            truncate in — otherwise a long selected label clips mid-glyph with no "…". */}
        <span className="flex min-w-0 items-center gap-1.5">
          {prefix && <span className="shrink-0 text-fg-muted">{prefix}</span>}
          <span className="min-w-0 truncate">
            <SelectPrimitive.Value placeholder={placeholder} />
          </span>
        </span>
        <SelectPrimitive.Icon asChild>
          <ChevronDown aria-hidden className="transition-transform duration-(--dur-base) ease-out group-data-[state=open]/control:rotate-180" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className={cn(
            "z-(--z-popover) max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden rounded-xl bg-surface-raised p-1.5 text-fg shadow-popover",
            "origin-(--radix-select-content-transform-origin) data-[state=open]:animate-scale-in",
          )}
        >
          <SelectPrimitive.Viewport>
            {allGroups.every((g) => g.options.length === 0) && (
              // A silent empty popover reads as broken; say so, and don't make it focusable.
              <p role="status" className="px-3 py-2.5 text-body text-fg-muted">
                {emptyText}
              </p>
            )}
            {allGroups.map((g, gi) => (
              <SelectPrimitive.Group key={g.label || gi}>
                {g.label && (
                  <SelectPrimitive.Label className="px-3 pt-2 pb-1 text-caption text-fg-muted">{g.label}</SelectPrimitive.Label>
                )}
                {g.options.map((o) => (
                  <SelectPrimitive.Item
                    key={o.value}
                    value={o.value}
                    disabled={o.disabled}
                    className={cn(
                      "relative flex h-row-sm cursor-default items-center gap-2 rounded-md pr-9 pl-3 text-body outline-none select-none",
                      "focus-ring-row transition-colors duration-(--dur-instant) data-disabled:text-disabled-fg data-highlighted:bg-highlight [&_svg]:size-icon-md",
                    )}
                  >
                    {o.icon}
                    <SelectPrimitive.ItemText>{o.label}</SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator className="absolute right-3 text-accent">
                      <Check aria-hidden />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
                {gi < allGroups.length - 1 && <SelectPrimitive.Separator className="my-1 h-px bg-border-subtle" />}
              </SelectPrimitive.Group>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
