import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkipLink } from "@/components/ui/skip-link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DsMobileNav, DsSidebar } from "@/components/docs/ds-sidebar";
import { DsPrevNext } from "@/components/docs/ds-prev-next";
import { DsToc } from "@/components/docs/ds-toc";
import { BrandMark } from "@/components/layout/brand-mark";

export const metadata: Metadata = {
  title: { default: "Design System", template: "%s · BlueSigns Design System" },
};

export default function DesignSystemLayout({ children }: LayoutProps<"/design-system">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SkipLink />
      <header className="sticky top-0 z-(--z-sticky) px-(--gutter) pt-4">
        <div className="mx-auto flex h-16 max-w-(--container-wide) items-center gap-3 rounded-pill bg-surface pr-2 pl-5 shadow-card">
          <Link href="/design-system" className="flex items-center gap-2.5 rounded-pill">
            <BrandMark />
            <span className="hidden text-body text-fg-muted sm:inline">Design System</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle variant="segmented" className="hidden sm:inline-flex" />
            <ThemeToggle className="sm:hidden" />
            <Button asChild variant="neutral" size="md" trailingIcon={<ArrowUpRight aria-hidden />}>
              <Link href="/">Storefront</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-(--container-wide) flex-1 gap-10 px-(--gutter) pt-8 pb-24">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pb-6">
            <DsSidebar />
          </div>
        </aside>
        <main id="main" className="min-w-0 flex-1">
          <div className="mb-8 lg:hidden">
            <DsMobileNav />
          </div>
          {children}
          <DsPrevNext />
        </main>
        <aside className="hidden w-44 shrink-0 xl:block">
          <div className="sticky top-28">
            <DsToc />
          </div>
        </aside>
      </div>
    </div>
  );
}
