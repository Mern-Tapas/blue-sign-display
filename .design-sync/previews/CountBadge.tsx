import { CountBadge, IconButton, icons } from "@bluesigns/ui";

const { ShoppingBag, Bell } = icons;

export const Tones = () => (
  <div className="flex items-center gap-3">
    <CountBadge count={3} />
    <CountBadge count={12} tone="accent" />
    <CountBadge count={128} tone="inverse" />
    <CountBadge count={2} tone="danger" />
  </div>
);

export const Sizes = () => (
  <div className="flex items-center gap-3">
    <CountBadge count={4} tone="accent" size="sm" />
    <CountBadge count={4} tone="accent" size="md" />
    <CountBadge count={24} tone="accent" size="sm" />
    <CountBadge count={24} tone="accent" size="md" />
  </div>
);

export const InLabels = () => (
  <div className="flex flex-col items-start gap-3">
    <span className="inline-flex items-center gap-2 text-label">
      Orders
      <CountBadge count={7} />
    </span>
    <span className="inline-flex items-center gap-2 text-label">
      Filters
      <CountBadge count={3} tone="accent" size="sm" />
    </span>
  </div>
);

export const OnIconButtons = () => (
  <div className="flex items-center gap-4">
    <span className="relative inline-flex">
      <IconButton label="Bag, 2 items" variant="ghost">
        <ShoppingBag aria-hidden />
      </IconButton>
      <CountBadge count={2} tone="accent" size="sm" className="absolute top-0 right-0" />
    </span>
    <span className="relative inline-flex">
      <IconButton label="Notifications, 5 unread" variant="ghost">
        <Bell aria-hidden />
      </IconButton>
      <CountBadge count={5} tone="danger" size="sm" className="absolute top-0 right-0" />
    </span>
  </div>
);
