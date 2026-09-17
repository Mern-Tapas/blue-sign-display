import type { Metadata } from "next";
import { Banknote, Gift, RotateCcw, Truck, IndianRupee, Package } from "lucide-react";
import { RecentlyViewedDemo } from "@/components/docs/demos/merch-demo";
import { DsGrid, DsPageHeader, DsPreview, DsProps, DsSection } from "@/components/docs/ds-section";
import { BrandGrid } from "@/components/merch/brand-grid";
import { CategoryGrid, CategoryTile } from "@/components/merch/category-grid";
import { DealOfTheDay } from "@/components/merch/deal-of-the-day";
import { HeroCarousel } from "@/components/merch/hero-carousel";
import { bankOfferTiles, OfferTiles } from "@/components/merch/offer-tiles";
import { ProductRail } from "@/components/merch/product-rail";
import { ValuePropsStrip } from "@/components/merch/value-props-strip";
import { bankOffers } from "@/lib/data/india";
import { brandTiles, categoryTiles, featuredDeal, heroSlides } from "@/lib/data/merch";
import { getProduct, products } from "@/lib/data/products";
import { NewsletterSignup } from "@/components/commerce/newsletter-signup";
import { PromoBanner } from "@/components/commerce/promo-banner";
import { StatCard } from "@/components/commerce/stat-card";
import { PriceDisplay } from "@/components/commerce/price-display";
import { Progress } from "@/components/ui/progress";

export const metadata: Metadata = { title: "Home & merchandising" };

