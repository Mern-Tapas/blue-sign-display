import { EmiOptionsDialog, ProductTitleBlock, sampleData } from "@bluesigns/ui";

const { banks, emiAmount, emiPlans, getProduct } = sampleData;
const headphones = getProduct("aura-wireless-headphones")!;

const emiBanks = Object.entries(emiPlans).map(([id, plans]) => ({ id, name: banks.find((b) => b.id === id)?.name ?? id, plans }));
const lowestEmi = (price: number) => Math.min(...emiBanks.flatMap((b) => b.plans.map((p) => emiAmount(price, p.months, p.interestRate))));

export const Full = () => (
  <div style={{ maxWidth: 560 }}>
    <ProductTitleBlock
      product={headphones}
      headingLevel="h2"
      brandHref="/shop?q=Sonora"
      writtenReviews={212}
      assured="BlueSigns Assured"
      emiFrom={lowestEmi(headphones.price)}
      emiAction={<EmiOptionsDialog price={headphones.price} banks={emiBanks} demo />}
    />
  </div>
);

export const NoDiscount = () => {
  const p = getProduct("studio-over-ear-headphones")!;
  return (
    <div style={{ maxWidth: 560 }}>
      <ProductTitleBlock product={p} headingLevel="h2" writtenReviews={48} />
    </div>
  );
};

export const LowRated = () => (
  <div style={{ maxWidth: 560 }}>
    <ProductTitleBlock
      headingLevel="h2"
      product={{ name: "Everyday Canvas Tote", brand: "Loom & Co.", rating: 2.9, reviewCount: 37, price: 699, compareAt: 999 }}
      writtenReviews={11}
    />
  </div>
);

export const WithEmiTeaser = () => {
  const p = getProduct("meridian-classic-watch")!;
  return (
    <div style={{ maxWidth: 560 }}>
      <ProductTitleBlock product={p} headingLevel="h2" assured="BlueSigns Assured" emiFrom={lowestEmi(p.price)} emiAction={<EmiOptionsDialog price={p.price} banks={emiBanks} />} />
    </div>
  );
};
