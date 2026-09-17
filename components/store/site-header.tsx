"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationMenu } from "radix-ui";
import {
  ArrowRight,
  ArrowUpRight,
  Backpack,
  BadgeCheck,
  ChevronDown,
  Menu,
  Monitor,
  RectangleVertical,
  Smartphone,
  Tablet,
} from "lucide-react";
import { BrandMark } from "@/components/layout/brand-mark";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { IconTile } from "@/components/ui/icon-tile";
import { Sheet, SheetBody, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/cn";
import { placements, series, sizeRange, SITE_URL, WARRANTY, type Placement } from "@/lib/data/can-products";

const links = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/iq-world", label: "IQ World" },
  { href: "/#why-digital", label: "Why digital" },
  { href: "/contact", label: "Contact" },
];

const placementIcon: Record<Placement, React.ReactNode> = {
  floor: <RectangleVertical aria-hidden />,
  portable: <Backpack aria-hidden />,
  wall: <Monitor aria-hidden />,
  desk: <Tablet aria-hidden />,
};

const spotlight = ["canvue", "can", "canmount", "candesk-touch"].map((slug) => series.find((s) => s.slug === slug)!);

function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Link with an accent underline for the current page, used in the main bar. */
const navLink =
  "relative inline-flex h-16 items-center gap-1.5 px-3 text-label text-fg-muted transition-colors duration-(--dur-fast) hover:text-fg " +
  "after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-pill after:bg-accent after:opacity-0 after:transition-opacity after:duration-(--dur-fast) " +
  "data-[active]:text-fg data-[active]:after:opacity-100 data-[state=open]:text-fg";

function useScrolled(offset = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return scrolled;
}

