"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { DialogOverlay } from "./dialog";
import { IconButton } from "./icon-button";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

const sheetVariants = cva("fixed z-(--z-modal) flex flex-col bg-surface text-fg shadow-modal outline-none", {
  variants: {
    side: {
      right:
        "inset-y-2 right-2 w-[calc(100vw-1rem)] max-w-md rounded-2xl data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right",
      left: "inset-y-2 left-2 w-[calc(100vw-1rem)] max-w-sm rounded-2xl data-[state=open]:animate-slide-in-left data-[state=closed]:animate-slide-out-left",
      bottom:
        "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-2xl data-[state=open]:animate-slide-in-bottom data-[state=closed]:animate-slide-out-bottom",
    },
  },
  defaultVariants: { side: "right" },
});

export type SheetContentProps = React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof sheetVariants> & { hideClose?: boolean };

export function SheetContent({ side, className, hideClose, children, ...props }: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content data-slot="sheet-content" className={cn(sheetVariants({ side }), className)} {...props}>
        {side === "bottom" && <div aria-hidden className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-pill bg-border-strong" />}
        {children}
        {!hideClose && (
          <DialogPrimitive.Close asChild>
            <IconButton label="Close" variant="sunken" size="sm" className="absolute top-5 right-5 text-fg-muted hover:text-fg">
              <X aria-hidden />
            </IconButton>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function SheetHeader({
  title,
  description,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & { title: React.ReactNode; description?: React.ReactNode }) {
  return (
    <div data-slot="sheet-header" className={cn("flex flex-col gap-1 px-6 pt-6 pb-4 pr-16", className)} {...props}>
      <DialogPrimitive.Title className="text-heading-md">{title}</DialogPrimitive.Title>
      {description ? (
        <DialogPrimitive.Description className="text-body text-fg-muted">{description}</DialogPrimitive.Description>
      ) : (
        <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
      )}
      {children}
    </div>
  );
}

export function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-body" className={cn("min-h-0 flex-1 overflow-y-auto px-6", className)} {...props} />;
}

export function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("m-2 mt-auto flex flex-col gap-3 rounded-lg bg-surface-sunken p-4", className)}
      {...props}
    />
  );
}
