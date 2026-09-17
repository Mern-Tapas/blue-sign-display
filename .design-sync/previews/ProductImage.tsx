import { ProductImage, sampleData } from "@bluesigns/ui";

const { getProduct, products } = sampleData;
const watch = getProduct("meridian-classic-watch")!;

export const Square = () => (
  <div style={{ width: 320 }}>
    <ProductImage src={watch.images[0]!} alt={watch.name} sizes="320px" wrapperClassName="aspect-square rounded-2xl" />
  </div>
);

export const Thumbnails = () => (
  <div className="flex items-center gap-3">
    {products.slice(0, 4).map((p) => (
      <ProductImage key={p.id} src={p.images[0]!} alt={p.name} sizes="80px" wrapperClassName="size-20 rounded-lg" />
    ))}
    {products.slice(4, 7).map((p) => (
      <ProductImage key={p.id} src={p.images[0]!} alt={p.name} sizes="56px" wrapperClassName="size-14 rounded-pill" />
    ))}
  </div>
);

export const Portrait = () => (
  <div className="grid grid-cols-3 gap-3" style={{ maxWidth: 560 }}>
    {products.slice(8, 11).map((p) => (
      <ProductImage key={p.id} src={p.images[0]!} alt={p.name} wrapperClassName="aspect-[4/5] rounded-xl" />
    ))}
  </div>
);

// Broken or offline sources fall back to a sunken panel with an icon.
export const LoadFailed = () => (
  <div className="flex items-center gap-3">
    <ProductImage src="https://images.unsplash.com/photo-0000000000000-removed?w=400" alt="Field Jacket" wrapperClassName="size-32 rounded-xl" />
    <ProductImage src="https://images.unsplash.com/photo-0000000000000-removed?w=80" alt="Nomad Backpack" wrapperClassName="size-20 rounded-lg" />
  </div>
);
