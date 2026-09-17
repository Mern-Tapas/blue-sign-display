"use client";

import { useState } from "react";
import { PackageCheck, Truck } from "lucide-react";
import { DsGrid, DsPreview } from "@/components/docs/ds-section";
import { ProductImage } from "@/components/commerce/product-image";
import { BackToTop } from "@/components/ui/back-to-top";
import { Inset } from "@/components/ui/inset";
import { InfiniteScrollSentinel, LoadMore } from "@/components/ui/load-more";
import { Steps } from "@/components/ui/steps";
import { Switch } from "@/components/ui/switch";
import { TextButton } from "@/components/ui/text-button";
import { products } from "@/lib/data/products";

const PAGE = 4;

export function LoadMoreDemo() {
  const [count, setCount] = useState(PAGE);
  const [loading, setLoading] = useState(false);
  const [auto, setAuto] = useState(false);
  const total = products.length;

  function load() {
    if (loading) return;
    setLoading(true);
    window.setTimeout(() => {
      setCount((c) => Math.min(total, c + PAGE));
      setLoading(false);
    }, 700);
  }

  return (
    <DsPreview label="LoadMore + InfiniteScrollSentinel" className="flex-col items-stretch">
      <Switch label="Load automatically on scroll" size="sm" checked={auto} onCheckedChange={setAuto} />
      <Inset size="sm" className="max-h-96 overflow-y-auto">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {products.slice(0, count).map((p) => (
            <li key={p.id} className="flex flex-col gap-1.5">
              <ProductImage src={p.images[0]!} alt={p.name} sizes="20vw" wrapperClassName="aspect-square rounded-md" />
              <span className="line-clamp-1 text-caption">{p.name}</span>
            </li>
          ))}
        </ul>
        <div className="pt-5 pb-2">
          {auto ? (
            <InfiniteScrollSentinel onLoadMore={load} hasMore={count < total} loading={loading} rootMargin="100px 0px">
              <LoadMore loaded={count} total={total} onLoadMore={load} loading={loading} />
            </InfiniteScrollSentinel>
          ) : (
            <LoadMore loaded={count} total={total} onLoadMore={load} loading={loading} />
          )}
        </div>
      </Inset>
      <TextButton size="sm" onClick={() => setCount(PAGE)} className="self-start">
        Reset
      </TextButton>
    </DsPreview>
  );
}

export function BackToTopDemo() {
  return (
    <DsPreview label="BackToTop" className="flex-col items-start">
      <p className="text-body text-fg-muted">
        Scroll this page past 1,200 px — the button appears bottom-right and returns focus to the main content. On store pages pass a
        bottom offset so it clears the sticky mobile bar.
      </p>
      <BackToTop />
    </DsPreview>
  );
}

export const orderSteps = [
  { id: "ordered", label: "Ordered", meta: "10 Sept, 9:12 AM" },
  { id: "packed", label: "Packed", meta: "10 Sept, 6:40 PM" },
  { id: "shipped", label: "Shipped", meta: "11 Sept, 8:05 AM", icon: <Truck aria-hidden /> },
  { id: "ofd", label: "Out for delivery", meta: "Today, 7:30 AM" },
  { id: "delivered", label: "Delivered", description: "Expected today by 9 PM", icon: <PackageCheck aria-hidden /> },
];

export function StepsDemo() {
  return (
    <DsGrid>
      <DsPreview label="Steps · horizontal" className="flex-col items-stretch gap-8">
        <Steps aria-label="Order progress" steps={orderSteps} current={3} size="sm" />
        <Steps
          aria-label="Return progress"
          current={1}
          steps={[
            { id: "request", label: "Requested" },
            { id: "pickup", label: "Pickup", description: "Tomorrow, 10 AM – 1 PM" },
            { id: "check", label: "Quality check" },
            { id: "refund", label: "Refund" },
          ]}
        />
        <Steps
          aria-label="Payment progress"
          current={1}
          size="sm"
          steps={[
            { id: "placed", label: "Order placed" },
            { id: "pay", label: "Payment", status: "error", description: "UPI request declined" },
            { id: "confirm", label: "Confirmed" },
          ]}
        />
      </DsPreview>
      <DsPreview label="Steps · vertical" className="block">
        <Steps aria-label="Shipment scans" orientation="vertical" steps={orderSteps} current={3} />
      </DsPreview>
    </DsGrid>
  );
}
