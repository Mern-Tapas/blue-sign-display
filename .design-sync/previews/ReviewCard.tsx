import { ReviewCard, sampleData } from "@bluesigns/ui";

const { reviews } = sampleData;

export const WithPhotos = () => (
  <div style={{ maxWidth: 560 }}>
    <ReviewCard review={reviews[0]!} />
  </div>
);

export const Unverified = () => (
  <div style={{ maxWidth: 560 }}>
    <ReviewCard review={{ ...reviews[2]!, verified: false }} />
  </div>
);

export const MixedRating = () => (
  <div style={{ maxWidth: 560 }}>
    <ReviewCard review={reviews[3]!} />
  </div>
);

export const WithoutVotes = () => (
  <div style={{ maxWidth: 560 }}>
    <ReviewCard review={reviews[1]!} showHelpful={false} />
  </div>
);
