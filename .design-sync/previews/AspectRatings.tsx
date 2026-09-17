import { AspectRatings, sampleData } from "@bluesigns/ui";

const { aspectRatings } = sampleData;

export const Bars = () => (
  <div style={{ maxWidth: 400 }}>
    <AspectRatings aspects={aspectRatings} />
  </div>
);

export const Grid = () => (
  <div style={{ maxWidth: 640 }}>
    <AspectRatings aspects={[...aspectRatings.slice(0, 3), { label: "Packaging", value: 2.8 }]} variant="grid" />
  </div>
);

export const MixedScores = () => (
  <div style={{ maxWidth: 400 }}>
    <AspectRatings
      title="What buyers say about fit"
      aspects={[
        { label: "Comfort", value: 4.5 },
        { label: "True to size", value: 3.4 },
        { label: "Fabric quality", value: 4.1 },
        { label: "Colour as shown", value: 2.6 },
      ]}
    />
  </div>
);
