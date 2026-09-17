"use client";

import { useState } from "react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import { Button } from "./button";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogAction = AlertDialogPrimitive.Action;
export const AlertDialogCancel = AlertDialogPrimitive.Cancel;

export type AlertDialogContentProps = Omit<React.ComponentProps<typeof AlertDialogPrimitive.Content>, "title"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "default" | "danger";
};

/**
 * Interrupting confirmation (role="alertdialog"). Unlike Dialog it has no close button and
 * ignores outside clicks: the shopper must choose. Focus starts on Cancel, the safe option.
 */
export function AlertDialogContent({ title, description, icon, tone = "default", className, children, ...props }: AlertDialogContentProps) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay
        data-slot="alert-dialog-overlay"
        className="fixed inset-0 z-(--z-overlay) bg-overlay backdrop-blur-[2px] data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in"
      />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-(--z-modal) flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-5 overflow-y-auto",
          "rounded-2xl bg-surface p-6 text-fg shadow-modal outline-none data-[state=closed]:animate-scale-out data-[state=open]:animate-scale-in",
          className,
        )}
        {...props}
      >
        <div className="flex flex-col gap-1.5">
          {icon && (
            <span
              aria-hidden
              className={cn(
                "mb-2 flex size-12 items-center justify-center rounded-pill [&_svg]:size-5",
                tone === "danger" ? "bg-danger-soft text-danger-fg" : "bg-accent-soft text-accent-soft-fg",
              )}
            >
              {icon}
            </span>
          )}
          <AlertDialogPrimitive.Title className="text-heading-md">{title}</AlertDialogPrimitive.Title>
          {description && <AlertDialogPrimitive.Description className="text-body text-fg-muted">{description}</AlertDialogPrimitive.Description>}
        </div>
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  );
}

export function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-footer" className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
}

export type ConfirmDialogProps = Omit<AlertDialogContentProps, "children"> & {
  /** Element that opens the dialog (rendered with asChild). */
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Async confirm keeps the dialog open with a loading button until it resolves. Throw to keep it open. */
  onConfirm: () => void | Promise<void>;
  /** Extra content between the text and the buttons (e.g. a reason select). */
  body?: React.ReactNode;
  confirmDisabled?: boolean;
};

/** Ready-made confirm flow: "Remove item?", "Cancel order?", "Delete account?". */
export function ConfirmDialog({
  trigger,
  open: openProp,
  onOpenChange,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  body,
  confirmDisabled,
  tone = "default",
  ...content
}: ConfirmDialogProps) {
  const [openState, setOpenState] = useState(false);
  const [busy, setBusy] = useState(false);
  const open = openProp ?? openState;

  function setOpen(next: boolean) {
    if (busy) return;
    if (openProp === undefined) setOpenState(next);
    onOpenChange?.(next);
  }

  async function confirm(e: React.MouseEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await onConfirm();
      setBusy(false);
      if (openProp === undefined) setOpenState(false);
      onOpenChange?.(false);
    } catch {
      setBusy(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent tone={tone} {...content}>
        {body}
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="secondary" disabled={busy}>
              {cancelLabel}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant={tone === "danger" ? "danger" : "primary"} loading={busy} disabled={confirmDisabled} onClick={confirm}>
              {confirmLabel}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
