"use client";

import Image from "next/image";
import { Toast as ToastPrimitive } from "radix-ui";
import { CircleAlert, CircleCheck, Info, Sparkles, X } from "lucide-react";
import { dismissToast, useToasts, type ToastTone } from "@/components/providers/toast-store";
import { cn } from "@/lib/cn";
import { Button } from "./button";
import { IconButton } from "./icon-button";
import { IconTile } from "./icon-tile";

const toneIcon: Record<ToastTone, React.ReactNode> = {
  neutral: null,
  success: <CircleCheck aria-hidden className="text-success" />,
  danger: <CircleAlert aria-hidden className="text-danger" />,
  info: <Info aria-hidden className="text-info" />,
  accent: <Sparkles aria-hidden className="text-accent" />,
};

export function Toaster() {
  const toasts = useToasts();
  return (
    <ToastPrimitive.Provider swipeDirection="right" duration={4500}>
      {toasts.map((t) => (
        <ToastPrimitive.Root
          key={t.id}
          open={t.open}
          duration={t.duration}
          type={t.tone === "danger" ? "foreground" : "background"}
          onOpenChange={(open) => !open && dismissToast(t.id)}
          className={cn(
            "group pointer-events-auto relative flex w-full items-center gap-3 rounded-xl bg-surface-raised p-3 pr-10 text-fg shadow-popover",
            "data-[state=open]:animate-slide-in-right data-[state=closed]:animate-fade-out",
            "data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform data-[swipe=end]:animate-slide-out-right",
          )}
        >
          {t.image ? (
            <Image
              src={t.image}
              alt=""
              width={48}
              height={48}
              sizes="48px"
              className="size-12 shrink-0 rounded-md bg-surface-sunken object-cover"
            />
          ) : (
            toneIcon[t.tone ?? "neutral"] && (
              <IconTile size="md">{toneIcon[t.tone ?? "neutral"]}</IconTile>
            )
          )}
          <div className="min-w-0 flex-1 pl-1">
            <ToastPrimitive.Title className="text-body-strong">{t.title}</ToastPrimitive.Title>
            {t.description && (
              <ToastPrimitive.Description className="text-caption text-fg-muted">{t.description}</ToastPrimitive.Description>
            )}
          </div>
          {t.action && (
            <ToastPrimitive.Action altText={t.action.label} asChild>
              <Button variant="neutral" size="sm" onClick={t.action.onClick}>
                {t.action.label}
              </Button>
            </ToastPrimitive.Action>
          )}
          <ToastPrimitive.Close asChild>
            <IconButton label="Dismiss" variant="ghost" size="xs" className="absolute top-2 right-2">
              <X aria-hidden />
            </IconButton>
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="fixed right-0 bottom-0 z-(--z-toast) flex w-full max-w-sm flex-col gap-2 p-4 outline-none" />
    </ToastPrimitive.Provider>
  );
}
