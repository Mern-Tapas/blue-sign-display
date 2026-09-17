import { RatingPill } from "@bluesigns/ui";

export const ScoreBands = () => (
  <div className="flex flex-wrap items-center gap-3">
    <RatingPill value={4.7} />
    <RatingPill value={4.0} />
    <RatingPill value={3.4} />
    <RatingPill value={2.1} />
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-3">
    <RatingPill value={4.3} size="sm" />
    <RatingPill value={4.3} size="md" />
    <RatingPill value={4.3} size="lg" />
  </div>
);

export const WithCount = () => (
  <div className="flex flex-col items-start gap-3">
    <RatingPill value={4.3} count={1284} />
    <RatingPill value={4.6} count={25310} size="md" />
    <RatingPill value={3.8} count={532} size="lg" />
  </div>
);
