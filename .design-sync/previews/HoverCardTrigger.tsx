import {
  Avatar,
  Badge,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  icons,
  PriceDisplay,
  ProductImage,
  RatingStars,
  sampleData,
  TextLink,
} from "@bluesigns/ui";

const { BadgeCheck, Star } = icons;

const { products, sellers } = sampleData;
const seller = sellers.default!;
const backpack = products.find((p) => p.name === "Nomad Backpack")!;

function SellerDetails() {
  return (
    <div className="flex items-start gap-3">
      <Avatar name={seller.name} size="md" />
      <div className="flex min-w-0 flex-col gap-1">
        <p className="flex items-center gap-1.5 text-title">
          {seller.name}
          <BadgeCheck aria-hidden className="size-icon-md text-accent-fg" />
        </p>
        <p className="flex items-center gap-1 text-caption text-fg-muted figures">
          <Star aria-hidden className="size-icon-sm fill-rating text-rating" />
          {seller.rating} seller rating · since {seller.since}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <Badge tone="accent" size="sm">
            {seller.fulfilledBy}
          </Badge>
          <Badge tone="success" size="sm">
            {seller.returnDays}-day returns
          </Badge>
        </div>
      </div>
    </div>
  );
}

export const SellerLink = () => (
  <p className="text-body text-fg-muted" style={{ maxWidth: 480 }}>
    Sold by{" "}
    <HoverCard defaultOpen>
      <HoverCardTrigger asChild>
        <TextLink href="/sellers/bluesigns-retail">{seller.name}</TextLink>
      </HoverCardTrigger>
      <HoverCardContent>
        <SellerDetails />
      </HoverCardContent>
    </HoverCard>
    {" "}and shipped from Bengaluru.
  </p>
);

export const ProductLink = () => (
  <p className="text-body text-fg-muted" style={{ maxWidth: 480 }}>
    Pairs well with the{" "}
    <HoverCard defaultOpen>
      <HoverCardTrigger asChild>
        <TextLink href={"/product/" + backpack.slug}>{backpack.name}</TextLink>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex gap-3">
          <ProductImage src={backpack.images[0]!} alt={backpack.name} sizes="80px" wrapperClassName="size-20 shrink-0 rounded-md" />
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-caption text-fg-muted">{backpack.brand}</p>
            <p className="line-clamp-1 text-body-strong">{backpack.name}</p>
            <RatingStars value={backpack.rating} count={backpack.reviewCount} size="sm" />
            <PriceDisplay amount={backpack.price} compareAt={backpack.compareAt} size="sm" showDiscount />
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
    .
  </p>
);
