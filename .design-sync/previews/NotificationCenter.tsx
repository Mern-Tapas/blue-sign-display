import { NotificationCenter, sampleData } from "@bluesigns/ui";

// Shift the demo notifications so they are relative to the viewer's clock (Today / Yesterday / Earlier).
const anchor = Date.parse("2026-09-15T06:00:00Z");
// sampleData bodies carry a double-encoded rupee sign; normalise it for display.
const rupee = (s: string) => s.replaceAll("â‚¹", "₹");
const recent = sampleData.notifications.map((n) => ({ ...n, body: rupee(n.body), date: new Date(Date.now() - (anchor - Date.parse(n.date))).toISOString() }));

export const NotificationsPage = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 760 }}>
    <h1 className="text-heading-lg">Notifications</h1>
    <NotificationCenter notifications={recent} />
  </div>
);

export const AllCaughtUp = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 760 }}>
    <h1 className="text-heading-lg">Notifications</h1>
    <NotificationCenter notifications={[]} />
  </div>
);
