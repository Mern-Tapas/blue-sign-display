import { useState } from "react";
import { ReviewMediaLightbox, sampleData } from "@bluesigns/ui";

const { reviews } = sampleData;
const review = reviews[0]!;
const items = review.media!.map((src) => ({ src, caption: `Photo by ${review.author} · ${review.rating}★` }));

// Controlled: ReviewMediaStrip owns open + index in the app.
function Lightbox({ start }: { start: number }) {
  const [open, setOpen] = useState(true);
  const [index, setIndex] = useState(start);
  return <ReviewMediaLightbox items={items} open={open} onOpenChange={setOpen} index={index} onIndexChange={setIndex} />;
}

export const FirstPhoto = () => <Lightbox start={0} />;

export const LaterPhoto = () => <Lightbox start={1} />;
