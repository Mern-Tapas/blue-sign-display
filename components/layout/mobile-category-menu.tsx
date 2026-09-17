"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ArrowLeft, ChevronRight, HelpCircle, Package, Heart, X } from "lucide-react";
import { ProductImage } from "@/components/commerce/product-image";
import { DialogOverlay } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { TextButton } from "@/components/ui/text-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/cn";
import { BrandMark } from "./brand-mark";
import type { MegaMenuCategory, NavLink } from "./mega-menu";

export type MobileCategoryMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: MegaMenuCategory[];
  /** Extra links under the categories (New in, Offers…). */
  links?: NavLink[];
  /** Signed-in greeting; omit when signed out. */
  userName?: string;
  onSignIn?: () => void;
  hrefFor?: (category: MegaMenuCategory, subcategory?: string) => string;
};

const defaultHref = (c: MegaMenuCategory, sub?: string) => `/shop?category=${c.slug}${sub ? `&sub=${encodeURIComponent(sub.toLowerCase())}` : ""}`;

/**
 * Phone category browser in a left sheet. Two levels: tap a category to slide to its
 * subcategories, Back returns. Focus moves to the new level's heading so screen-reader and
 * keyboard users follow the drill-in; links close the sheet.
 */
export function MobileCategoryMenu({ open, onOpenChange, categories, links = [], userName, onSignIn, hrefFor = defaultHref }: MobileCategoryMenuProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const levelRef = useRef<HTMLDivElement>(null);
  const active = categories.find((c) => c.slug === activeSlug) ?? null;

  function go(slug: string | null) {
    setActiveSlug(slug);
    requestAnimationFrame(() => levelRef.current?.querySelector<HTMLElement>("[data-level-heading]")?.focus());
  }

  const close = () => onOpenChange(false);
  const row =
    "state-layer relative flex min-h-row-lg w-full items-center gap-3 rounded-lg px-3 text-left text-body text-fg focus-ring-row [&>svg]:size-icon-md [&>svg]:shrink-0 [&>svg]:text-fg-muted";

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setActiveSlug(null);
      }}
    >
      <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogPrimitive.Content
          data-slot="mobile-category-menu"
          className="fixed inset-y-0 left-0 z-(--z-modal) flex w-[min(22rem,calc(100vw-3rem))] flex-col bg-surface text-fg shadow-modal outline-none data-[state=closed]:animate-slide-out-left data-[state=open]:animate-slide-in-left"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-3">
            <BrandMark />
            <DialogPrimitive.Close asChild>
              <IconButton label="Close menu" variant="sunken" size="sm" className="text-fg-muted hover:text-fg">
                <X aria-hidden />
              </IconButton>
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Title className="sr-only">Shop by category</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">Browse categories and account shortcuts</DialogPrimitive.Description>

          <div ref={levelRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {active ? (
              <div key={active.slug} className="flex animate-fade-in flex-col gap-1 p-2">
                <button type="button" onClick={() => go(null)} className={cn(row, "text-fg-muted")}>
                  <ArrowLeft aria-hidden />
                  All categories
                </button>
                <div className="flex items-center gap-3 px-3 pt-2 pb-3">
                  <ProductImage src={active.image} alt="" sizes="48px" wrapperClassName="size-12 shrink-0 rounded-pill" />
                  <h2 data-level-heading tabIndex={-1} className="text-heading-sm outline-none">
                    {active.name}
                  </h2>
                </div>
                <ul className="flex flex-col">
                  <li>
                    <Link href={hrefFor(active)} onClick={close} className={cn(row, "text-body-strong")}>
                      Shop all {active.name}
                      <ChevronRight aria-hidden className="ml-auto" />
                    </Link>
                  </li>
                  {active.subcategories.map((sub) => (
                    <li key={sub}>
                      <Link href={hrefFor(active, sub)} onClick={close} className={row}>
                        {sub}
                        <ChevronRight aria-hidden className="ml-auto" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col gap-4 p-2">
                <div className="px-3 pt-2">
                  <h2 data-level-heading tabIndex={-1} className="text-heading-sm outline-none">
                    {userName ? `Hi, ${userName.split(" ")[0]}` : "Shop by category"}
                  </h2>
                  {!userName && onSignIn && (
                    <TextButton onClick={onSignIn} className="mt-1">
                      Sign in for orders and wishlist
                    </TextButton>
                  )}
                </div>
                <ul className="flex flex-col">
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <button type="button" onClick={() => go(c.slug)} aria-label={`${c.name}, ${c.subcategories.length} subcategories`} className={row}>
                        <ProductImage src={c.image} alt="" sizes="40px" wrapperClassName="size-10 shrink-0 rounded-pill" />
                        <span className="flex-1 text-body-strong">{c.name}</span>
                        <ChevronRight aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
                {links.length > 0 && (
                  <ul className="flex flex-col border-t border-border-subtle pt-2">
                    {links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} onClick={close} className={row}>
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <ul className="flex flex-col border-t border-border-subtle pt-2">
                  {[
                    { href: "/account/orders", label: "Orders", icon: Package },
                    { href: "/account/wishlist", label: "Wishlist", icon: Heart },
                    { href: "/help", label: "Help centre", icon: HelpCircle },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} onClick={close} className={row}>
                        <l.icon aria-hidden />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border-subtle px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <span className="text-caption text-fg-muted">Theme</span>
            <ThemeToggle variant="segmented" />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
