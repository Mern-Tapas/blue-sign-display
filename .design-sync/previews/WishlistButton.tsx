import { ProductImage, sampleData, WishlistButton } from "@bluesigns/ui";

const { getProduct } = sampleData;
const headphones = getProduct("aura-wireless-headphones")!;

export const States = () => (
  <div className="flex items-center gap-3">
    <WishlistButton productName={headphones.name} variant="secondary" size="lg" notify={false} />
    <WishlistButton productName={headphones.name} variant="secondary" size="lg" defaultSaved notify={false} />
  </div>
);

export const Sizes = () => (
  <div className="flex items-center gap-3">
    <WishlistButton productName={headphones.name} variant="secondary" size="sm" notify={false} />
    <WishlistButton productName={headphones.name} variant="secondary" size="md" notify={false} />
    <WishlistButton productName={headphones.name} variant="secondary" size="lg" defaultSaved notify={false} />
  </div>
);

export const OverlayOnImage = () => (
  <div className="flex gap-3">
    {["fleece-hoodie", "meridian-classic-watch"].map((slug, i) => {
      const p = getProduct(slug)!;
      return (
        <div key={slug} className="relative" style={{ width: 200 }}>
          <ProductImage src={p.images[0]!} alt={p.name} sizes="200px" wrapperClassName="aspect-[4/5] rounded-xl" />
          <WishlistButton productName={p.name} size="sm" defaultSaved={i === 1} notify={false} className="absolute top-2.5 right-2.5" />
        </div>
      );
    })}
  </div>
);
