import { Button, EmptyState, icons, ReviewList, sampleData } from "@bluesigns/ui";

const { MessageSquareText } = icons;
const { reviews } = sampleData;

export const Default = () => (
  <div style={{ maxWidth: 600 }}>
    <ReviewList reviews={reviews.slice(0, 3)} />
  </div>
);

export const Empty = () => (
  <div style={{ maxWidth: 600 }}>
    <ReviewList
      reviews={[]}
      emptyState={
        <EmptyState
          icon={<MessageSquareText aria-hidden />}
          title="No reviews yet"
          description="Bought the Nomad Backpack? Tell other shoppers how it holds up."
          action={<Button variant="secondary">Write the first review</Button>}
        />
      }
    />
  </div>
);
