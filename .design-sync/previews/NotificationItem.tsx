import { useState } from "react";
import { NotificationItem, sampleData, toast } from "@bluesigns/ui";

const { notifications } = sampleData;
// A fixed "now" keeps the relative times stable ("3 h ago", "Yesterday").
const NOW = Date.parse("2026-09-15T05:15:00Z");
// sampleData bodies carry a double-encoded rupee sign; normalise it for display.
const rupee = (s: string) => s.replaceAll("â‚¹", "₹");

function Item({ index, compact }: { index: number; compact?: boolean }) {
  const source = notifications[index]!;
  const [n, setN] = useState({ ...source, body: rupee(source.body), href: undefined });
  return (
    <NotificationItem
      notification={n}
      now={NOW}
      compact={compact}
      onToggleRead={() => setN((x) => ({ ...x, read: !x.read }))}
      onDelete={() => toast({ title: "Notification deleted" })}
    />
  );
}

export const States = () => (
  <ul className="flex flex-col gap-1" style={{ maxWidth: 440 }}>
    <li>
      <Item index={0} />
    </li>
    <li>
      <Item index={1} />
    </li>
    <li>
      <Item index={2} />
    </li>
    <li>
      <Item index={4} />
    </li>
  </ul>
);

export const UnreadWithImage = () => (
  <div style={{ maxWidth: 440 }}>
    <Item index={0} />
  </div>
);

export const ReadIconOnly = () => (
  <div style={{ maxWidth: 440 }}>
    <Item index={4} />
  </div>
);

export const Compact = () => (
  <ul className="flex flex-col gap-1" style={{ maxWidth: 360 }}>
    <li>
      <Item index={1} compact />
    </li>
    <li>
      <Item index={3} compact />
    </li>
  </ul>
);
