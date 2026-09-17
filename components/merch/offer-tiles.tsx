import Link from "next/link";
import { ArrowUpRight, BadgePercent, CreditCard, Landmark, Smartphone, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { IconTile } from "@/components/ui/icon-tile";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/cn";
import type { BankOffer } from "@/lib/data/types";

export type OfferTile = {
  id: string;
  title: string;
  description?: string;
  /** Who funds the offer: bank or partner name. */
  source?: string;
  icon?: React.ReactNode;
  code?: string;
  href?: string;
  /** First tile can span two columns on large screens. */
  featured?: boolean;
  tone?: "accent" | "contrast" | "surface";
};

const kindIcon: Record<BankOffer["kind"], React.ReactNode> = {
  bank: <CreditCard />,
  emi: <Landmark />,
  upi: <Smartphone />,
  wallet: <Wallet />,
  partner: <BadgePercent />,
};

/** Maps bank / payment offers to tiles. */
export function bankOfferTiles(offers: BankOffer[]): OfferTile[] {
  return offers.map((o) => ({ id: o.id, title: o.title, description: o.detail, source: o.bank, icon: kindIcon[o.kind], tone: "surface" }));
}

export type OfferTilesProps = {
  offers: OfferTile[];
  "aria-label"?: string;
  /** Show a "Demo offer" badge — required while offers are illustrative. */
  demo?: boolean;
  /** Link to the full terms page. */
  termsHref?: string;
  className?: string;
};

/** Card variant supplies the fill; this only sets the muted text colour for the tone. */
const tones = {
  accent: "[--tile-muted:var(--fg-on-accent-muted)]",
  contrast: "[--tile-muted:var(--fg-on-contrast-muted)]",
  surface: "[--tile-muted:var(--fg-muted)]",
} as const;

/**
 * Bento of bank offers, coupons and promotions. Codes copy in one tap; each tile says who
 * funds the offer. Server-safe (CopyButton hydrates itself).
 */
export function OfferTiles({ offers, "aria-label": ariaLabel = "Offers", demo = false, termsHref, className }: OfferTilesProps) {
  return (
    <div data-slot="offer-tiles" className={cn("flex flex-col gap-3", className)}>
      <ul aria-label={ariaLabel} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {offers.map((o) => {
          const tone = o.tone ?? "surface";
          const onColor = tone !== "surface";
          const body = (
            <>
              <span className="flex items-start justify-between gap-3">
                {o.icon && (
                  <IconTile size="md" tone={onColor ? "onColor" : "accent"} className="[&_svg]:size-icon-lg">
                    {o.icon}
                  </IconTile>
                )}
                {demo && (
                  <Badge size="sm" tone={onColor ? "inverse" : "outline"}>
                    Demo offer
                  </Badge>
                )}
              </span>
              <span className="flex flex-col gap-1">
                {o.source && <span className="text-caption text-(--tile-muted)">{o.source}</span>}
                <span className={cn(o.featured ? "text-heading-md" : "text-title")}>{o.title}</span>
                {o.description && <span className="text-body text-(--tile-muted)">{o.description}</span>}
              </span>
            </>
          );
          return (
            <Card asChild key={o.id} variant={tone} padding="none" className={cn("justify-between gap-5 p-5", tones[tone], o.featured && "lg:col-span-2")}>
              <li>
                {o.href ? (
                  <Link href={o.href} className="group flex flex-1 flex-col justify-between gap-5 focus-ring-card after:absolute after:inset-0 after:rounded-2xl">
                    {body}
                    <span className="flex items-center gap-1 text-label">
                      View offer <ArrowUpRight aria-hidden className="size-icon-sm transition-transform duration-(--dur-fast) group-hover:rotate-45" />
                    </span>
                  </Link>
                ) : (
                  <div className="flex flex-1 flex-col justify-between gap-5">{body}</div>
                )}
                {o.code && (
                  <span
                    className={cn(
                      "relative z-10 flex items-center justify-between gap-2 rounded-lg border border-dashed py-1 pr-1 pl-3",
                      onColor ? "border-edge-on-color" : "border-accent bg-accent-soft text-accent-soft-fg",
                    )}
                  >
                    <span className="text-code">{o.code}</span>
                    <CopyButton value={o.code} appearance="button" label="Copy" variant={onColor ? "inverse" : "secondary"} />
                  </span>
                )}
              </li>
            </Card>
          );
        })}
      </ul>
      {termsHref && (
        <p className="text-caption text-fg-muted">
          Offers are funded by the listed banks and partners and may change.{" "}
          <TextLink href={termsHref}>Terms apply</TextLink>
          .
        </p>
      )}
    </div>
  );
}
