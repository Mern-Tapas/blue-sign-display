import { ImageZoomLens, ProductImage, sampleData } from "@bluesigns/ui";

const { getProduct } = sampleData;
const headphones = getProduct("aura-wireless-headphones")!;
const watch = getProduct("meridian-classic-watch")!;

// Hover with a mouse to magnify; touch devices keep pinch-zoom.
export const ProductPhoto = () => (
  <div className="flex flex-col items-start gap-2" style={{ maxWidth: 384 }}>
    <ImageZoomLens src={headphones.images[0]!} className="w-full rounded-2xl">
      <ProductImage src={headphones.images[0]!} alt={headphones.name} sizes="384px" wrapperClassName="aspect-square rounded-2xl" />
    </ImageZoomLens>
    <p className="text-caption text-fg-muted">Hover to zoom</p>
  </div>
);

export const StrongerZoom = () => (
  <div style={{ maxWidth: 320 }}>
    <ImageZoomLens src={watch.images[0]!} zoom={4} className="rounded-xl">
      <ProductImage src={watch.images[0]!} alt={watch.name} sizes="320px" wrapperClassName="aspect-[4/5] rounded-xl" />
    </ImageZoomLens>
  </div>
);
