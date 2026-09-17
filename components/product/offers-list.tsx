"use client";

import { useId, useState } from "react";
import { BadgePercent, CreditCard, Landmark, Smartphone, Tag, Wallet } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { TextButton } from "@/components/ui/text-button";
import { cn } from "@/lib/cn";

export type OfferItem = {
  id: string;
  kind: "bank" | "emi" | "upi" | "wallet" | "partner" | "coupon";
  title: string;
  detail?: string;
  terms?: string[];
};

const icons: Record<OfferItem["kind"], React.ReactNode> = {
  bank: <CreditCard />,
  emi: <Landmark />,
  upi: <Smartphone />,
  wallet: <Wallet />,
  partner: <BadgePercent />,
  coupon: <Tag />,
};

export type OffersListProps = {
  offers: OfferItem[];
  title?: string;
  /** Offers shown before "+N more". */
  visibleCount?: number;
  demo?: boolean;
  className?: string;
};

/** "Available offers" on a product page: one line per offer, terms on demand, the rest behind "+N more". */
export function OffersList({ offers, title = "Available offers", visibleCount = 3, demo = false, className }: OffersListProps) {
  const id = useId();
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? offers : offers.slice(0, visibleCount);
  const hidden = offers.length - visibleCount;

  if (offers.length === 0) return null;

  return (
    <section data-slot="offers-list" aria-labelledby={`${id}-title`} className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-2">
        <h2 id={`${id}-title`} className="text-title">
          {title}
        </h2>
        {demo && (
          <Badge tone="outline" size="sm">
            Demo offers
          </Badge>
        )}
      </div>
      <ul id={`${id}-list`} className="flex flex-col gap-3">
        {shown.map((o) => (
          <li key={o.id} className="flex items-start gap-3 text-body">
            <span aria-hidden className="mt-0.5 shrink-0 text-success-fg [&_svg]:size-icon-md">
              {icons[o.kind]}
            </span>
            <span className="min-w-0 flex-1">
              <span className="text-body-strong text-fg">{o.title}</span>
              {o.detail && <span className="text-fg-muted"> · {o.detail}</span>}
              {o.terms && o.terms.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <TextButton className="ml-1.5">T&amp;C</TextButton>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-80">
                    <p className="text-label">Terms and conditions</p>
                    <ul className="mt-2 flex list-disc flex-col gap-1 pl-4 text-caption text-fg-muted">
                      {o.terms.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </PopoverContent>
                </Popover>
              )}
            </span>
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <TextButton aria-expanded={expanded} aria-controls={`${id}-list`} onClick={() => setExpanded((e) => !e)} className="self-start">
          {expanded ? "Show fewer offers" : `+${hidden} more ${hidden === 1 ? "offer" : "offers"}`}
        </TextButton>
      )}
    </section>
  );
}
