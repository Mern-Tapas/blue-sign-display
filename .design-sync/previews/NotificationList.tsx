import { NotificationList, sampleData } from "@bluesigns/ui";

// Shift the demo notifications so they are relative to the viewer's clock (Today / Yesterday / Earlier).
const anchor = Date.parse("2026-09-15T06:00:00Z");
// sampleData bodies carry a double-encoded rupee sign; normalise it for display.
const rupee = (s: string) => s.replaceAll("â‚¹", "₹");
const recent = sampleData.notifications.map((n) => ({ ...n, body: rupee(n.body), date: new Date(Date.now() - (anchor - Date.parse(n.date))).toISOString() }));

export const Grouped = () => (
  <div style={{ maxWidth: 480 }}>
    <NotificationList notifications={recent} />
  </div>
);

export const CompactLatestThree = () => (
  <div style={{ maxWidth: 380 }}>
    <NotificationList notifications={recent} grouped={false} compact max={3} />
  </div>
);

export const Empty = () => (
  <div style={{ maxWidth: 480 }}>
    <NotificationList notifications={[]} />
  </div>
);

export const EmptyCustomCopy = () => (
  <div style={{ maxWidth: 480 }}>
    <NotificationList notifications={[]} emptyTitle="No order updates yet" emptyDescription="We’ll let you know when your order ships." />
  </div>
);
