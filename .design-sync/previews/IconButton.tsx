import { IconButton, icons } from "@bluesigns/ui";

const { Heart, ShoppingBag, Bell, X, Plus, Search, Share2, Trash2 } = icons;

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-3">
    <IconButton label="Add to wishlist">
      <Heart aria-hidden />
    </IconButton>
    <IconButton label="Search" variant="sunken">
      <Search aria-hidden />
    </IconButton>
    <IconButton label="Close" variant="ghost">
      <X aria-hidden />
    </IconButton>
    <IconButton label="Add to bag" variant="primary">
      <ShoppingBag aria-hidden />
    </IconButton>
    <IconButton label="Add address" variant="neutral">
      <Plus aria-hidden />
    </IconButton>
    <IconButton label="Share" variant="soft">
      <Share2 aria-hidden />
    </IconButton>
  </div>
);

export const Sizes = () => (
  <div className="flex items-center gap-3">
    <IconButton label="Remove, extra small" size="xs">
      <Trash2 aria-hidden />
    </IconButton>
    <IconButton label="Remove, small" size="sm">
      <Trash2 aria-hidden />
    </IconButton>
    <IconButton label="Remove, medium" size="md">
      <Trash2 aria-hidden />
    </IconButton>
    <IconButton label="Remove, large" size="lg">
      <Trash2 aria-hidden />
    </IconButton>
  </div>
);

export const WithBadge = () => (
  <div className="flex items-center gap-4">
    <IconButton label="Bag, 3 items" variant="ghost" badge={3}>
      <ShoppingBag aria-hidden />
    </IconButton>
    <IconButton label="Notifications, unread" variant="ghost" badge>
      <Bell aria-hidden />
    </IconButton>
    <IconButton label="Wishlist, 12 items" badge={12}>
      <Heart aria-hidden />
    </IconButton>
  </div>
);

export const States = () => (
  <div className="flex items-center gap-3">
    <IconButton label="Add to wishlist" disabled>
      <Heart aria-hidden />
    </IconButton>
    <IconButton label="Add to bag" variant="primary" disabled>
      <ShoppingBag aria-hidden />
    </IconButton>
    <div className="rounded-lg bg-surface-contrast p-2">
      <IconButton label="Close banner" variant="contrast">
        <X aria-hidden />
      </IconButton>
    </div>
  </div>
);
