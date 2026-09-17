import { BadgeCheck } from "lucide-react";
import { HelpfulVote } from "@/components/reviews/helpful-vote";
import { RatingPill } from "@/components/reviews/rating-pill";
import { ReviewMediaStrip } from "@/components/reviews/review-media";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { Review } from "@/lib/data/types";
import { formatDate, formatNumber } from "@/lib/format";
import { RatingStars } from "./rating-stars";

export type RatingSummaryProps = {
  average: number;
  total: number;
  breakdown: { stars: number; count: number }[];
  action?: React.ReactNode;
  className?: string;
};

/** Average score + hatched histogram bars (echoing the dashboard bar charts). */
export function RatingSummary({ average, total, breakdown, action, className }: RatingSummaryProps) {
  const max = Math.max(...breakdown.map((b) => b.count), 1);
  return (
    <Card data-slot="rating-summary" className={cn("gap-5", className)}>
      <div className="flex items-end gap-3">
        <p className="text-figure-xl figures">{average.toFixed(1)}</p>
        <div className="pb-1.5">
          <RatingStars value={average} size="sm" />
          <p className="mt-1 text-caption text-fg-muted">
            Based on <span className="figures">{formatNumber(total)}</span> reviews
          </p>
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {breakdown.map((b) => {
          const pct = total ? Math.round((b.count / total) * 100) : 0;
          return (
            <li key={b.stars} className="flex items-center gap-3 text-caption">
              <span className="w-6 text-fg-muted figures">{b.stars}★</span>
              <span className="relative h-2.5 flex-1 overflow-hidden rounded-pill bg-hatch bg-surface-sunken text-fg-subtle">
                <span
                  className="absolute inset-y-0 left-0 rounded-pill bg-accent"
                  style={{ width: `${(b.count / max) * 100}%` }}
                />
              </span>
              <span className="w-9 text-right text-fg-muted figures">{pct}%</span>
            </li>
          );
        })}
      </ul>
      {action}
    </Card>
  );
}

export type ReviewCardProps = {
  review: Review;
  /** Hide the vote row (e.g. in compact summaries). */
  showHelpful?: boolean;
  className?: string;
};

/**
 * One review: score pill, title, body, customer photos, verified-buyer mark and helpful votes.
 * Illustrative reviews (review.demo) carry a visible "Demo review" badge. Server-safe; the vote
 * and photo viewer hydrate on their own.
 */
export function ReviewCard({ review, showHelpful = true, className }: ReviewCardProps) {
  return (
    <Card asChild className={cn("gap-3", className)}>
    <article data-slot="review">
      <header className="flex items-start gap-3">
        <Avatar name={review.author} src={review.avatar} size="md" />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-body-strong">
            {review.author}
            {review.verified && (
              <span className="inline-flex items-center gap-1 text-caption font-normal text-success-fg">
                <BadgeCheck aria-hidden className="size-icon-sm" /> Verified buyer
              </span>
            )}
          </p>
          <p className="text-caption text-fg-muted">
            <time dateTime={review.date}>{formatDate(review.date)}</time>
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <RatingPill value={review.rating} size="md" />
          {review.demo && (
            <Badge tone="outline" size="sm">
              Demo review
            </Badge>
          )}
        </div>
      </header>
      <div>
        <h3 className="text-body-strong">{review.title}</h3>
        <p className="mt-1 text-body text-fg-muted">{review.body}</p>
      </div>
      {review.media && review.media.length > 0 && (
        <ReviewMediaStrip size="sm" aria-label={`Photos from ${review.author}`} items={review.media.map((src) => ({ src, caption: `Photo by ${review.author} · ${review.rating}★` }))} />
      )}
      {showHelpful && (
        <footer className="border-t border-border-subtle pt-3">
          <HelpfulVote helpful={review.helpful} notHelpful={Math.round(review.helpful / 8)} subject={`review by ${review.author}`} />
        </footer>
      )}
    </article>
    </Card>
  );
}

export type ReviewListProps = { reviews: Review[]; emptyState?: React.ReactNode; className?: string };

export function ReviewList({ reviews, emptyState, className }: ReviewListProps) {
  if (reviews.length === 0 && emptyState) return <>{emptyState}</>;
  return (
    <div data-slot="review-list" className={cn("flex flex-col gap-3", className)}>
      {reviews.map((r) => (
        <ReviewCard key={r.id} review={r} />
      ))}
    </div>
  );
}
