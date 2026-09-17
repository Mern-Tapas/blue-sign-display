"use client";

import { DropdownMenu as MenuPrimitive } from "radix-ui";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;
export const DropdownMenuGroup = MenuPrimitive.Group;
export const DropdownMenuSub = MenuPrimitive.Sub;
export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup;

const panel =
  "z-(--z-popover) max-h-(--radix-dropdown-menu-content-available-height) min-w-48 overflow-x-hidden overflow-y-auto rounded-xl bg-surface-raised p-1.5 text-fg shadow-popover data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out";

const itemBase =
  "relative flex h-row-sm cursor-default items-center gap-2.5 rounded-md px-3 text-body outline-none select-none focus-ring-row transition-colors duration-(--dur-instant) data-disabled:pointer-events-none data-disabled:text-disabled-fg data-highlighted:bg-highlight [&_svg]:size-icon-md [&_svg]:shrink-0 [&_svg]:text-fg-muted";

export function DropdownMenuContent({
  className,
  sideOffset = 6,
  align = "end",
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        align={align}
        className={cn(panel, "origin-(--radix-dropdown-menu-content-transform-origin)", className)}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({
  className,
  destructive,
  shortcut,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Item> & { destructive?: boolean; shortcut?: string }) {
  return (
    <MenuPrimitive.Item
      className={cn(itemBase, destructive && "text-danger-fg data-highlighted:bg-danger-soft [&_svg]:text-danger-fg", className)}
      {...props}
    >
      {/* asChild needs exactly one child element, so the shortcut hint only renders on plain items */}
      {props.asChild || !shortcut ? (
        children
      ) : (
        <>
          {children}
          <span className="ml-auto pl-4 text-caption text-fg-muted">{shortcut}</span>
        </>
      )}
    </MenuPrimitive.Item>
  );
}

export function DropdownMenuCheckboxItem({ className, children, ...props }: React.ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return (
    <MenuPrimitive.CheckboxItem className={cn(itemBase, "pr-9", className)} {...props}>
      {children}
      <MenuPrimitive.ItemIndicator className="absolute right-3">
        <Check aria-hidden className="text-accent!" />
      </MenuPrimitive.ItemIndicator>
    </MenuPrimitive.CheckboxItem>
  );
}

export function DropdownMenuRadioItem({ className, children, ...props }: React.ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return (
    <MenuPrimitive.RadioItem className={cn(itemBase, "pr-9", className)} {...props}>
      {children}
      <MenuPrimitive.ItemIndicator className="absolute right-3 flex">
        <span className="size-2 rounded-pill bg-accent" />
      </MenuPrimitive.ItemIndicator>
    </MenuPrimitive.RadioItem>
  );
}

export function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label className={cn("px-3 pt-2 pb-1 text-caption text-fg-muted", className)} {...props} />;
}

export function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator className={cn("-mx-1.5 my-1.5 h-px bg-border-subtle", className)} {...props} />;
}

export function DropdownMenuSubTrigger({ className, children, ...props }: React.ComponentProps<typeof MenuPrimitive.SubTrigger>) {
  return (
    <MenuPrimitive.SubTrigger className={cn(itemBase, "data-[state=open]:bg-highlight", className)} {...props}>
      {children}
      <ChevronRight aria-hidden className="ml-auto" />
    </MenuPrimitive.SubTrigger>
  );
}

export function DropdownMenuSubContent({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.SubContent>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent sideOffset={8} className={cn(panel, className)} {...props} />
    </MenuPrimitive.Portal>
  );
}
