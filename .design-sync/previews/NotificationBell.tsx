import { BrandMark, IconButton, NotificationBell, icons, sampleData } from "@bluesigns/ui";

const { ShoppingBag, Heart } = icons;
const { notifications } = sampleData;

export const InHeader = () => (
  <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface px-4 py-3 shadow-card" style={{ maxWidth: 560 }}>
    <BrandMark />
    <div className="flex items-center gap-2">
      <IconButton label="Wishlist" variant="secondary">
        <Heart aria-hidden />
      </IconButton>
      <NotificationBell notifications={notifications} />
      <IconButton label="Bag, 3 items" variant="secondary" badge={3}>
        <ShoppingBag aria-hidden />
      </IconButton>
    </div>
  </div>
);

export const UnreadCount = () => <NotificationBell notifications={notifications} />;

export const NothingUnread = () => <NotificationBell notifications={notifications.map((n) => ({ ...n, read: true }))} />;
