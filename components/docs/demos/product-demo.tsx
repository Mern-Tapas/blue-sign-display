"use client";

import { useState } from "react";
import { DsGrid, DsPreview } from "@/components/docs/ds-section";
import { ProductImage } from "@/components/commerce/product-image";
import { CouponCard } from "@/components/product/coupon-card";
import { FrequentlyBoughtTogether } from "@/components/product/frequently-bought-together";
import { ImageZoomLens } from "@/components/product/image-zoom-lens";
import { NotifyMeForm } from "@/components/product/notify-me-form";
import { OffersList } from "@/components/product/offers-list";
import { PincodeDeliveryCheck } from "@/components/product/pincode-delivery-check";
import { ProductActions } from "@/components/product/product-actions";
import { ProductQnA } from "@/components/product/product-qna";
import { SizeSelector } from "@/components/product/size-selector";
import { bankOffers, coupons, lookupPincode, productQuestions, sizeChart } from "@/lib/data/india";
import { getProduct } from "@/lib/data/products";

const wait = (ms = 700) => new Promise((r) => setTimeout(r, ms));
const hoodie = getProduct("fleece-hoodie")!;
const headphones = getProduct("aura-wireless-headphones")!;

export function ZoomDemo() {
  return (
    <DsPreview label="ImageZoomLens" className="flex-col items-start">
      <ImageZoomLens src={headphones.images[0]!} className="w-full max-w-sm rounded-2xl">
        <ProductImage src={headphones.images[0]!} alt={headphones.name} sizes="384px" wrapperClassName="aspect-square rounded-2xl" />
      </ImageZoomLens>
      <p className="text-caption text-fg-muted">Hover with a mouse to magnify. Touch devices keep pinch-zoom and the full-screen view.</p>
    </DsPreview>
  );
}

export function SizeAndActionsDemo() {
  const [size, setSize] = useState<string>();
  const [error, setError] = useState<string>();
  return (
    <DsPreview label="SizeSelector + ProductActions" className="flex-col items-stretch">
      <SizeSelector
        sizes={hoodie.sizes!.map((s, i) => ({ value: s, stock: i === 1 ? 0 : i === hoodie.sizes!.length - 1 ? 2 : 12 }))}
        value={size}
        onValueChange={(s) => {
          setSize(s);
          setError(undefined);
        }}
        error={error}
        chart={{ ...sizeChart.apparel, measureColumns: [1, 2, 3], baseUnit: "in" }}
        fitNote="Regular fit. Between sizes? Size up for a relaxed look."
      />
      <ProductActions product={hoodie} size={size} onMissingSize={() => setError("Select a size to continue")} checkoutHref="/design-system/product" />
      <p className="text-caption text-fg-muted">Press Add to bag without a size to see the guidance. S is sold out; the largest size has 2 left.</p>
    </DsPreview>
  );
}

export function DeliveryAndOffersDemo() {
  return (
    <DsGrid>
      <DsPreview label="PincodeDeliveryCheck" className="flex-col items-stretch">
        <PincodeDeliveryCheck
          lookup={async (pin) => {
            await wait();
            return lookupPincode(pin);
          }}
        />
        <p className="text-caption text-fg-muted">Shares the stored PIN with the header. Try 600001 (no COD) or 744101 (not serviceable).</p>
      </DsPreview>
      <DsPreview label="OffersList" className="flex-col items-stretch">
        <OffersList
          demo
          offers={[
            ...bankOffers.map((o) => ({ id: o.id, kind: o.kind, title: o.title, detail: o.detail, terms: o.terms })),
            ...coupons.slice(0, 2).map((c) => ({ id: c.code, kind: "coupon" as const, title: `Use ${c.code}: ${c.title}`, detail: c.description, terms: c.terms })),
          ]}
        />
      </DsPreview>
    </DsGrid>
  );
}

export function CouponCardsDemo() {
  const [applied, setApplied] = useState<string | null>("AUDIO10");
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {coupons.map((c) => (
        <CouponCard
          key={c.code}
          coupon={c}
          subtotal={2499}
          today="2026-09-15"
          applied={applied === c.code}
          onApply={setApplied}
          onRemove={() => setApplied(null)}
        />
      ))}
      <CouponCard coupon={coupons[0]!} today="2026-09-15" />
    </div>
  );
}

export function NotifyDemo() {
  return (
    <DsPreview label="NotifyMeForm" className="flex-col items-stretch">
      <NotifyMeForm productName="Fleece Hoodie" variantLabel="Size S" defaultContact="sujon@bluesigns.shop" onSubmit={async () => {
          await wait();
        }} />
    </DsPreview>
  );
}

export function BundleDemo() {
  return <FrequentlyBoughtTogether product={headphones} addOns={[getProduct("thermal-bottle")!, getProduct("nomad-backpack")!]} />;
}

export function QnADemo() {
  return (
    <DsPreview label="ProductQnA" className="block">
      <ProductQnA
        questions={productQuestions}
        onAsk={async (q) => {
          await wait();
          if (q.toLowerCase().includes("fail")) throw new Error("demo");
        }}
      />
    </DsPreview>
  );
}
