import { Carousel, PriceDisplay, ProductImage, sampleData } from "@bluesigns/ui";

const { products } = sampleData;

export const HeroOverlay = () => (
  <div style={{ maxWidth: 820 }}>
    <Carousel aria-label="Featured products" className="overflow-hidden rounded-xl">
      {products.slice(0, 4).map((p) => (
        <div key={p.id} className="relative aspect-[16/7]">
          <ProductImage src={p.images[0]!} alt={p.name} sizes="820px" wrapperClassName="absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-linear-to-t from-scrim to-transparent p-5 pb-12 text-white">
            <p className="text-heading-sm">{p.name}</p>
            <p className="text-body text-fg-on-accent-muted">From {p.brand}</p>
          </div>
        </div>
      ))}
    </Carousel>
  </div>
);

export const RailHeaderControls = () => (
  <div style={{ maxWidth: 820 }}>
    <Carousel
      aria-label="Bestsellers"
      controls="header"
      header={<h3 className="text-heading-sm">Bestsellers</h3>}
      slideClassName="basis-[44%] sm:basis-1/3 lg:basis-1/5"
      gapClassName="gap-3"
    >
      {products.slice(0, 8).map((p) => (
        <article key={p.id} className="flex flex-col gap-2">
          <ProductImage src={p.images[0]!} alt={p.name} sizes="270px" wrapperClassName="aspect-[4/5] rounded-lg" />
          <p className="line-clamp-1 text-body-strong">{p.name}</p>
          <PriceDisplay amount={p.price} compareAt={p.compareAt} size="sm" showDiscount />
        </article>
      ))}
    </Carousel>
  </div>
);

export const BelowControls = () => (
  <div style={{ maxWidth: 820 }}>
    <Carousel aria-label="Recently viewed" controls="below" showDots slideClassName="basis-1/4" gapClassName="gap-3">
      {products.slice(4, 12).map((p) => (
        <article key={p.id} className="flex flex-col gap-2">
          <ProductImage src={p.images[0]!} alt={p.name} sizes="200px" wrapperClassName="aspect-square rounded-lg" />
          <p className="line-clamp-1 text-label">{p.name}</p>
        </article>
      ))}
    </Carousel>
  </div>
);
