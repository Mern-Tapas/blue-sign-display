"use client";

import { useState } from "react";
import { NotificationItem } from "@/components/notifications/notification-item";
import { NotificationList } from "@/components/notifications/notification-list";
import { toast } from "@/components/providers/toast-store";
import { notifications } from "@/lib/data/notifications";
import { useNow } from "@/lib/use-now";

/** Unread, read and imageless items with local state, independent of the shared read-state store. */
export function NotificationItemStatesDemo() {
  const now = useNow();
  const [items, setItems] = useState(() => [notifications[0], notifications[2], notifications[4]]);
  return (
    <ul className="flex w-full max-w-md flex-col gap-1">
      {items.map((n) => (
        <li key={n.id}>
          <NotificationItem
            notification={{ ...n, href: undefined }}
            now={now}
            onToggleRead={() => setItems((list) => list.map((x) => (x.id === n.id ? { ...x, read: !x.read } : x)))}
            onDelete={() => {
              setItems((list) => list.filter((x) => x.id !== n.id));
              toast({ title: "Deleted in this preview only" });
            }}
          />
        </li>
      ))}
    </ul>
  );
}

export function EmptyNotificationsDemo() {
  return <NotificationList notifications={[]} className="w-full max-w-md" />;
}
