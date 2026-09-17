"use client";

import { Camera, Star, BadgeCheck } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { Select } from "@/components/ui/select";
import { TextButton } from "@/components/ui/text-button";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import type { Review } from "@/lib/data/types";

export type ReviewSort = "helpful" | "recent" | "high" | "low";

export type ReviewFilterState = { sort: ReviewSort; stars: number[]; withMedia: boolean; verified: boolean };

export const emptyReviewFilters: ReviewFilterState = { sort: "helpful", stars: [], withMedia: false, verified: false };

export function applyReviewFilters(reviews: Review[], f: ReviewFilterState) {
  const list = reviews.filter(
    (r) => (!f.stars.length || f.stars.includes(Math.round(r.rating))) && (!f.withMedia || Boolean(r.media?.length)) && (!f.verified || r.verified),
  );
  const sorted = [...list];
  if (f.sort === "helpful") sorted.sort((a, b) => b.helpful - a.helpful);
  if (f.sort === "recent") sorted.sort((a, b) => b.date.localeCompare(a.date));
  if (f.sort === "high") sorted.sort((a, b) => b.rating - a.rating);
  if (f.sort === "low") sorted.sort((a, b) => a.rating - b.rating);
  return sorted;
}

export type ReviewToolbarProps = {
  reviews: Review[];
  value: ReviewFilterState;
  onChange: (next: ReviewFilterState) => void;
  className?: string;
};

/** Sort plus filter chips for stars, "With photos" and "Verified buyers", with counts from the loaded reviews. */
export function ReviewToolbar({ reviews, value, onChange, className }: ReviewToolbarProps) {
  const shown = applyReviewFilters(reviews, value);
  const countStars = (s: number) => reviews.filter((r) => Math.round(r.rating) === s).length;
  const toggleStar = (s: number) => onChange({ ...value, stars: value.stars.includes(s) ? value.stars.filter((x) => x !== s) : [...value.stars, s] });
  const active = value.stars.length + Number(value.withMedia) + Number(value.verified);

  return (
    <div data-slot="review-toolbar" className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-label text-fg-muted" aria-live="polite">
          <span className="text-fg figures">{formatNumber(shown.length)}</span> {shown.length === 1 ? "review" : "reviews"}
          {active > 0 && (
            <TextButton size="inherit" onClick={() => onChange({ ...emptyReviewFilters, sort: value.sort })} className="ml-2">
              Clear filters
            </TextButton>
          )}
        </p>
        <Select
          aria-label="Sort reviews"
          prefix="Sort:"
          size="sm"
          variant="sunken"
          value={value.sort}
          onValueChange={(v) => onChange({ ...value, sort: v as ReviewSort })}
          className="w-auto min-w-48"
          options={[
            { value: "helpful", label: "Most helpful" },
            { value: "recent", label: "Most recent" },
            { value: "high", label: "Highest rating" },
            { value: "low", label: "Lowest rating" },
          ]}
        />
      </div>
      <div role="group" aria-label="Filter reviews" className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
        {[5, 4, 3, 2, 1].map((s) => (
          <Chip key={s} selected={value.stars.includes(s)} onClick={() => toggleStar(s)} count={countStars(s)} disabled={countStars(s) === 0} aria-label={`${s} star reviews`} icon={<Star className="fill-current" />}>
            {s}
          </Chip>
        ))}
        <Chip selected={value.withMedia} onClick={() => onChange({ ...value, withMedia: !value.withMedia })} icon={<Camera />}>
          With photos
        </Chip>
        <Chip selected={value.verified} onClick={() => onChange({ ...value, verified: !value.verified })} icon={<BadgeCheck />}>
          Verified buyers
        </Chip>
      </div>
    </div>
  );
}
