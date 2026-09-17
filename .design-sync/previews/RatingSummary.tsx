import { Button, RatingSummary, sampleData } from "@bluesigns/ui";

const { ratingBreakdown } = sampleData;
const total = ratingBreakdown.reduce((n, b) => n + b.count, 0);

export const WithAction = () => (
  <div style={{ maxWidth: 352 }}>
    <RatingSummary
      average={4.7}
      total={total}
      breakdown={ratingBreakdown}
      action={
        <Button variant="secondary" fullWidth>
          Write a review
        </Button>
      }
    />
  </div>
);

export const Plain = () => (
  <div style={{ maxWidth: 352 }}>
    <RatingSummary average={4.7} total={total} breakdown={ratingBreakdown} />
  </div>
);

export const MixedReviews = () => (
  <div style={{ maxWidth: 352 }}>
    <RatingSummary
      average={3.4}
      total={96}
      breakdown={[
        { stars: 5, count: 28 },
        { stars: 4, count: 19 },
        { stars: 3, count: 17 },
        { stars: 2, count: 12 },
        { stars: 1, count: 20 },
      ]}
    />
  </div>
);
