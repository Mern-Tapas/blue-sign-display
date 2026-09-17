"use client";

import { useState } from "react";
import { MessageSquareText } from "lucide-react";
import { RatingSummary, ReviewList } from "@/components/commerce/review-list";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Review } from "@/lib/data/types";
import { AspectRatings, type Aspect } from "./aspect-ratings";
import { ReviewMediaStrip } from "./review-media";
import { applyReviewFilters, emptyReviewFilters, ReviewToolbar } from "./review-toolbar";
import { WriteReviewDialog } from "./write-review-dialog";

export type ProductReviewsProps = {
  product: { name: string; image: string };
  average: number;
  total: number;
  breakdown: { stars: number; count: number }[];
  aspects?: Aspect[];
  reviews: Review[];
  pageSize?: number;
};

/**
 * Complete reviews block for a product page: summary with aspect scores and customer photos,
 * write-a-review, sort and filter, paged list. Submissions are demo-only here.
 */
export function ProductReviews({ product, average, total, breakdown, aspects = [], reviews, pageSize = 5 }: ProductReviewsProps) {
  const [filters, setFilters] = useState(emptyReviewFilters);
  const [limit, setLimit] = useState(pageSize);
  const shown = applyReviewFilters(reviews, filters);
  const photos = reviews.flatMap((r) => (r.media ?? []).map((src) => ({ src, caption: `Photo by ${r.author} · ${r.rating}★` })));

  const write = (
    <WriteReviewDialog
      product={product}
      aspects={aspects.map((a) => a.label)}
      trigger={
        <Button variant="secondary" fullWidth>
          Write a review
        </Button>
      }
      onSubmit={async () => {
        await new Promise((r) => setTimeout(r, 900));
        toast({ title: "Review submitted", description: "Demo store: reviews aren’t saved.", tone: "success" });
      }}
    />
  );

  return (
    <div data-slot="product-reviews" className="grid gap-5 lg:grid-cols-[22rem_1fr]">
      <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
        <RatingSummary average={average} total={total} breakdown={breakdown} action={write} />
        {(aspects.length > 0 || photos.length > 0) && (
          <Card className="gap-5">
            {aspects.length > 0 && <AspectRatings aspects={aspects} />}
            {photos.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="text-label">Customer photos</h3>
                <ReviewMediaStrip items={photos} max={4} size="sm" />
              </div>
            )}
          </Card>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <ReviewToolbar
          reviews={reviews}
          value={filters}
          onChange={(f) => {
            setFilters(f);
            setLimit(pageSize);
          }}
        />
        <ReviewList
          reviews={shown.slice(0, limit)}
          emptyState={
            <Card variant="outline" padding="none">
              <EmptyState
                compact
                icon={<MessageSquareText aria-hidden />}
                title="No reviews match these filters"
                action={
                  <Button variant="secondary" size="sm" onClick={() => setFilters({ ...emptyReviewFilters, sort: filters.sort })}>
                    Clear filters
                  </Button>
                }
              />
            </Card>
          }
        />
        {shown.length > limit && (
          <Button variant="secondary" className="self-center" onClick={() => setLimit((l) => l + pageSize)}>
            Show more reviews
          </Button>
        )}
      </div>
    </div>
  );
}
