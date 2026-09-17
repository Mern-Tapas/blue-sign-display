import type { Metadata } from "next";
import { ReviewCard, RatingSummary, ReviewList } from "@/components/commerce/review-list";
import { FullReviewsDemo, ReviewPiecesDemo } from "@/components/docs/demos/reviews-demo";
import { DsGrid, DsPageHeader, DsPreview, DsProps, DsSection } from "@/components/docs/ds-section";
import { AspectRatings } from "@/components/reviews/aspect-ratings";
import { aspectRatings, reviews, ratingBreakdown } from "@/lib/data/reviews";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Reviews & ratings" };

export default function ReviewsPage() {
  return (
    <>
      <DsPageHeader
        title="Reviews"
        muted="& ratings"
        description="How shoppers read and write reviews. Demo reviews carry a visible “Demo review” badge until real ones exist — proof is never invented."
      />

      <DsSection title="Reviews block" description="Summary, aspect scores and customer photos on the left; write a review, sort, filter and a paged list on the right. This is what every product page renders.">
        <FullReviewsDemo />
      </DsSection>

      <DsSection title="Review card" description="Score pill, verified-buyer mark, customer photos that open a lightbox, and helpful votes.">
        <DsGrid>
          <ReviewCard review={reviews[0]!} />
          <ReviewCard review={{ ...reviews[2]!, demo: true, verified: false }} />
        </DsGrid>
      </DsSection>

      <DsSection title="Aspect ratings">
        <DsGrid>
          <DsPreview label="Bars" className="block">
            <AspectRatings aspects={aspectRatings} />
          </DsPreview>
          <DsPreview label="Grid" className="block">
            <AspectRatings aspects={[...aspectRatings.slice(0, 3), { label: "Packaging", value: 2.8 }]} variant="grid" />
          </DsPreview>
        </DsGrid>
      </DsSection>

      <DsSection title="Pieces">
        <ReviewPiecesDemo />
      </DsSection>

      <DsSection title="Summary & list" description="RatingSummary with the distribution and a write-review action beside a plain ReviewList (demo reviews).">
        <div className="grid gap-5 lg:grid-cols-[20rem_1fr]">
          <RatingSummary
            average={4.7}
            total={ratingBreakdown.reduce((n, b) => n + b.count, 0)}
            breakdown={ratingBreakdown}
            action={
              <Button variant="secondary" fullWidth>
                Write a review
              </Button>
            }
          />
          <ReviewList reviews={reviews.slice(0, 2)} />
        </div>
      </DsSection>

      <DsSection title="Props">
        <div className="flex flex-col gap-5">
          <DsProps
            component="ProductReviews"
            rows={[
              { name: "product · average · total · breakdown", type: "{ name, image } · number · number · { stars, count }[]", description: "Summary data and the product shown in the write dialog." },
              { name: "aspects · reviews · pageSize", type: "Aspect[] · Review[] · number", default: "— · — · 5", description: "Aspect bars, the list and Show more paging." },
            ]}
          />
          <DsProps
            component="ReviewCard (updated) · ReviewList"
            rows={[
              { name: "review · showHelpful", type: "Review · boolean", default: "— · true", description: "review.media opens the lightbox; review.demo adds the Demo review badge." },
              { name: "reviews · emptyState", type: "Review[] · ReactNode", description: "ReviewList renders emptyState when there are no reviews." },
            ]}
          />
          <DsProps
            component="WriteReviewDialog"
            rows={[
              { name: "product · aspects", type: "{ name, image } · string[]", description: "Optional per-aspect stars." },
              { name: "onSubmit", type: "(draft: { rating, aspects, title, body, photos }) => Promise<void>", description: "Throw an Error to show its message; the draft is kept." },
              { name: "trigger · moderationNote", type: "ReactElement · string", description: "Success screen explains when the review appears." },
            ]}
          />
          <DsProps
            component="ReviewToolbar · HelpfulVote · ReviewMediaStrip · AspectRatings"
            rows={[
              { name: "reviews · value · onChange", type: "ReviewToolbar", description: "{ sort, stars[], withMedia, verified }; applyReviewFilters() does the work." },
              { name: "helpful · notHelpful · onVote · onReport · subject", type: "HelpfulVote", description: "One vote at a time; counts include the shopper’s vote." },
              { name: "items · max · size", type: "ReviewMediaStrip", description: "“+N” tile opens the lightbox (ReviewMediaLightbox)." },
              { name: "aspects · variant · title", type: 'AspectRatings — Aspect[] · "bars" | "grid"', description: "Numbers always visible." },
            ]}
          />
        </div>
      </DsSection>
    </>
  );
}
