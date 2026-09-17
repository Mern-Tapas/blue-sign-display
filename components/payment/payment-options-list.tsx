"use client";

import { useId } from "react";
import { Accordion as AccordionPrimitive, Tabs as TabsPrimitive } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/use-media-query";

export type PaymentOption = {
  id: string;
  label: string;
  /** One-line hint under the label ("Google Pay, PhonePe, any UPI ID"). */
  description?: string;
  icon: React.ReactNode;
  /** Offer or recommendation chip text ("₹50 cashback"). */
  offer?: string;
  /** Why the method can't be used for this order. Content still renders to explain. */
  unavailable?: string;
  content: React.ReactNode;
};

export type PaymentOptionsListProps = {
  options: PaymentOption[];
  value: string;
  onValueChange: (id: string) => void;
  className?: string;
};

function OptionLabel({ o, active }: { o: PaymentOption; active: boolean }) {
  return (
    <>
      <IconTile size="md" tone="muted" className={cn(active && "bg-accent text-fg-on-accent")}>
        {o.icon}
      </IconTile>
      <span className="flex min-w-0 flex-1 flex-col text-left">
        <span className={cn("text-body-strong", o.unavailable ? "text-fg-muted" : "text-fg")}>{o.label}</span>
        <span className="truncate text-caption text-fg-muted">{o.unavailable ?? o.description}</span>
        {o.offer && !o.unavailable && <span className="mt-0.5 text-caption text-success-fg">{o.offer}</span>}
      </span>
    </>
  );
}

/**
 * Every payment method in one component. From lg it is a vertical tab list with the chosen
 * method's form beside it; on phones the same options stack as an accordion, so the form opens
 * right under the method the shopper tapped. One layout is mounted at a time.
 */
export function PaymentOptionsList({ options, value, onValueChange, className }: PaymentOptionsListProps) {
  const id = useId();
  const wide = useMediaQuery("(min-width: 1024px)", false);

  if (wide) {
    return (
      <Card asChild variant="outline" padding="none" radius="xl" className={cn("grid grid-cols-[17rem_1fr] overflow-hidden", className)}>
        <TabsPrimitive.Root data-slot="payment-options" orientation="vertical" value={value} onValueChange={onValueChange}>
          <TabsPrimitive.List aria-label="Payment methods" className="flex flex-col border-r border-border-subtle bg-surface-sunken">
            {options.map((o) => (
              <TabsPrimitive.Trigger
                key={o.id}
                value={o.id}
                className={cn(
                  "focus-ring-row relative flex items-center gap-3 border-b border-border-subtle px-4 py-3.5 last:border-b-0",
                  "transition-[background-color,box-shadow] duration-(--dur-fast) hover:bg-surface-hover focus-visible:bg-highlight",
                  "data-[state=active]:selected",
                )}
              >
                <OptionLabel o={o} active={o.id === value} />
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>
          {options.map((o) => (
            <TabsPrimitive.Content key={o.id} value={o.id} className="focus-ring-row min-w-0 bg-surface p-6">
              <h3 className="mb-4 text-heading-sm">{o.label}</h3>
              {o.content}
            </TabsPrimitive.Content>
          ))}
        </TabsPrimitive.Root>
      </Card>
    );
  }

  return (
    <AccordionPrimitive.Root
      data-slot="payment-options"
      type="single"
      collapsible={false}
      value={value}
      onValueChange={(v) => v && onValueChange(v)}
      className={cn("flex flex-col gap-2", className)}
    >
      {options.map((o) => (
        <Card key={o.id} asChild variant="outline" padding="none" radius="xl" className="overflow-hidden">
          <AccordionPrimitive.Item value={o.id}>
            <AccordionPrimitive.Header>
              <AccordionPrimitive.Trigger
                id={`${id}-${o.id}`}
                className="group focus-ring-row flex w-full items-center gap-3 p-3.5 transition-[background-color,box-shadow] duration-(--dur-fast) focus-visible:bg-highlight data-[state=open]:selected"
              >
                <OptionLabel o={o} active={o.id === value} />
                <ChevronDown aria-hidden className="size-icon-md shrink-0 text-fg-muted transition-transform duration-(--dur-fast) group-data-[state=open]:rotate-180" />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="border-t border-border-subtle p-4">{o.content}</div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        </Card>
      ))}
    </AccordionPrimitive.Root>
  );
}
