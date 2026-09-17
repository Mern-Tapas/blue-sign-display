"use client";

import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import { CountBadge } from "./count-badge";

type TabsVariant = "pill" | "underline";

export function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-5", className)} {...props} />;
}

export function TabsList({
  className,
  variant = "pill",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & { variant?: TabsVariant }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        "group/tabs scrollbar-none flex max-w-full items-center overflow-x-auto",
        variant === "pill" && "w-fit gap-1 rounded-pill bg-surface-sunken p-1",
        variant === "underline" && "gap-6 border-b border-border",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  count,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & { count?: number }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "group inline-flex shrink-0 items-center gap-2 text-label whitespace-nowrap text-fg-muted transition-[color,background-color,box-shadow] duration-(--dur-fast) hover:text-fg disabled:text-disabled-fg [&_svg]:size-icon-md",
        // pill
        "group-data-[variant=pill]/tabs:h-8 group-data-[variant=pill]/tabs:rounded-pill group-data-[variant=pill]/tabs:px-4",
        "group-data-[variant=pill]/tabs:data-[state=active]:bg-surface-raised group-data-[variant=pill]/tabs:data-[state=active]:text-fg group-data-[variant=pill]/tabs:data-[state=active]:shadow-xs",
        // underline
        "group-data-[variant=underline]/tabs:-mb-px group-data-[variant=underline]/tabs:h-row-md group-data-[variant=underline]/tabs:border-b-2 group-data-[variant=underline]/tabs:border-transparent",
        "group-data-[variant=underline]/tabs:data-[state=active]:border-accent group-data-[variant=underline]/tabs:data-[state=active]:text-fg",
        className,
      )}
      {...props}
    >
      {children}
      {count !== undefined && (
        <CountBadge count={count} className="group-data-[state=active]:bg-accent group-data-[state=active]:text-fg-on-accent" />
      )}
    </TabsPrimitive.Trigger>
  );
}

export function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("outline-none data-[state=active]:animate-fade-in", className)}
      {...props}
    />
  );
}
