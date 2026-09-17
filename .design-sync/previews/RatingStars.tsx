import { RatingStars } from "@bluesigns/ui";

export const WithValueAndCount = () => (
  <div className="flex flex-col items-start gap-3">
    <RatingStars value={4.7} count={1284} showValue />
    <RatingStars value={4.2} count={318} showValue />
  </div>
);

export const Sizes = () => (
  <div className="flex flex-col items-start gap-3">
    <RatingStars value={4.5} size="sm" />
    <RatingStars value={4.5} size="md" />
    <RatingStars value={4.5} size="lg" />
  </div>
);

export const PartialFill = () => (
  <div className="flex flex-col items-start gap-2">
    {[5, 4.3, 3.5, 2.8, 1].map((v) => (
      <RatingStars key={v} value={v} showValue />
    ))}
  </div>
);

export const CountOnly = () => <RatingStars value={3.9} count={42} size="sm" />;
