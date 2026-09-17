import { BadgeCheck, RotateCcw, Store } from "lucide-react";
import { RatingPill } from "@/components/reviews/rating-pill";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { TextLink } from "@/components/ui/text-link";
import type { Seller } from "@/lib/data/types";

export type SellerCardProps = {
  seller: Seller;
  /** Other sellers offering the same product. */
  otherSellersHref?: string;
  otherSellersCount?: number;
  demo?: boolean;
  className?: string;
};

/** Who sells and ships the item: rating, tenure, fulfilment and return policy. Server-safe. */
export function SellerCard({ seller, otherSellersHref, otherSellersCount, demo = false, className }: SellerCardProps) {
  return (
    <Card asChild variant="outline" padding="sm" radius="xl" className={className}>
      <section data-slot="seller-card" aria-label="Seller">
        <div className="flex items-start gap-3">
          <IconTile tone="muted">
            <Store />
          </IconTile>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="text-caption text-fg-muted">Sold by</p>
            <p className="flex flex-wrap items-center gap-2 text-title">
              {seller.name}
              <RatingPill value={seller.rating} />
            </p>
            <p className="text-caption text-fg-muted">Selling on BlueSigns since {seller.since}</p>
          </div>
          {demo && (
            <Badge tone="outline" size="sm">
              Demo
            </Badge>
          )}
        </div>
        <ul className="flex flex-col gap-2 text-body">
          {seller.fulfilledBy && (
            <li className="flex items-center gap-2">
              <BadgeCheck aria-hidden className="size-icon-md text-accent-fg" />
              {seller.fulfilledBy} — checked and packed by BlueSigns
            </li>
          )}
          <li className="flex items-center gap-2">
            <RotateCcw aria-hidden className="size-icon-md text-fg-muted" />
            {seller.returnDays}-day return policy
          </li>
        </ul>
        {otherSellersHref && otherSellersCount ? (
          <TextLink href={otherSellersHref} className="self-start text-label">
            See {otherSellersCount} other {otherSellersCount === 1 ? "seller" : "sellers"}
          </TextLink>
        ) : null}
      </section>
    </Card>
  );
}
