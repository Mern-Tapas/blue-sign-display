import { useEffect, useState } from "react";
import { sampleData, WriteReviewDialog } from "@bluesigns/ui";

const { aspectRatings, getProduct } = sampleData;
const headphones = getProduct("aura-wireless-headphones")!;
const product = { name: headphones.name, image: headphones.images[0]! };
const submit = () => new Promise<void>((r) => setTimeout(r, 900));

function OpenDialog({ defaultRating, showErrors }: { defaultRating?: number; showErrors?: boolean }) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (!showErrors) return;
    // Submitting the empty form shows the per-field errors.
    const t = setTimeout(() => document.querySelector<HTMLButtonElement>("[role=dialog] button[type=submit]")?.click(), 100);
    return () => clearTimeout(t);
  }, [showErrors]);
  return (
    <WriteReviewDialog
      product={product}
      aspects={aspectRatings.map((a) => a.label)}
      open={open}
      onOpenChange={setOpen}
      defaultRating={defaultRating}
      onSubmit={submit}
    />
  );
}

export const Empty = () => <OpenDialog />;

export const RatingChosen = () => <OpenDialog defaultRating={4} />;

export const ValidationErrors = () => <OpenDialog showErrors />;
