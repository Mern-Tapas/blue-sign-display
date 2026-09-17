import { UnavailableItemNotice, sampleData, toast } from "@bluesigns/ui";

const { getProduct } = sampleData;
const jacket = getProduct("field-jacket")!;
const perfume = getProduct("no-5-eau-de-parfum")!;
const watch = getProduct("pulse-smart-watch")!;

export const BlockingItems = () => (
  <div style={{ maxWidth: 560 }}>
    <UnavailableItemNotice
      pincode="744101"
      items={[
        { key: "a", name: jacket.name, image: jacket.images[0]!, reason: "out-of-stock" },
        { key: "b", name: perfume.name, image: perfume.images[0]!, reason: "not-deliverable", detail: "fragrances can’t ship by air" },
      ]}
      onRemoveAll={() => toast({ title: "Removed unavailable items" })}
      onMoveToWishlist={() => toast({ title: "Moved to wishlist", tone: "accent" })}
    />
  </div>
);

export const SingleOutOfStock = () => (
  <div style={{ maxWidth: 560 }}>
    <UnavailableItemNotice items={[{ key: "a", name: jacket.name, image: jacket.images[0]!, reason: "out-of-stock" }]} onRemoveAll={() => {}} />
  </div>
);

export const PriceChanged = () => (
  <div style={{ maxWidth: 560 }}>
    <UnavailableItemNotice
      items={[{ key: "c", name: watch.name, image: watch.images[0]!, reason: "price-changed", detail: "now ₹9,999 (was ₹8,999)" }]}
      onRemoveAll={() => {}}
    />
  </div>
);
