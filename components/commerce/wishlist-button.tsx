"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { useWishlist, wishlist } from "@/components/providers/wishlist-store";
import { cn } from "@/lib/cn";

export type WishlistButtonProps = {
  productName: string;
  /**
   * Product slug. When given, the button reads and writes the shared wishlist store (so every
   * instance and the header count stay in sync); without it the button keeps local state.
   */
  slug?: string;
  /** Current price, stored to detect later price drops. */
  price?: number;
  defaultSaved?: boolean;
  onToggle?: (saved: boolean) => void;
  size?: "sm" | "md" | "lg";
  /** "overlay" sits on product imagery with a translucent white fill. */
  variant?: "overlay" | "secondary";
  notify?: boolean;
  className?: string;
};

const sizes = { sm: "hit-area size-control-sm [&_svg]:size-icon-md", md: "size-control-md [&_svg]:size-icon-base", lg: "size-control-lg [&_svg]:size-icon-lg" };

export function WishlistButton({
  productName,
  slug,
  price,
  defaultSaved = false,
  onToggle,
  size = "md",
  variant = "overlay",
  notify = true,
  className,
}: WishlistButtonProps) {
  const entries = useWishlist();
  const [localSaved, setLocalSaved] = useState(defaultSaved);
  const saved = slug ? entries.some((e) => e.slug === slug) : localSaved;

  return (
    <button
      type="button"
      data-slot="wishlist-button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = slug ? wishlist.toggle(slug, price) : !saved;
        if (!slug) setLocalSaved(next);
        onToggle?.(next);
        if (notify) toast({ title: next ? "Saved to wishlist" : "Removed from wishlist", description: productName, tone: next ? "accent" : "neutral" });
      }}
      className={cn(
        "group/wish relative inline-flex shrink-0 items-center justify-center rounded-pill press state-layer transition-[background-color,transform,color] duration-(--dur-fast) ease-out",
        variant === "overlay" && "bg-surface/80 text-fg backdrop-blur-sm hover:bg-surface",
        variant === "secondary" && "border border-border bg-surface text-fg",
        saved && "text-danger",
        sizes[size],
        className,
      )}
    >
      <Heart aria-hidden className={cn("transition-transform duration-(--dur-base)", saved && "scale-110 fill-current")} />
    </button>
  );
}
