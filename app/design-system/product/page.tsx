import type { Metadata } from "next";
import { Battery, Bluetooth, Weight, Waves } from "lucide-react";
import { BundleDemo, CouponCardsDemo, DeliveryAndOffersDemo, NotifyDemo, QnADemo, SizeAndActionsDemo, ZoomDemo } from "@/components/docs/demos/product-demo";
import { DsGrid, DsPageHeader, DsPreview, DsProps, DsSection } from "@/components/docs/ds-section";
import { EmiOptionsDialog } from "@/components/product/emi-options-dialog";
import { PolicyHighlights } from "@/components/product/policy-highlights";
import { ProductHighlights } from "@/components/product/product-highlights";
import { ProductTitleBlock } from "@/components/product/product-title-block";
import { SellerCard } from "@/components/product/seller-card";
import { SpecificationsTable } from "@/components/product/specifications-table";
import { banks, emiPlans, sellers } from "@/lib/data/india";
import { getProduct } from "@/lib/data/products";
import { lowestEmi, type EmiBank } from "@/lib/emi";
import { ImageGallery } from "@/components/commerce/image-gallery";
import { PriceDisplay } from "@/components/commerce/price-display";
import { SwatchGroup } from "@/components/commerce/swatch-group";
import { WishlistButton } from "@/components/commerce/wishlist-button";
import { Badge } from "@/components/ui/badge";
import { TextButton } from "@/components/ui/text-button";

export const metadata: Metadata = { title: "Product detail" };

const emiBanks: EmiBank[] = Object.entries(emiPlans).map(([id, plans]) => ({ id, name: banks.find((b) => b.id === id)?.name ?? id, plans }));

