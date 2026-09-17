"use client";

import { HoverCard as HoverCardPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";

/**
 * Rich preview on pointer hover or keyboard focus (seller details, a mini product card).
 * It is an enhancement only: touch users never see it, so the trigger must lead somewhere
 * that shows the same information.
 */
export function HoverCard({ openDelay = 300, closeDelay = 150, ...props }: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root openDelay={openDelay} closeDelay={closeDelay} {...props} />;
}

export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export function HoverCardContent({
  className,
  sideOffset = 8,
  align = "start",
  arrow = false,
  children,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content> & { arrow?: boolean }) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        data-slot="hover-card"
        sideOffset={sideOffset}
        align={align}
        collisionPadding={16}
        className={cn(
          "z-(--z-popover) w-72 rounded-xl bg-surface-raised p-4 text-fg shadow-popover outline-none",
          "origin-(--radix-hover-card-content-transform-origin) data-[state=closed]:animate-fade-out data-[state=open]:animate-scale-in",
          className,
        )}
        {...props}
      >
        {children}
        {arrow && <HoverCardPrimitive.Arrow className="fill-surface-raised" width={12} height={6} />}
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  );
}
