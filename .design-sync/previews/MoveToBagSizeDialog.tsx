import { useState } from "react";
import { MoveToBagSizeDialog, sampleData, toast } from "@bluesigns/ui";

const { getProduct } = sampleData;

function SizeStep({ slug, soldOut }: { slug: string; soldOut: number[] }) {
  const p = getProduct(slug)!;
  const [open, setOpen] = useState(true);
  return (
    <MoveToBagSizeDialog
      product={p}
      sizes={(p.sizes ?? []).map((s, i) => ({ value: s, stock: soldOut.includes(i) ? 0 : i === 1 ? 2 : 8 }))}
      open={open}
      onOpenChange={setOpen}
      onConfirm={(s) => toast({ title: "Moved to bag", description: `${p.name} · ${s}`, tone: "success" })}
    />
  );
}

export const Sneakers = () => <SizeStep slug="court-low-sneaker" soldOut={[2]} />;

export const Hoodie = () => <SizeStep slug="fleece-hoodie" soldOut={[]} />;
