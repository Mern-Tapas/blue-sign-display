import type { Metadata } from "next";
import { CreditCard, Heart, Home, LayoutGrid, LogOut, Package, Settings } from "lucide-react";
import { AccordionDemo, PaginationDemo, TabsDemo } from "@/components/docs/demos/navigation-demo";
import { BackToTopDemo, LoadMoreDemo } from "@/components/docs/demos/structure-demo";
import { DsPageHeader, DsPreview, DsProps, DsSection } from "@/components/docs/ds-section";
import { Footer } from "@/components/layout/footer";
import { IconRail } from "@/components/layout/icon-rail";
import { Navbar } from "@/components/layout/navbar";
import { NewsletterSignup } from "@/components/commerce/newsletter-signup";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { avatars } from "@/lib/data/images";
import { categories, products } from "@/lib/data/products";

export const metadata: Metadata = { title: "Navigation" };

export default function NavigationPage() {
  return (
    <>
      <DsPageHeader
        title="Navigation"
        description="The floating pill navbar is the signature element: segmented links, a mega-menu, circular icon actions and a user chip."
      />

      <DsSection title="Navbar & mega menu" description="Hover “Shop” for the mega menu. Below lg it collapses to a menu button that opens a left sheet.">
        <DsPreview surface="canvas" overflowVisible className="block min-h-[30rem] p-4">
          <Navbar
            className="static px-0 pt-0"
            categories={categories}
            suggestions={products.map((p) => ({ id: p.slug, label: p.name, meta: p.brand }))}
            user={{ name: "Sujon Ahmed", email: "sujon@bluesigns.shop", avatar: avatars.noah }}
          />
        </DsPreview>
      </DsSection>

      <DsSection title="Tabs">
        <TabsDemo />
      </DsSection>

      <DsSection title="Accordion">
        <AccordionDemo />
      </DsSection>

      <DsSection title="Pagination">
        <PaginationDemo />
      </DsSection>

      <DsSection title="Breadcrumbs & icon rail">
        <DsPreview surface="canvas" className="items-start gap-10">
          <IconRail
            groups={[
              [
                { href: "/design-system/navigation", label: "Dashboard", icon: LayoutGrid, active: true },
                { href: "/", label: "Home", icon: Home },
                { href: "/account/orders", label: "Orders", icon: Package },
                { href: "/", label: "Wishlist", icon: Heart },
              ],
              [
                { href: "/", label: "Payments", icon: CreditCard },
                { href: "/", label: "Settings", icon: Settings },
              ],
              [{ href: "/", label: "Log out", icon: LogOut }],
            ]}
          />
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: "Footwear", href: "/shop?category=footwear" },
              { label: "Velocity Runner" },
            ]}
          />
        </DsPreview>
      </DsSection>

      <DsSection title="Long pages" description="Load more beats endless scroll for reachability; the sentinel can add automatic loading on top. Back to top and the skip link keep long pages navigable by keyboard.">
        <div className="flex flex-col gap-5">
          <LoadMoreDemo />
          <BackToTopDemo />
          <DsPreview label="SkipLink" className="flex-col items-start">
            <p className="text-body text-fg-muted">
              Press Tab on a fresh page load: the first stop is “Skip to content”, which jumps past the header. Both layouts render{" "}
              <code className="font-mono text-caption text-fg">{"<SkipLink />"}</code> before the navbar.
            </p>
            <div className="relative h-14 w-full overflow-hidden rounded-lg bg-surface-sunken">
              <span className="absolute top-3 left-3 rounded-pill bg-fg px-4 py-2 text-label text-surface shadow-popover">Skip to content</span>
            </div>
          </DsPreview>
        </div>
      </DsSection>

      <DsSection title="Footer">
        <div className="-mx-(--gutter)">
          <Footer newsletter={<NewsletterSignup variant="contrast" />} />
        </div>
      </DsSection>

      <DsSection title="Props">
        <div className="flex flex-col gap-5">
          <DsProps
            component="LoadMore · InfiniteScrollSentinel"
            rows={[
              { name: "loaded · total · noun", type: "number · number · string", description: "LoadMore: “Showing 24 of 132 products” plus a progress bar." },
              { name: "onLoadMore · loading", type: "() => void · boolean", description: "Button keeps its colour and blocks repeats while loading." },
              { name: "hasMore · rootMargin", type: "boolean · string", default: '— · "600px 0px"', description: "Sentinel: loads before it reaches the viewport; wrap LoadMore inside it." },
            ]}
          />
          <DsProps
            component="BackToTop · SkipLink"
            rows={[
              { name: "threshold", type: "number", default: "1200", description: "BackToTop: scroll distance before it appears." },
              { name: "targetId", type: "string", default: '"main"', description: "Element focused (BackToTop) or linked (SkipLink)." },
              { name: "className", type: "string", description: "BackToTop: offset above sticky mobile bars, e.g. bottom-24." },
            ]}
          />
          <DsProps
            component="TabsList"
            rows={[
              { name: "variant", type: '"pill" | "underline"', default: '"pill"', description: "Pill sits on a sunken track (40 px); underline for page-level sections." },
            ]}
          />
          <DsProps
            component="TabsTrigger"
            rows={[{ name: "count", type: "number", description: "Count bubble; turns accent when the tab is active." }]}
          />
          <DsProps
            component="Pagination"
            rows={[
              { name: "page · pageCount", type: "number", description: "Current page (1-based) and total pages." },
              { name: "hrefFor", type: "(page: number) => string", description: "Link mode — crawlable listing pages (Server Components)." },
              { name: "onPageChange", type: "(page: number) => void", description: "Button mode — client-side lists." },
              { name: "summary", type: "ReactNode", description: "“Showing 1–12 of 96” text on the left." },
              { name: "siblings", type: "number", default: "1", description: "Pages shown either side of the current page before ellipses." },
            ]}
          />
        </div>
      </DsSection>
    </>
  );
}
