"use client";

import { useRef, useState } from "react";
import { NotifyMeForm } from "@/components/product/notify-me-form";
import { OffersList } from "@/components/product/offers-list";
import { PincodeDeliveryCheck } from "@/components/product/pincode-delivery-check";
import { ProductActions } from "@/components/product/product-actions";
import { SizeSelector, type SizeChart } from "@/components/product/size-selector";
import { StickyBuyBar } from "@/components/product/sticky-buy-bar";
import { toast } from "@/components/providers/toast-store";
import { bankOffers, coupons, lookupPincode, sizeChart } from "@/lib/data/india";
import type { Product } from "@/lib/data/types";
import { SwatchGroup } from "./swatch-group";

function chartFor(product: Product): { chart?: SizeChart; fitNote?: string } {
  if (product.category === "apparel") return { chart: { ...sizeChart.apparel, measureColumns: [1, 2, 3], baseUnit: "in" }, fitNote: "Regular fit. Between sizes? Size up for a relaxed look." };
  if (product.category === "footwear") return { chart: { ...sizeChart.footwear, measureColumns: [], baseUnit: "cm" }, fitNote: "True to size. Foot length in centimetres." };
  return {};
}

/**
 * Product page buy box: colour, size (with chart and per-size stock), Add to bag / Buy now,
 * back-in-stock alert when sold out, PIN-code delivery check and offers. A sticky buy bar
 * takes over on phones once the actions scroll away.
 */
export function ProductPurchasePanel({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors?.[0]?.name);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [sizeError, setSizeError] = useState<string>();
  const sizeRef = useRef<HTMLDivElement>(null);
  const soldOut = product.stock <= 0;
  const { chart, fitNote } = chartFor(product);

  // Demo stock per size: second size sold out on longer runs, last size nearly gone
  const sizes = product.sizes?.map((s, i, all) => ({ value: s, stock: all.length > 3 && i === 1 ? 0 : i === all.length - 1 ? 2 : 10 }));

  const missingSize = () => {
    setSizeError("Select a size to continue");
    sizeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    requestAnimationFrame(() => sizeRef.current?.querySelector<HTMLElement>("[role=radio]:not([disabled])")?.focus({ preventScroll: true }));
  };

  const actions = (layout: "responsive" | "row") => (
    <ProductActions product={product} color={color} size={size} onMissingSize={missingSize} layout={layout} />
  );

  return (
    <div className="flex flex-col gap-6">
      {product.colors && (
        <SwatchGroup type="color" label="Colour" value={color} onValueChange={setColor} options={product.colors.map((c) => ({ value: c.name, color: c.value }))} />
      )}
      {sizes && (
        <div ref={sizeRef}>
          <SizeSelector
            sizes={sizes}
            value={size}
            onValueChange={(s) => {
              setSize(s);
              setSizeError(undefined);
            }}
            error={sizeError}
            chart={chart}
            fitNote={fitNote}
          />
        </div>
      )}

      {soldOut ? (
        <NotifyMeForm
          productName={product.name}
          onSubmit={async () => {
            await new Promise((r) => setTimeout(r, 700));
            toast({ title: "Back-in-stock alert set", tone: "success" });
          }}
        />
      ) : (
        <div id="product-actions" className="flex flex-col gap-2">
          {actions("responsive")}
          {product.stock <= 5 && <p className="text-label text-warning-fg">Only {product.stock} left — order soon.</p>}
        </div>
      )}

      <PincodeDeliveryCheck lookup={lookupPincode} productDays={Math.max(0, (product.deliveryDays ?? 3) - 2)} />

      <OffersList
        demo
        offers={[
          ...bankOffers.map((o) => ({ id: o.id, kind: o.kind, title: o.title, detail: o.detail, terms: o.terms })),
          ...coupons.slice(0, 2).map((c) => ({ id: c.code, kind: "coupon" as const, title: `Use ${c.code}: ${c.title}`, detail: c.description, terms: c.terms })),
        ]}
      />

      {!soldOut && (
        <StickyBuyBar watchId="product-actions" price={product.price} compareAt={product.compareAt}>
          {actions("row")}
        </StickyBuyBar>
      )}
    </div>
  );
}
