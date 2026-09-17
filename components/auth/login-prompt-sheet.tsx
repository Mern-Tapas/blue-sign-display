"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import { Heart, MessageSquareText, Package, ShoppingBag, Smartphone, UserRound, X } from "lucide-react";
import { DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { IconTile } from "@/components/ui/icon-tile";
import { cn } from "@/lib/cn";
import { SocialAuthButtons } from "./social-auth-buttons";
import type { SocialProvider } from "./types";

export type LoginPromptReason = "wishlist" | "checkout" | "review" | "orders" | "generic";

const copy: Record<LoginPromptReason, { icon: React.ReactNode; title: string; description: string }> = {
  wishlist: { icon: <Heart />, title: "Sign in to save to your wishlist", description: "Your wishlist syncs across phone and desktop, and we’ll tell you when prices drop." },
  checkout: { icon: <ShoppingBag />, title: "Sign in to place your order", description: "We use your account for delivery updates, invoices and easy returns. Your bag is kept." },
  review: { icon: <MessageSquareText />, title: "Sign in to write a review", description: "Reviews come from signed-in shoppers so others can trust them." },
  orders: { icon: <Package />, title: "Sign in to see your orders", description: "Track deliveries, download invoices and start returns." },
  generic: { icon: <UserRound />, title: "Sign in to continue", description: "It takes less than a minute with your mobile number." },
};

export type LoginPromptSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: LoginPromptReason;
  /** Override the reason copy. */
  title?: string;
  description?: string;
  onContinueWithMobile: () => void;
  onContinueWithEmail?: () => void;
  onSocial?: (provider: SocialProvider) => void | Promise<void>;
  /** "Not now" keeps the shopper where they were. */
  dismissLabel?: string;
};

/**
 * Interrupts a logged-out action (wishlist, checkout, review) with a short reason and the
 * fastest sign-in routes. Bottom sheet on phones, centred dialog from sm. Dismissing returns
 * focus to the button that triggered it.
 */
export function LoginPromptSheet({
  open,
  onOpenChange,
  reason = "generic",
  title,
  description,
  onContinueWithMobile,
  onContinueWithEmail,
  onSocial,
  dismissLabel = "Not now",
}: LoginPromptSheetProps) {
  const c = copy[reason];
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogPrimitive.Content
          data-slot="login-prompt"
          className={cn(
            "fixed z-(--z-modal) flex flex-col gap-5 bg-surface p-6 pt-3 text-fg shadow-modal outline-none",
            // Phone: bottom sheet
            "inset-x-0 bottom-0 max-h-[90dvh] overflow-y-auto rounded-t-2xl pb-[max(1.5rem,env(safe-area-inset-bottom))] data-[state=closed]:animate-slide-out-bottom data-[state=open]:animate-slide-in-bottom",
            // sm+: centred dialog
            "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-[calc(100vw-2rem)] sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:pt-6 sm:data-[state=closed]:animate-scale-out sm:data-[state=open]:animate-scale-in",
          )}
        >
          <div aria-hidden className="mx-auto h-1.5 w-12 shrink-0 rounded-pill bg-border-strong sm:hidden" />
          <DialogPrimitive.Close asChild>
            <IconButton label="Close" variant="sunken" size="sm" className="absolute top-5 right-5 text-fg-muted hover:text-fg max-sm:hidden">
              <X aria-hidden />
            </IconButton>
          </DialogPrimitive.Close>
          <div className="flex flex-col gap-2 pr-10 max-sm:pr-0">
            <IconTile size="lg" tone="accent" className="mb-1">
              {c.icon}
            </IconTile>
            <DialogPrimitive.Title className="text-heading-md">{title ?? c.title}</DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-body text-fg-muted">{description ?? c.description}</DialogPrimitive.Description>
          </div>
          <div className="flex flex-col gap-3">
            <Button size="lg" fullWidth leadingIcon={<Smartphone aria-hidden />} onClick={onContinueWithMobile}>
              Continue with mobile number
            </Button>
            {onContinueWithEmail && (
              <Button variant="secondary" size="lg" fullWidth onClick={onContinueWithEmail}>
                Sign in with email
              </Button>
            )}
          </div>
          {onSocial && <SocialAuthButtons onSelect={onSocial} layout="row" />}
          <DialogPrimitive.Close asChild>
            <Button variant="ghost" fullWidth>
              {dismissLabel}
            </Button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
