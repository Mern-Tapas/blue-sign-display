import { Button, icons } from "@bluesigns/ui";

const { ArrowRight, ShoppingBag, Trash2 } = icons;

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button leadingIcon={<ShoppingBag aria-hidden />}>Add to cart</Button>
    <Button variant="neutral">Buy now</Button>
    <Button variant="secondary">Save for later</Button>
    <Button variant="soft">Apply coupon</Button>
    <Button variant="ghost">Cancel</Button>
    <Button variant="danger" leadingIcon={<Trash2 aria-hidden />}>
      Remove
    </Button>
    <Button variant="link">View details</Button>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
    <Button size="xl">Extra large</Button>
  </div>
);

export const States = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button loading>Placing order</Button>
    <Button disabled>Out of stock</Button>
    <Button variant="secondary" trailingIcon={<ArrowRight aria-hidden />}>
      Continue
    </Button>
  </div>
);

export const FullWidth = () => (
  <div className="flex max-w-md flex-col gap-3">
    <Button fullWidth size="lg">
      Place order · ₹21,596
    </Button>
    <Button fullWidth size="lg" variant="secondary">
      Continue shopping
    </Button>
  </div>
);
