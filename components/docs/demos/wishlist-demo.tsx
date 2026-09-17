"use client";

import { useState } from "react";
import { DsPreview } from "@/components/docs/ds-section";
import { toast } from "@/components/providers/toast-store";
import { wishlist } from "@/components/providers/wishlist-store";
import { Button } from "@/components/ui/button";
import { MoveToBagSizeDialog } from "@/components/wishlist/move-to-bag-size-dialog";
import { WishlistGrid } from "@/components/wishlist/wishlist-grid";
import { WishlistItemCard } from "@/components/wishlist/wishlist-item-card";
import { getProduct, products } from "@/lib/data/products";

const samples = ["fleece-hoodie", "aura-wireless-headphones", "court-low-sneaker", "no-5-eau-de-parfum", "pulse-smart-watch"];

export function WishlistCardsDemo() {
  const hoodie = getProduct("fleece-hoodie")!;
  const watch = getProduct("pulse-smart-watch")!;
  const soldOut = { ...getProduct("field-jacket")!, stock: 0 };
  const noop = () => toast({ title: "Demo card — removal only works on the live wishlist" });
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <WishlistItemCard product={hoodie} savedPrice={hoodie.price + 500} onRemove={noop} />
      <WishlistItemCard product={watch} onRemove={noop} />
      <WishlistItemCard product={soldOut} onRemove={noop} />
      <WishlistItemCard product={{ ...getProduct("thermal-bottle")!, stock: 3 }} savedPrice={getProduct("thermal-bottle")!.price} onRemove={noop} />
    </div>
  );
}

export function WishlistGridDemo() {
  return (
    <DsPreview label="WishlistGrid (live store)" className="flex-col items-stretch">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            samples.forEach((s, i) => {
              const p = getProduct(s)!;
              // Pretend a couple were saved at a higher price to show price-drop notes
              wishlist.add(s, i % 2 === 0 ? p.price + 400 * (i + 1) : p.price);
            })
          }
        >
          Add sample items
        </Button>
        <Button variant="ghost" size="sm" onClick={wishlist.clear}>
          Clear wishlist
        </Button>
      </div>
      <WishlistGrid products={products} title="Wishlist" />
    </DsPreview>
  );
}

export function SizeDialogDemo() {
  const [open, setOpen] = useState(false);
  const p = getProduct("court-low-sneaker")!;
  return (
    <DsPreview label="MoveToBagSizeDialog">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Move sneakers to bag
      </Button>
      <MoveToBagSizeDialog
        product={p}
        sizes={(p.sizes ?? []).map((s, i) => ({ value: s, stock: i === 2 ? 0 : 8 }))}
        open={open}
        onOpenChange={setOpen}
        onConfirm={(s) => toast({ title: "Moved to bag", description: `${p.name} · ${s}`, tone: "success" })}
      />
    </DsPreview>
  );
}
