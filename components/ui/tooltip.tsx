"use client";

import { Tooltip as TooltipPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";

export type TooltipProps = Omit<React.ComponentProps<typeof TooltipPrimitive.Content>, "content"> & {
  content: React.ReactNode;
  children: React.ReactElement;
  delayDuration?: number;
};

/** Requires <Tooltip.Provider> (mounted in app Providers). */
export function Tooltip({ content, children, side = "top", sideOffset = 8, className, delayDuration, ...props }: TooltipProps) {
  return (
    <TooltipPrimitive.Root delayDuration={delayDuration}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          data-slot="tooltip"
          side={side}
          sideOffset={sideOffset}
          className={cn(
            "z-(--z-tooltip) max-w-64 rounded-md bg-surface-inverse px-2.5 py-1.5 text-caption text-fg-inverse shadow-popover",
            "origin-(--radix-tooltip-content-transform-origin) data-[state=closed]:animate-fade-out data-[state=delayed-open]:animate-scale-in data-[state=instant-open]:animate-fade-in",
            className,
          )}
          {...props}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-surface-inverse" width={10} height={5} />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