export default function MerchandisingPage() {
  const hoodie = getProduct("fleece-hoodie")!;
  return (
    <>
      <DsPageHeader
        title="Home &"
        muted="merchandising"
        description="The blocks a home or campaign page is assembled from. All are server-safe; interactive parts (carousel, countdown, add to bag, copy) hydrate on their own. Every claim they carry — discounts, deadlines, offers — has to be true for the page it links to."
      />

      <DsSection title="Hero carousel" description="Campaign slides with one clear action each. Text sits on a scrim, the first image is preloaded, autoplay pauses on hover and focus and never runs under reduced motion.">
        <HeroCarousel slides={heroSlides} autoplay={0} />
      </DsSection>

      <DsSection title="Category tiles" description="Card tiles scroll on phones and form a grid from 1024 px. Overlay tiles suit bento layouts and campaign banners.">
        <div className="flex flex-col gap-5">
          <CategoryGrid items={categoryTiles} />
          <div className="grid gap-4 sm:grid-cols-3">
            {categoryTiles.slice(0, 3).map((c, i) => (
              <CategoryTile key={c.href} {...c} variant="overlay" className={i === 0 ? "sm:row-span-2 sm:min-h-full" : undefined} />
            ))}
          </div>
        </div>
      </DsSection>

      <DsSection title="Offers" description="Bank, UPI and partner offers name who funds them and link to terms. Illustrative offers carry a Demo badge until real ones replace them.">
        <div className="flex flex-col gap-5">
          <OfferTiles offers={bankOfferTiles(bankOffers)} demo termsHref="/help" />
          <OfferTiles
            demo
            offers={[
              { id: "first", title: "₹500 off your first order", description: "On orders above ₹2,999 · new accounts", code: "FIRST500", icon: <Gift />, tone: "accent", featured: true },
              { id: "cod", title: "Pay on delivery", description: "Cash or UPI at your door, ₹19 fee", icon: <Banknote />, tone: "contrast" },
              { id: "ship", title: "Free delivery", description: "Above ₹499 on every order", icon: <Truck />, tone: "surface", href: "/shop" },
            ]}
          />
        </div>
      </DsSection>

      <DsSection title="Deal of the day" description="One product, a real deadline and the price against MRP. The claimed bar is optional and must come from inventory data. Contrast tone scopes the dark theme so everything inside stays legible.">
        <div className="flex flex-col gap-5">
          <DealOfTheDay product={featuredDeal.product} endsAt={featuredDeal.endsAt} note={featuredDeal.note} claimedPercent={62} />
          <DealOfTheDay product={hoodie} endsAt="2026-01-01T00:00:00+05:30" tone="surface" title="Weekend deal" />
        </div>
      </DsSection>

      <DsSection title="Product rail" description="Horizontal rows of standard product cards with arrows beside the heading. About two cards on phones, five on wide screens.">
        <ProductRail title="Best" muted="sellers" description="The pieces shoppers reorder most." products={products.slice(0, 10)} href="/shop?sort=rating" />
      </DsSection>

      <DsSection title="Brands" description="Photo, brand mark on a white plate (logos stay legible in dark mode) and an offer line that must match the linked listing.">
        <BrandGrid brands={brandTiles} />
      </DsSection>

      <DsSection title="Recently viewed" description="Personal history from this device. It renders nothing until there is something to show.">
        <RecentlyViewedDemo />
      </DsSection>

      <DsSection title="Value props" description="Promises that hold for every order, driven by the commerce rules (free-delivery threshold, return window) rather than hand-written copy.">
        <div className="flex flex-col gap-5">
          <ValuePropsStrip />
          <DsGrid>
            <DsPreview label="Inline · product page" className="block">
              <ValuePropsStrip
                variant="inline"
                items={[
                  { icon: <Truck />, title: "Free delivery" },
                  { icon: <RotateCcw />, title: "14-day returns" },
                  { icon: <Banknote />, title: "Cash on Delivery" },
                ]}
              />
            </DsPreview>
            <DsPreview label="Stacked" className="block">
              <ValuePropsStrip variant="stacked" />
            </DsPreview>
          </DsGrid>
        </div>
      </DsSection>

      <DsSection title="Promotions & newsletter" description="Promo banners carry a real code and terms; the strip variant sits above the header. Newsletter signup has surface, accent and contrast variants.">
        <div className="flex flex-col gap-5">
          <PromoBanner title="Up to 40% off audio" description="Noise cancelling headphones and speakers, while stock lasts." code="BLUESIGNS20" />
          <PromoBanner variant="strip" title="Free delivery above ₹499" description="· 14-day easy returns" code="FREESHIP" className="rounded-pill" />
          <DsGrid>
            <NewsletterSignup />
            <NewsletterSignup variant="accent" title="Members get early access" description="Join free and shop drops 24h before everyone else." />
          </DsGrid>
        </div>
      </DsSection>

      <DsSection title="Stat cards" description="Figures first: a label, a large tabular value and an optional trend. Used on the account home and in merchandising callouts (demo figures).">
        <div className="grid gap-4 md:grid-cols-2">
          <StatCard label="Total spent" icon={<IndianRupee aria-hidden />} value={<PriceDisplay amount={42805} size="xl" />} trend={12.4} caption="this year" />
          <StatCard label="BlueSigns points" icon={<Package aria-hidden />} value="1,840">
            <div className="flex flex-col gap-2">
              <Progress value={1840} max={2500} track="hatch" aria-label="Points to next tier" />
              <p className="text-caption text-fg-muted">660 points to Gold</p>
            </div>
          </StatCard>
        </div>
      </DsSection>

      <DsSection title="Props">
        <div className="flex flex-col gap-5">
          <DsProps
            component="HeroCarousel"
            rows={[
              { name: "slides", type: "{ id, title, muted?, description?, image, imageAlt?, href, cta, secondary?, align? }[]", description: "One action per slide; align end puts text on the right from sm." },
              { name: "autoplay", type: "number (ms)", default: "7000", description: "0 disables. Always pauses on hover / focus and under reduced motion." },
              { name: "firstHeadingLevel", type: '"h1" | "h2"', default: '"h2"', description: "Use h1 when the hero is the page’s main heading." },
            ]}
          />
          <DsProps
            component="CategoryGrid · CategoryTile"
            rows={[
              { name: "items", type: "{ href, name, image, caption? }[]", description: "Caption is an offer or range line that must match the listing." },
              { name: "variant", type: '"card" | "overlay"', default: '"card"', description: "Image square with name row, or name over the photo." },
              { name: "scrollOnMobile · columns", type: "boolean · 3 | 4 | 6", default: "true · 6", description: "Phone rail below lg; column count from lg." },
            ]}
          />
          <DsProps
            component="OfferTiles"
            rows={[
              { name: "offers", type: "{ id, title, description?, source?, icon?, code?, href?, featured?, tone? }[]", description: "bankOfferTiles() maps BankOffer data." },
              { name: "demo · termsHref", type: "boolean · string", description: "Demo badge on every tile; funding note with a terms link." },
            ]}
          />
          <DsProps
            component="DealOfTheDay"
            rows={[
              { name: "product · endsAt", type: "Product · Date | string | number", description: "The deal price must end when the countdown does." },
              { name: "claimedPercent · note", type: "number · string", description: "Real inventory share; deal terms such as purchase limits." },
              { name: "tone · title · preload", type: '"contrast" | "surface" · string · boolean', default: '"contrast"', description: "Contrast scopes data-theme=dark." },
            ]}
          />
          <DsProps
            component="ProductRail · BrandGrid · RecentlyViewedRail · ValuePropsStrip"
            rows={[
              { name: "title · muted · description · products · href · slideClassName", type: "ProductRail", description: "Renders nothing without products." },
              { name: "brands · scrollOnMobile", type: "BrandGrid — { name, href, image, logo?, offer? }[] · boolean", description: "Wordmark when no logo is supplied." },
              { name: "products · excludeSlug · max · title", type: "RecentlyViewedRail", description: "Pair with <TrackRecentlyViewed slug> on product pages." },
              { name: "items · variant", type: 'ValuePropsStrip — ValueProp[] · "strip" | "inline" | "stacked"', description: "Defaults come from the commerce rules." },
            ]}
          />
        </div>
      </DsSection>
    </>
  );
}
