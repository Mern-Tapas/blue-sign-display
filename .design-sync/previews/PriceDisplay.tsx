import { PriceDisplay } from "@bluesigns/ui";

export const ProductPage = () => <PriceDisplay amount={12999} compareAt={16999} size="xl" showDiscount mrpLabel taxNote />;

export const Sizes = () => (
  <div className="flex flex-col items-start gap-3">
    <PriceDisplay amount={1499} compareAt={1999} size="sm" showDiscount />
    <PriceDisplay amount={1499} compareAt={1999} size="md" showDiscount />
    <PriceDisplay amount={1499} compareAt={1999} size="lg" showDiscount />
    <PriceDisplay amount={1499} compareAt={1999} size="xl" showDiscount />
    <PriceDisplay amount={42805} size="2xl" />
  </div>
);

export const DiscountStyles = () => (
  <div className="flex flex-col items-start gap-3">
    <PriceDisplay amount={3499} compareAt={4999} showDiscount />
    <PriceDisplay amount={3499} compareAt={4999} showDiscount discountStyle="pill" />
    <PriceDisplay amount={3499} compareAt={4999} />
  </div>
);

export const Plain = () => (
  <div className="flex flex-col items-start gap-3">
    <PriceDisplay amount={899} />
    <PriceDisplay amount={249.5} size="lg" />
    <PriceDisplay amount={249.5} size="lg" muteDecimals={false} />
  </div>
);
