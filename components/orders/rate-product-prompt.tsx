"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ProductImage } from "@/components/commerce/product-image";
import { toast } from "@/components/providers/toast-store";
import { WriteReviewDialog } from "@/components/reviews/write-review-dialog";
import { Card } from "@/components/ui/card";
import { RatingInput } from "@/components/ui/rating-input";
import { cn } from "@/lib/cn";

export type RateProductPromptProps = {
  product: { name: string; image: string };
  aspects?: string[];
  onSubmit?: Parameters<typeof WriteReviewDialog>[0]["onSubmit"];
  onDismiss?: () => void;
  className?: string;
};

/**
 * "How was it?" after delivery: tapping a star opens the review dialog with that rating already
 * set, so a quick rating takes one tap and a full review stays optional.
 */
export function RateProductPrompt({ product, aspects, onSubmit, onDismiss, className }: RateProductPromptProps) {
  const [stars, setStars] = useState(0);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <Card asChild className={cn("flex-row items-center gap-3", className)}>
      <section data-slot="rate-product" aria-label={`Rate ${product.name}`}>
        <ProductImage src={product.image} alt="" sizes="56px" wrapperClassName="size-14 shrink-0 rounded-lg" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 pr-8">
          <p className="truncate text-body-strong">How was {product.name}?</p>
          <RatingInput
            aria-label={`Rate ${product.name}`}
            size="md"
            value={stars}
            showLabel={false}
            onValueChange={(v) => {
              setStars(v);
              setOpen(true);
            }}
          />
        </div>
        <button
          type="button"
          aria-label="Not now"
          onClick={() => {
            setHidden(true);
            onDismiss?.();
          }}
          className="state-layer hit-area absolute top-3 right-3 flex size-control-xs items-center justify-center rounded-pill text-fg-muted hover:text-fg"
        >
          <X aria-hidden className="size-icon-sm" />
        </button>
        <WriteReviewDialog
          product={product}
          aspects={aspects}
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) setStars(0);
          }}
          defaultRating={stars}
          onSubmit={
            onSubmit ??
            (async () => {
              await new Promise((r) => setTimeout(r, 800));
              toast({ title: "Thanks for rating", tone: "success" });
            })
          }
        />
      </section>
    </Card>
  );
}
