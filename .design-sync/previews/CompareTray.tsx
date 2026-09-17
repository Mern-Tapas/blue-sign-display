import { CompareTray, compare, sampleData } from "@bluesigns/ui";

const { products } = sampleData;

// The tray reads the per-device compare store; seed two audio products so it appears.
compare.clear();
compare.toggle("aura-wireless-headphones", "audio");
compare.toggle("studio-over-ear-headphones", "audio");

export const TwoPicked = () => (
  <div className="flex flex-col justify-end rounded-2xl bg-canvas p-4" style={{ maxWidth: 680, minHeight: 200 }}>
    {/* In the app the tray floats at the bottom of the viewport; static keeps it in this frame. */}
    <CompareTray products={products} className="static mx-0" />
  </div>
);

export const OnePickedCompareDisabled = () => (
  <div className="flex flex-col justify-end rounded-2xl bg-canvas p-4" style={{ maxWidth: 680, minHeight: 200 }}>
    {/* Picks are resolved against the catalogue passed in, so this tray shows a single pick. */}
    <CompareTray products={products.filter((p) => p.slug !== "studio-over-ear-headphones")} className="static mx-0" />
  </div>
);