export default function ProductDocsPage() {
  const p = getProduct("aura-wireless-headphones")!;
  return (
    <>
      <DsPageHeader
        title="Product"
        muted="detail"
        description="The pieces of a product page, from the title and price to delivery, offers, specifications and questions. Every product route in the store now uses them — open any product to see the full composition."
      />

      <DsSection title="Title & price" description="Brand link, name, rating pill with ratings and reviews counts, price against MRP with tax note, and the lowest EMI with a plans dialog.">
        <DsPreview className="block">
          <ProductTitleBlock
            product={p}
            headingLevel="h2"
            brandHref="/shop?q=Sonora"
            writtenReviews={212}
            assured="BlueSigns Assured"
            emiFrom={lowestEmi(p.price, emiBanks)}
            emiAction={<EmiOptionsDialog price={p.price} banks={emiBanks} demo />}
          />
        </DsPreview>
      </DsSection>

      <DsSection title="Gallery zoom">
        <ZoomDemo />
      </DsSection>

      <DsSection title="Size & actions" description="Sizes show stock per size and link to the chart (inches / centimetres, how to measure). Add to bag and Buy now stay enabled and explain a missing size instead of disabling.">
        <SizeAndActionsDemo />
      </DsSection>

      <DsSection title="Delivery & offers">
        <DeliveryAndOffersDemo />
      </DsSection>

      <DsSection title="Coupons" description="Exact savings on this order, the gap to the minimum spend, expiry and terms. Expired and locked coupons stay visible but can’t be applied.">
        <CouponCardsDemo />
      </DsSection>

      <DsSection title="Highlights, specs & policies">
        <div className="flex flex-col gap-5">
          <DsGrid>
            <DsPreview label="ProductHighlights · list" className="block">
              <ProductHighlights items={p.features} />
            </DsPreview>
            <DsPreview label="ProductHighlights · tiles" className="block">
              <ProductHighlights
                variant="tiles"
                title="Key specs"
                items={[
                  { icon: <Battery />, title: "40 h battery", description: "ANC off" },
                  { icon: <Waves />, title: "Adaptive ANC" },
                  { icon: <Bluetooth />, title: "Bluetooth 5.3", description: "Multipoint" },
                  { icon: <Weight />, title: "250 g" },
                ]}
              />
            </DsPreview>
          </DsGrid>
          <DsPreview label="SpecificationsTable" className="block">
            <SpecificationsTable
              groups={[
                { title: "General", rows: [["Brand", p.brand], ["Model name", p.name], ["Colours", p.colors?.map((c) => c.name).join(", ") ?? "—"]] },
                { title: "Audio", rows: [["Driver size", "40 mm"], ["Frequency response", "20 Hz – 20 kHz"], ["Noise cancellation", "Adaptive, 3 modes"]] },
                { title: "Battery", rows: [["Playback", "Up to 40 hours"], ["Quick charge", "10 min = 5 hours"], ["Port", "USB-C"]] },
              ]}
            />
          </DsPreview>
          <DsGrid>
            <DsPreview label="PolicyHighlights" className="flex-col items-stretch">
              <PolicyHighlights warranty="1 year warranty" />
              <PolicyHighlights returnable={false} cod={false} />
            </DsPreview>
            <DsPreview label="SellerCard" className="block">
              <SellerCard seller={sellers.default!} otherSellersHref="/shop" otherSellersCount={2} demo />
            </DsPreview>
          </DsGrid>
        </div>
      </DsSection>

      <DsSection title="Sold out" description="Replace the actions with a one-field back-in-stock alert.">
        <NotifyDemo />
      </DsSection>

      <DsSection title="Frequently bought together">
        <BundleDemo />
      </DsSection>

      <DsSection title="Questions & answers" description="Type a question containing “fail” to see the error state.">
        <QnADemo />
      </DsSection>

      <DsSection title="Sticky buy bar" description="On phones, once Add to bag and Buy now scroll out of view, a bar with the price and both actions slides in above the bottom navigation. Open a product page at phone width to try it.">
        <DsPreview label="Behaviour" className="block">
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-body text-fg-muted">
            <li>Watches the actions block by id with IntersectionObserver; shows only after it has scrolled above the viewport.</li>
            <li>Hidden with inert and aria-hidden when off screen, so it never traps focus or duplicates announcements.</li>
            <li>Sits at bottom: 4 rem + safe area, directly above MobileBottomNav; hidden from 1024 px.</li>
          </ul>
        </DsPreview>
      </DsSection>

      <DsSection title="Gallery, swatches & price" description="The lower-level building blocks behind the purchase panel.">
        <DsGrid>
          <DsPreview label="ImageGallery" className="block">
            <ImageGallery images={getProduct("aura-wireless-headphones")!.images} alt="Aura Wireless Headphones" overlay={<Badge tone="sale">-22%</Badge>} />
          </DsPreview>
          <DsPreview label="SwatchGroup · PriceDisplay · WishlistButton" className="flex-col items-stretch gap-6">
            <PriceDisplay amount={12999} compareAt={16999} size="xl" showDiscount mrpLabel taxNote />
            <SwatchGroup
              type="color"
              label="Color"
              defaultValue="Violet"
              options={[
                { value: "Sand", color: "#d9c7a7" },
                { value: "Graphite", color: "#2b2b33" },
                { value: "Violet", color: "#6d5df5" },
                { value: "Sold out", color: "#c83e3e", disabled: true },
              ]}
            />
            <SwatchGroup
              type="size"
              label="Size"
              defaultValue="42"
              labelAction={<TextButton size="sm">Size guide</TextButton>}
              options={["39", "40", "41", "42", "43", "44"].map((s) => ({ value: s, disabled: s === "40" }))}
            />
            <div className="flex items-center gap-2">
              <WishlistButton productName="Aura Wireless Headphones" variant="secondary" size="lg" notify={false} />
              <WishlistButton productName="Aura Wireless Headphones" variant="secondary" size="lg" defaultSaved notify={false} />
            </div>
          </DsPreview>
        </DsGrid>
      </DsSection>

      <DsSection title="Props">
        <div className="flex flex-col gap-5">
          <DsProps
            component="ProductTitleBlock · EmiOptionsDialog"
            rows={[
              { name: "product · brandHref · writtenReviews · reviewsHref", type: "ProductTitleBlock", description: "Rating pill links to reviews with ratings and review counts." },
              { name: "emiFrom · emiAction · assured · headingLevel", type: "number · ReactNode · string · h1 | h2", description: "EMI teaser with the plans dialog as its action." },
              { name: "price · banks · emiAmount · demo", type: "EmiOptionsDialog", description: "Tabs per bank; no-cost plans explained. lowestEmi() computes the teaser." },
            ]}
          />
          <DsProps
            component="SizeSelector · SizeChartDialog"
            rows={[
              { name: "sizes", type: "{ value, label?, stock? }[]", description: "stock 0 strikes the size; ≤ lowStockAt shows “2 left”." },
              { name: "value · onValueChange · error", type: "string · fn · string", description: "Error is announced and wired via aria-describedby." },
              { name: "chart · fitNote", type: "{ columns, rows, measureColumns?, baseUnit? } · string", description: "Chart link with inch / cm conversion of measure columns." },
            ]}
          />
          <DsProps
            component="ProductActions · StickyBuyBar · NotifyMeForm"
            rows={[
              { name: "product · color · size · quantity · onMissingSize · checkoutHref · layout", type: "ProductActions", description: "Add to bag toast, Buy now to checkout; renders nothing when sold out." },
              { name: "watchId · price · compareAt · children", type: "StickyBuyBar", description: "Phone bar that appears once the watched actions scroll away." },
              { name: "productName · variantLabel · defaultContact · onSubmit", type: "NotifyMeForm", description: "Email or mobile, then a confirmation naming where the alert goes." },
            ]}
          />
          <DsProps
            component="PincodeDeliveryCheck · OffersList · CouponCard"
            rows={[
              { name: "lookup · productDays · returnDays · codEligible", type: "PincodeDeliveryCheck", description: "Delivery date computed after hydration from PIN transit + product handling." },
              { name: "offers · title · visibleCount · demo", type: "OffersList", description: "{ id, kind, title, detail?, terms? } with T&C popovers." },
              { name: "coupon · subtotal · today · applied · onApply · onRemove", type: "CouponCard", description: "Status available / applied / locked / expired via couponStatus()." },
            ]}
          />
          <DsProps
            component="Highlights · Specs · Seller · Policies · Bundle · Q&A · Zoom"
            rows={[
              { name: "items · title · variant", type: 'ProductHighlights — Highlight[] · string · "list" | "tiles"', description: "Strings or { icon, title, description }." },
              { name: "groups · initialGroups", type: "SpecificationsTable — SpecGroup[] · number", description: "Remaining groups behind Show all." },
              { name: "seller · otherSellersHref · otherSellersCount · demo", type: "SellerCard", description: "Rating, tenure, fulfilment, return policy." },
              { name: "returnDays · returnable · exchange · cod · warranty · genuine", type: "PolicyHighlights", description: "Product-specific; negatives shown plainly." },
              { name: "product · addOns", type: "FrequentlyBoughtTogether", description: "Checkbox bundle with total vs MRP." },
              { name: "questions · onAsk · askPrompt · visibleCount", type: "ProductQnA", description: "Search, answered first, helpful votes, ask form or sign-in prompt." },
              { name: "src · zoom", type: "ImageZoomLens", description: "Wraps the gallery image; fine pointers only." },
            ]}
          />
        </div>
      </DsSection>
    </>
  );
}
