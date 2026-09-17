import { CompareToggle, CompareTray, ProductCard, compare, sampleData } from "@bluesigns/ui";

const { getProduct } = sampleData;
const aura = getProduct("aura-wireless-headphones")!;
const studio = getProduct("studio-over-ear-headphones")!;
const pulse = getProduct("pulse-smart-watch")!;

// Picks are stored per device; seed one so a checked toggle shows.
compare.clear();
compare.toggle(aura.slug, aura.category);

export const OnProductCards = () => (
  <div className="grid grid-cols-3 gap-4" style={{ maxWidth: 720 }}>
    {[aura, studio, pulse].map((p) => (
      <ProductCard key={p.id} product={p} footer={<CompareToggle product={p} categoryName={p.category === "audio" ? "Audio" : "Watches"} />} />
    ))}
  </div>
);

export const CheckedAndUnchecked = () => (
  <div className="flex items-center gap-6">
    <CompareToggle product={aura} categoryName="Audio" />
    <CompareToggle product={studio} categoryName="Audio" />
  </div>
);

export const WithTray = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 640 }}>
    <div className="flex items-center gap-6">
      <CompareToggle product={aura} categoryName="Audio" />
      <CompareToggle product={studio} categoryName="Audio" />
    </div>
    <CompareTray products={[aura, studio]} className="static mx-0 animate-none" />
  </div>
);
