import { Field, RatingInput } from "@bluesigns/ui";

export const ReviewForm = () => (
  <Field label="How would you rate the Aura Wireless Headphones?" required>
    <RatingInput defaultValue={4} />
  </Field>
);

export const Sizes = () => (
  <div className="flex flex-col items-start gap-3">
    <RatingInput aria-label="Delivery rating" size="md" defaultValue={4} />
    <RatingInput aria-label="Product rating" size="lg" defaultValue={3} />
    <RatingInput aria-label="Packaging rating" size="xl" defaultValue={5} showLabel={false} />
  </div>
);

export const States = () => (
  <div className="flex flex-col items-start gap-4">
    <RatingInput aria-label="Unrated" />
    <Field label="Seller rating" error="Pick a rating to submit your review">
      <RatingInput aria-label="Seller rating" size="md" />
    </Field>
    <RatingInput aria-label="Disabled rating" size="md" defaultValue={3} disabled />
  </div>
);

export const CustomLabels = () => (
  <RatingInput
    aria-label="Fit"
    size="md"
    defaultValue={3}
    labels={["Very small", "Runs small", "True to size", "Runs large", "Very large"]}
  />
);
