import { AddToCartButton, sampleData } from "@bluesigns/ui";

const { getProduct } = sampleData;
const headphones = getProduct("aura-wireless-headphones")!;
const tee = getProduct("heavyweight-tee")!;
const hiker = getProduct("trail-hiker-sneaker")!; // stock: 0

export const Default = () => (
  <div className="flex flex-wrap items-center gap-3">
    <AddToCartButton product={headphones} color="Violet" />
    <AddToCartButton product={tee} color="Olive" variantSize="L" label="Add to bag" variant="secondary" />
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-3">
    <AddToCartButton product={headphones} size="sm" />
    <AddToCartButton product={headphones} size="md" />
    <AddToCartButton product={headphones} size="lg" />
    <AddToCartButton product={headphones} size="xl" />
  </div>
);

export const CompactQuickAdd = () => (
  <div className="flex flex-wrap items-center gap-3">
    <AddToCartButton product={headphones} appearance="compact" openDrawer={false} />
    <AddToCartButton product={hiker} appearance="compact" openDrawer={false} />
  </div>
);

export const SoldOut = () => (
  <div className="flex flex-wrap items-center gap-3">
    <AddToCartButton product={hiker} />
    <AddToCartButton product={headphones} disabled label="Select a colour" />
  </div>
);

export const FullWidth = () => (
  <div className="flex max-w-sm flex-col gap-3">
    <AddToCartButton product={headphones} color="Graphite" size="lg" fullWidth />
  </div>
);
