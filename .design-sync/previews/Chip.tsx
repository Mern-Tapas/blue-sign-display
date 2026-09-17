import { Chip, icons } from "@bluesigns/ui";

const { Zap, Truck, Tag } = icons;

export const Toggle = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Chip selected icon={<Zap aria-hidden />}>
      Express delivery
    </Chip>
    <Chip selected={false} icon={<Truck aria-hidden />}>
      Free delivery
    </Chip>
    <Chip selected={false}>Under ₹999</Chip>
    <Chip selected>4★ &amp; above</Chip>
  </div>
);

export const Removable = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Chip variant="sunken" onRemove={() => {}}>
      Bluetooth 5.3
    </Chip>
    <Chip variant="sunken" onRemove={() => {}}>
      Noise cancelling
    </Chip>
    <Chip variant="sunken" onRemove={() => {}}>
      Under ₹10,000
    </Chip>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Chip size="xs" variant="sunken">
      Verified buyers
    </Chip>
    <Chip size="sm" icon={<Tag aria-hidden />}>
      Bank offers
    </Chip>
    <Chip size="md" count={96}>
      30% and above
    </Chip>
  </div>
);

export const States = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Chip>Action chip</Chip>
    <Chip selected>Selected</Chip>
    <Chip variant="sunken">Sunken</Chip>
    <Chip disabled>Out of stock</Chip>
  </div>
);
