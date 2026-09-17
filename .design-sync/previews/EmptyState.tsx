import { Button, EmptyState, icons } from "@bluesigns/ui";

const { ShoppingBag, PackageSearch, Heart, Bell } = icons;

export const EmptyCart = () => (
  <div style={{ maxWidth: 480 }}>
    <EmptyState
      icon={<ShoppingBag aria-hidden />}
      title="Your cart is empty"
      description="Looks like you haven’t added anything yet. Start with our best sellers."
      action={<Button>Start shopping</Button>}
    />
  </div>
);

export const Compact = () => (
  <div style={{ maxWidth: 420 }}>
    <EmptyState
      compact
      icon={<PackageSearch aria-hidden />}
      title="No products match"
      description="Try removing a filter or widening the price range."
      action={
        <Button variant="secondary" size="sm">
          Clear all filters
        </Button>
      }
    />
  </div>
);

export const Wishlist = () => (
  <div style={{ maxWidth: 480 }}>
    <EmptyState
      icon={<Heart aria-hidden />}
      title="Save what you love"
      description="Tap the heart on any product to keep it here and get price-drop alerts."
      action={<Button variant="secondary">Explore trending</Button>}
    />
  </div>
);

export const NoAction = () => (
  <div style={{ maxWidth: 420 }}>
    <EmptyState compact icon={<Bell aria-hidden />} title="You’re all caught up" description="New order and offer updates will show up here." />
  </div>
);
