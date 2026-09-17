import { BrandMark } from "@bluesigns/ui";

export const Default = () => <BrandMark />;

export const MarkOnly = () => <BrandMark showName={false} />;

export const Inverted = () => (
  <div className="inline-flex rounded-xl bg-surface-contrast p-4">
    <BrandMark inverted />
  </div>
);
