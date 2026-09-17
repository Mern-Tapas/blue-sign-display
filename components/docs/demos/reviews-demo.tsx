"use client";

import { useState } from "react";
import { DsGrid, DsPreview } from "@/components/docs/ds-section";
import { ProductReviews } from "@/components/reviews/product-reviews";
import { HelpfulVote } from "@/components/reviews/helpful-vote";
import { ReviewMediaStrip } from "@/components/reviews/review-media";
import { emptyReviewFilters, ReviewToolbar } from "@/components/reviews/review-toolbar";
import { WriteReviewDialog } from "@/components/reviews/write-review-dialog";
import { toast } from "@/components/providers/toast-store";
import { aspectRatings, ratingBreakdown, reviews } from "@/lib/data/reviews";
import { getProduct } from "@/lib/data/products";

const p = getProduct("aura-wireless-headphones")!;

export function FullReviewsDemo() {
  return (
    <ProductReviews
      product={{ name: p.name, image: p.images[0]! }}
      average={p.rating}
      total={p.reviewCount}
      breakdown={ratingBreakdown}
      aspects={aspectRatings}
      reviews={reviews}
      pageSize={3}
    />
  );
}

export function ReviewPiecesDemo() {
  const [filters, setFilters] = useState(emptyReviewFilters);
  return (
    <DsGrid>
      <DsPreview label="WriteReviewDialog" className="flex-col items-start">
        <WriteReviewDialog
          product={{ name: p.name, image: p.images[0]! }}
          aspects={aspectRatings.map((a) => a.label)}
          onSubmit={async (d) => {
            await new Promise((r) => setTimeout(r, 900));
            if (d.title.toLowerCase().includes("fail")) throw new Error("We couldn’t reach the server. Your review is still here — try again.");
          }}
        />
        <p className="text-caption text-fg-muted">Submit empty to see validation. A title containing “fail” shows the error alert.</p>
      </DsPreview>
      <DsPreview label="HelpfulVote" className="flex-col items-start">
        <HelpfulVote helpful={48} />
        <HelpfulVote helpful={12} notHelpful={3} onReport={() => toast({ title: "Thanks — we’ll review this report", tone: "info" })} className="w-full" />
      </DsPreview>
      <DsPreview label="ReviewMediaStrip" className="flex-col items-start">
        <ReviewMediaStrip items={p.images.concat(p.images).map((src, i) => ({ src, caption: `Photo ${i + 1} · demo` }))} max={4} />
        <p className="text-caption text-fg-muted">Open a photo, then use the arrow keys.</p>
      </DsPreview>
      <DsPreview label="ReviewToolbar" className="block">
        <ReviewToolbar reviews={reviews} value={filters} onChange={setFilters} />
      </DsPreview>
    </DsGrid>
  );
}
