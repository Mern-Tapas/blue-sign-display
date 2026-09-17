"use client";

import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

type AccordionVariant = "plain" | "cards";

export function Accordion({
  className,
  variant = "plain",
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> & { variant?: AccordionVariant }) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      data-variant={variant}
      className={cn("group/accordion flex flex-col", variant === "cards" && "gap-2", className)}
      {...props}
    />
  );
}

export function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "border-b border-border-subtle last:border-b-0",
        "group-data-[variant=cards]/accordion:rounded-xl group-data-[variant=cards]/accordion:border-0 group-data-[variant=cards]/accordion:bg-surface-sunken",
        className,
      )}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  trailing,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & { trailing?: React.ReactNode }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex flex-1 items-center justify-between gap-3 py-4 text-left text-body font-medium text-fg transition-colors hover:text-accent-fg",
          "group-data-[variant=cards]/accordion:px-4",
          className,
        )}
        {...props}
      >
        <span className="flex-1">{children}</span>
        {trailing}
        <span className="flex size-7 shrink-0 items-center justify-center rounded-pill bg-surface-sunken transition-[transform,background-color] duration-(--dur-base) ease-out group-data-[state=open]:rotate-180 group-data-[variant=cards]/accordion:bg-surface">
          <ChevronDown aria-hidden className="size-icon-md text-fg-muted" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-body text-fg-muted data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pb-4 group-data-[variant=cards]/accordion:px-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
