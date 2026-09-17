"use client";

import { useState } from "react";
import { DsGrid, DsPreview } from "@/components/docs/ds-section";
import { PriceDisplay } from "@/components/commerce/price-display";
import { ProductImage } from "@/components/commerce/product-image";
import { Carousel } from "@/components/ui/carousel";
import { CopyButton } from "@/components/ui/copy-button";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { ShareButton } from "@/components/ui/share-button";
import { coupons } from "@/lib/data/india";
import { products } from "@/lib/data/products";

export function CarouselDemo() {
  const rail = products.slice(0, 10);
  return (
    <div className="flex flex-col gap-5">
      <DsPreview label="Carousel · overlay controls" className="block" code={`<Carousel aria-label="Featured" autoplay={6000}>{slides}</Carousel>`}>
        <Carousel aria-label="Featured products" autoplay={6000} className="overflow-hidden rounded-xl">
          {products.slice(0, 4).map((p, i) => (
            <div key={p.id} className="relative aspect-[16/7] max-sm:aspect-[4/3]">
              <ProductImage src={p.images[0]!} alt={p.name} sizes="(min-width: 1024px) 60vw, 100vw" wrapperClassName="absolute inset-0" preload={i === 0} />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-linear-to-t from-scrim to-transparent p-5 pb-12 text-white">
                <p className="text-heading-sm">{p.name}</p>
                <p className="text-body text-fg-on-accent-muted">From {p.brand}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </DsPreview>
      <DsPreview label="Carousel · rail with header controls" className="block">
        <Carousel
          aria-label="Bestsellers"
          controls="header"
          header={<h3 className="text-heading-sm">Bestsellers</h3>}
          slideClassName="basis-[44%] sm:basis-1/3 lg:basis-1/5"
          gapClassName="gap-3"
        >
          {rail.map((p) => (
            <article key={p.id} className="flex flex-col gap-2">
              <ProductImage src={p.images[0]!} alt={p.name} sizes="(min-width: 1024px) 18vw, 44vw" wrapperClassName="aspect-[4/5] rounded-lg" />
              <p className="line-clamp-1 text-body-strong">{p.name}</p>
              <PriceDisplay amount={p.price} compareAt={p.compareAt} size="sm" showDiscount />
            </article>
          ))}
        </Carousel>
      </DsPreview>
    </div>
  );
}

export function CountdownDemo() {
  // Deadlines relative to first render. The timers show placeholders until hydration, so the
  // server / client difference in this value never reaches the HTML.
  const [base] = useState(() => Date.now());
  return (
    <DsGrid>
      <DsPreview label="CountdownTimer · blocks" className="flex-col items-start">
        <CountdownTimer endsAt={base + 5 * 3600e3 + 42 * 60e3} />
        <CountdownTimer endsAt={base + 2 * 86400e3 + 3 * 3600e3} tone="contrast" size="lg" showSeconds={false} />
        <div className="rounded-lg bg-accent p-3">
          <CountdownTimer endsAt={base + 47 * 60e3} tone="on-color" size="sm" />
        </div>
      </DsPreview>
      <DsPreview label="Inline & expired" className="flex-col items-start">
        <CountdownTimer variant="inline" endsAt={base + 3 * 3600e3 + 12 * 60e3} className="text-danger-fg" label="Deal ends in" />
        <CountdownTimer variant="inline" endsAt={base + 12e3} label="Hurry, ends in" expiredText="This deal has ended" />
        <p className="text-caption text-fg-muted">The second one expires 12 seconds after load. Countdowns must match a real end time.</p>
      </DsPreview>
    </DsGrid>
  );
}

export function CopyShareDemo() {
  const coupon = coupons[0]!;
  return (
    <DsGrid>
      <DsPreview label="CopyButton" className="flex-col items-start" code={`<CopyButton value="BLUESIGNS20" appearance="button" label="Copy code" />`}>
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-accent bg-accent-soft py-2 pr-2 pl-4">
          <span className="text-code text-accent-soft-fg">{coupon.code}</span>
          <CopyButton value={coupon.code} appearance="button" label="Copy code" />
        </div>
        <p className="flex items-center gap-1 text-body text-fg-muted">
          AWB <span className="text-code text-fg">DL8821347790IN</span>
          <CopyButton value="DL8821347790IN" label="Copy tracking number" notify />
        </p>
        <CopyButton value="sujon@okaxis" appearance="inline" label="Copy UPI ID" />
      </DsPreview>
      <DsPreview label="ShareButton" code={`<ShareButton title="Aura Wireless Headphones" url={productUrl} />`}>
        <ShareButton title="Aura Wireless Headphones" text="Check out Aura Wireless Headphones on BlueSigns" url="https://bluesigns.shop/products/aura-wireless-headphones" />
        <ShareButton appearance="button" size="sm" title="My wishlist" url="https://bluesigns.shop/wishlist/sujon" label="Share wishlist" />
        <p className="basis-full text-caption text-fg-muted">Phones open the system share sheet; desktops get copy link, WhatsApp, Telegram and email.</p>
      </DsPreview>
    </DsGrid>
  );
}
