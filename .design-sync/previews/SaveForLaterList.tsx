import { SaveForLaterList, sampleData, toast } from "@bluesigns/ui";

const { getProduct } = sampleData;

const item = (slug: string, size?: string) => {
  const p = getProduct(slug)!;
  return { key: [p.id, size].filter(Boolean).join(":"), productId: p.id, slug: p.slug, name: p.name, image: p.images[0]!, price: p.price, compareAt: p.compareAt, quantity: 1, size };
};

const saved = [item("court-low-sneaker", "42"), item("meridian-classic-watch"), item("no-5-eau-de-parfum", "50ml")];

export const Expanded = () => (
  <div style={{ maxWidth: 560 }}>
    <SaveForLaterList
      items={saved}
      onMoveToBag={(i) => toast({ title: "Moved to bag", description: i.name, tone: "success" })}
      onRemove={(i) => toast({ title: "Removed", description: i.name })}
    />
  </div>
);

export const Collapsed = () => (
  <div style={{ maxWidth: 560 }}>
    <SaveForLaterList items={saved} defaultOpen={false} onMoveToBag={() => {}} onRemove={() => {}} />
  </div>
);

export const SingleItem = () => (
  <div style={{ maxWidth: 560 }}>
    <SaveForLaterList items={[item("fleece-hoodie", "L")]} onMoveToBag={() => {}} onRemove={() => {}} />
  </div>
);