function UtilityStrip() {
  return (
    <div className="hidden bg-surface-contrast text-fg-on-contrast-muted sm:block">
      <div className="container-ds flex h-9 items-center justify-between gap-4 text-caption">
        <p className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <BadgeCheck aria-hidden className="size-icon-sm text-fg-on-contrast" />
            {WARRANTY} on every CAN display
          </span>
          <span className="hidden items-center gap-1.5 md:inline-flex">
            <Smartphone aria-hidden className="size-icon-sm text-fg-on-contrast" />
            Manage every screen from the IQ World app
          </span>
        </p>
        <a
          href={`https://${SITE_URL}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 transition-colors duration-(--dur-fast) hover:text-fg-on-contrast"
        >
          {SITE_URL}
          <ArrowUpRight aria-hidden className="size-icon-sm" />
        </a>
      </div>
    </div>
  );
}

function DisplaysMenu({ active }: { active: boolean }) {
  return (
    <NavigationMenu.Item>
      <NavigationMenu.Trigger className={cn(navLink, "group")} data-active={active ? "" : undefined}>
        Displays
        <ChevronDown aria-hidden className="size-icon-sm transition-transform duration-(--dur-fast) group-data-[state=open]:rotate-180" />
      </NavigationMenu.Trigger>
      <NavigationMenu.Content className="w-[min(60rem,calc(100vw-2*var(--gutter)))] p-3 data-[motion^=from-]:animate-fade-in data-[motion^=to-]:animate-fade-out">
        <div className="grid gap-3 lg:grid-cols-[18rem_1fr]">
          <div className="flex flex-col gap-1 rounded-xl bg-surface-sunken p-2">
            <p className="px-3 pt-2 pb-1 text-overline text-fg-muted">Shop by placement</p>
            {placements.map((p) => (
              <NavigationMenu.Link asChild key={p.value}>
                <Link
                  href={`/products?placement=${p.value}`}
                  className="group/item flex items-center gap-3 rounded-lg p-2.5 transition-colors duration-(--dur-fast) hover:bg-surface"
                >
                  <IconTile size="sm" className="bg-surface transition-colors duration-(--dur-fast) group-hover/item:bg-accent group-hover/item:text-fg-on-accent">
                    {placementIcon[p.value]}
                  </IconTile>
                  <span className="min-w-0">
                    <span className="block text-body-strong text-fg">{p.label}</span>
                    <span className="block truncate text-caption text-fg-muted">{p.description}</span>
                  </span>
                </Link>
              </NavigationMenu.Link>
            ))}
            <NavigationMenu.Link asChild>
              <Link
                href="/products"
                className="mt-1 inline-flex h-10 items-center justify-between rounded-lg bg-surface px-3 text-label text-fg shadow-flat transition-shadow duration-(--dur-fast) hover:shadow-xs"
              >
                All {series.length} series
                <ArrowRight aria-hidden className="size-icon-md" />
              </Link>
            </NavigationMenu.Link>
          </div>

          <div className="flex flex-col gap-2">
            <p className="px-1 pt-2 text-overline text-fg-muted">Popular series</p>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {spotlight.map((s) => (
                <NavigationMenu.Link asChild key={s.slug}>
                  <Link href={`/products/${s.slug}`} className="group/card flex flex-col gap-2 rounded-xl p-2 transition-colors duration-(--dur-fast) hover:bg-surface-sunken">
                    <span className="relative block aspect-[4/5] overflow-hidden rounded-lg bg-white shadow-flat">
                      <Image
                        src={s.images[0]!.src}
                        alt=""
                        fill
                        sizes="180px"
                        className="object-contain p-2 transition-transform duration-(--dur-slow) group-hover/card:scale-105"
                      />
                    </span>
                    <span className="px-1">
                      <span className="block text-body-strong text-fg">{s.name}</span>
                      <span className="block text-caption text-fg-muted">
                        {s.headline} · {sizeRange(s)}
                      </span>
                    </span>
                  </Link>
                </NavigationMenu.Link>
              ))}
            </div>
          </div>
        </div>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <IconButton label="Open menu" variant="sunken" className="lg:hidden">
          <Menu aria-hidden />
        </IconButton>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader title={<BrandMark />} description="CAN digital signage, 10.1″ to 65″" />
        <SheetBody className="flex flex-col gap-2 pb-4">
          <Accordion type="single" collapsible defaultValue="displays">
            <AccordionItem value="displays">
              <AccordionTrigger>Displays</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4">
                  {placements.map((p) => (
                    <div key={p.value}>
                      <SheetClose asChild>
                        <Link href={`/products?placement=${p.value}`} className="mb-1 flex items-center justify-between text-overline text-fg-muted hover:text-fg">
                          {p.label}
                          <ArrowRight aria-hidden className="size-icon-sm" />
                        </Link>
                      </SheetClose>
                      <ul className="flex flex-col">
                        {series
                          .filter((s) => s.placement === p.value)
                          .map((s) => (
                            <li key={s.slug}>
                              <SheetClose asChild>
                                <Link
                                  href={`/products/${s.slug}`}
                                  aria-current={pathname === `/products/${s.slug}` ? "page" : undefined}
                                  className="flex items-center gap-3 rounded-lg p-1.5 hover:bg-surface-hover aria-[current=page]:bg-accent-soft"
                                >
                                  <span className="relative size-11 shrink-0 overflow-hidden rounded-md bg-white shadow-flat">
                                    <Image src={s.images[0]!.src} alt="" fill sizes="44px" className="object-contain p-1" />
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block text-body-strong">{s.name}</span>
                                    <span className="block truncate text-caption text-fg-muted">
                                      {s.headline} · {sizeRange(s)}
                                    </span>
                                  </span>
                                </Link>
                              </SheetClose>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <nav aria-label="More" className="flex flex-col">
            {links.map((l) => (
              <SheetClose asChild key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(pathname, l.href) ? "page" : undefined}
                  className="flex h-row-md items-center justify-between border-b border-border-subtle text-body-strong last:border-b-0 aria-[current=page]:text-accent-fg"
                >
                  {l.label}
                  <ArrowRight aria-hidden className="size-icon-md text-fg-muted" />
                </Link>
              </SheetClose>
            ))}
          </nav>
        </SheetBody>
        <SheetFooter>
          <ThemeToggle variant="segmented" />
          <SheetClose asChild>
            <Button asChild fullWidth size="lg" trailingIcon={<ArrowUpRight aria-hidden />}>
              <Link href="/contact">Get a quote</Link>
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useScrolled();

  return (
    <>
      <UtilityStrip />
      <header
        data-scrolled={scrolled || undefined}
        className={cn(
          "sticky top-0 z-(--z-sticky) border-b transition-[background-color,border-color,box-shadow] duration-(--dur-base)",
          scrolled
            ? "border-border-subtle bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] shadow-xs backdrop-blur-md"
            : "border-transparent bg-surface",
        )}
      >
        <div className="container-ds flex h-16 items-center gap-2">
          <MobileMenu pathname={pathname} />

          <Link href="/" aria-label="BlueSigns home" className="rounded-sm focus-visible:outline-2 focus-visible:outline-focus-ring">
            <BrandMark />
          </Link>

          <NavigationMenu.Root className="ml-6 hidden lg:block" delayDuration={80}>
            <NavigationMenu.List className="flex items-center">
              <DisplaysMenu active={pathname.startsWith("/products")} />
              {links.map((l) => {
                const active = isActive(pathname, l.href);
                return (
                  <NavigationMenu.Item key={l.href}>
                    <NavigationMenu.Link asChild active={active}>
                      <Link href={l.href} className={navLink} aria-current={active ? "page" : undefined}>
                        {l.label}
                      </Link>
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                );
              })}
            </NavigationMenu.List>
            {/* Anchored to the header (not the nav) so the panel lines up with the page container at any width. */}
            <div className="absolute inset-x-0 top-full z-(--z-dropdown) pt-2">
              <div className="container-ds">
                <NavigationMenu.Viewport className="h-(--radix-navigation-menu-viewport-height) w-(--radix-navigation-menu-viewport-width) origin-top overflow-hidden rounded-2xl bg-surface-raised shadow-popover transition-[width,height] duration-(--dur-base) data-[state=closed]:animate-scale-out data-[state=open]:animate-scale-in" />
              </div>
            </div>
          </NavigationMenu.Root>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <span aria-hidden className="mx-1 hidden h-6 w-px bg-border sm:block" />
            <Button asChild size="md" trailingIcon={<ArrowUpRight aria-hidden />}>
              <Link href="/contact">
                <span className="sm:hidden">Quote</span>
                <span className="hidden sm:inline">Get a quote</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
