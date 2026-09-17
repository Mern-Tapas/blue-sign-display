"use client";

import Link from "next/link";
import { NavigationMenu } from "radix-ui";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { ProductImage } from "@/components/commerce/product-image";
import { cn } from "@/lib/cn";

export type MegaMenuCategory = {
  slug: string;
  name: string;
  image: string;
  subcategories: string[];
};

export type NavLink = { href: string; label: string };

export type MegaMenuProps = {
  categories: MegaMenuCategory[];
  links: NavLink[];
  pathname: string;
  className?: string;
};

const pill =
  "inline-flex h-10 items-center gap-1.5 rounded-pill px-4 text-label text-fg-muted transition-colors duration-(--dur-fast) hover:text-fg data-[active]:bg-surface-inverse data-[active]:text-fg-inverse data-[state=open]:text-fg";

/** Segmented pill navigation with a "Shop" mega-menu panel. */
export function MegaMenu({ categories, links, pathname, className }: MegaMenuProps) {
  const [featured, ...rest] = categories;
  return (
    <NavigationMenu.Root className={cn("relative", className)} delayDuration={80}>
      <NavigationMenu.List className="flex items-center gap-0.5 rounded-pill bg-surface-sunken p-1">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={cn(pill, "group")} data-active={pathname.startsWith("/shop") ? "" : undefined}>
            Shop
            <ChevronDown aria-hidden className="size-icon-sm transition-transform duration-(--dur-fast) group-data-[state=open]:rotate-180" />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="w-[min(56rem,calc(100vw-3rem))] p-3 data-[motion^=from-]:animate-fade-in data-[motion^=to-]:animate-fade-out">
            <div className="grid gap-3 md:grid-cols-[1.1fr_2fr]">
              {featured && (
                <NavigationMenu.Link asChild>
                  <Link
                    href={`/shop?category=${featured.slug}`}
                    className="group relative flex min-h-64 flex-col justify-end overflow-hidden rounded-xl bg-surface-contrast p-5 text-fg-on-contrast"
                  >
                    <ProductImage
                      src={featured.image}
                      alt=""
                      sizes="320px"
                      wrapperClassName="absolute inset-0 bg-surface-contrast"
                      className="opacity-70 transition-transform duration-(--dur-slow) motion-safe:group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-scrim to-transparent" />
                    <div className="relative">
                      <p className="text-caption text-fg-on-contrast-muted">Featured</p>
                      <p className="text-heading-md text-fg-on-contrast">{featured.name}</p>
                      <span className="mt-3 inline-flex h-8 items-center gap-1 rounded-pill bg-white px-3 text-label text-black">
                        Shop now <ArrowUpRight aria-hidden className="size-icon-sm" />
                      </span>
                    </div>
                  </Link>
                </NavigationMenu.Link>
              )}
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                {rest.map((c) => (
                  <div key={c.slug} className="rounded-lg p-3 transition-colors duration-(--dur-fast) hover:bg-surface-sunken">
                    <NavigationMenu.Link asChild>
                      <Link href={`/shop?category=${c.slug}`} className="mb-2 flex items-center gap-2.5">
                        <ProductImage src={c.image} alt="" sizes="40px" wrapperClassName="size-9 shrink-0 rounded-pill" />
                        <span className="text-body-strong text-fg">{c.name}</span>
                      </Link>
                    </NavigationMenu.Link>
                    <ul className="flex flex-col gap-1 pl-[2.875rem]">
                      {c.subcategories.slice(0, 3).map((s) => (
                        <li key={s}>
                          <NavigationMenu.Link asChild>
                            <Link href={`/shop?category=${c.slug}`} className="text-label font-normal text-fg-muted hover:text-accent-fg">
                              {s}
                            </Link>
                          </NavigationMenu.Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        {links.map((l) => {
          // Query-string shortcuts (e.g. /shop?sort=newest) never claim the active state — "Shop" owns /shop.
          const active = l.href.includes("?") ? false : l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
          return (
            <NavigationMenu.Item key={l.href}>
              <NavigationMenu.Link asChild active={active}>
                <Link href={l.href} className={pill} aria-current={active ? "page" : undefined}>
                  {l.label}
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>

      <div className="absolute top-full left-1/2 z-(--z-dropdown) -translate-x-1/2 pt-3">
        <NavigationMenu.Viewport className="h-(--radix-navigation-menu-viewport-height) w-(--radix-navigation-menu-viewport-width) origin-top overflow-hidden rounded-2xl border border-border-subtle bg-surface-raised shadow-popover transition-[width,height] duration-(--dur-base) data-[state=closed]:animate-scale-out data-[state=open]:animate-scale-in" />
      </div>
    </NavigationMenu.Root>
  );
}
