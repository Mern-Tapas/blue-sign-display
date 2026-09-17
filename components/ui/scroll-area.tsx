"use client";

import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";

export type ScrollAreaProps = React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  orientation?: "vertical" | "horizontal" | "both";
  /** Classes for the scrolling viewport (set max-height / max-width here or on the root). */
  viewportClassName?: string;
  /** Label for the scrollable region so keyboard users can find it. */
  "aria-label"?: string;
  /** Soft edge fades hinting at more content. */
  fade?: boolean;
};

function Scrollbar({ orientation }: { orientation: "vertical" | "horizontal" }) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-0.5 transition-colors duration-(--dur-fast) select-none",
        orientation === "vertical" ? "h-full w-2.5" : "h-2.5 flex-col",
      )}
    >
      <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-pill bg-border-strong transition-colors duration-(--dur-fast) hover:bg-fg-muted" />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

/** Styled, theme-aware scrollbars that overlay content (no layout shift) for lists inside panels and popovers. */
export function ScrollArea({
  orientation = "vertical",
  viewportClassName,
  fade = false,
  className,
  children,
  "aria-label": ariaLabel,
  type = "hover",
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root data-slot="scroll-area" type={type} className={cn("relative overflow-hidden", className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        // Focusable so keyboard users can scroll it (WCAG 2.1.1) when it has no focusable children
        tabIndex={0}
        role={ariaLabel ? "region" : undefined}
        aria-label={ariaLabel}
        className={cn(
          "size-full rounded-[inherit] outline-none focus-ring-row",
          fade &&
            (orientation === "horizontal"
              ? "mask-x-from-[calc(100%-1.5rem)] mask-x-to-100%"
              : "mask-y-from-[calc(100%-1.5rem)] mask-y-to-100%"),
          viewportClassName,
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {orientation !== "horizontal" && <Scrollbar orientation="vertical" />}
      {orientation !== "vertical" && <Scrollbar orientation="horizontal" />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}
