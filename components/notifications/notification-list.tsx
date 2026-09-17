"use client";

import { BellOff } from "lucide-react";
import { notificationState, useNotificationState } from "@/components/providers/notifications-store";
import { toast } from "@/components/providers/toast-store";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";
import type { AppNotification } from "@/lib/data/types";
import { useNow } from "@/lib/use-now";
import { NotificationItem } from "./notification-item";

/** Applies this device's read / unread / deleted overrides to the server list. */
export function useResolvedNotifications(list: AppNotification[]) {
  const s = useNotificationState();
  return list
    .filter((n) => !s.deleted.includes(n.id))
    .map((n) => ({ ...n, read: s.unread.includes(n.id) ? false : s.read.includes(n.id) ? true : n.read }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export type NotificationListProps = {
  notifications: AppNotification[];
  /** Group under Today / Yesterday / Earlier. */
  grouped?: boolean;
  compact?: boolean;
  max?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  onItemOpen?: () => void;
  className?: string;
};

/** Notifications newest first, optionally grouped by day, with per-item read state and delete (Undo). */
export function NotificationList({ notifications, grouped = true, compact = false, max, emptyTitle = "You’re all caught up", emptyDescription = "Order updates, price drops and offers will show up here.", onItemOpen, className }: NotificationListProps) {
  const items = useResolvedNotifications(notifications).slice(0, max);
  const now = useNow();

  if (items.length === 0) {
    return <EmptyState compact icon={<BellOff aria-hidden />} title={emptyTitle} description={emptyDescription} className={className} />;
  }

  const groupOf = (iso: string) => {
    if (now === null) return "Recent";
    const d = new Date(iso);
    const today = new Date(now);
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    if (d.getTime() >= start) return "Today";
    if (d.getTime() >= start - 86400000) return "Yesterday";
    return "Earlier";
  };
  const groups = grouped ? [...new Set(items.map((n) => groupOf(n.date)))].map((g) => ({ label: g, items: items.filter((n) => groupOf(n.date) === g) })) : [{ label: "", items }];

  return (
    <div data-slot="notification-list" className={cn("flex flex-col gap-4", className)}>
      {groups.map((g) => (
        <section key={g.label || "all"} aria-label={g.label || "Notifications"} className="flex flex-col gap-1">
          {g.label && <h3 className="px-3 text-caption text-fg-muted">{g.label}</h3>}
          <ul className="flex flex-col gap-1">
            {g.items.map((n) => (
              <li key={n.id}>
                <NotificationItem
                  notification={n}
                  now={now}
                  compact={compact}
                  onOpen={() => {
                    notificationState.markRead([n.id]);
                    onItemOpen?.();
                  }}
                  onToggleRead={() => (n.read ? notificationState.markUnread(n.id) : notificationState.markRead([n.id]))}
                  onDelete={() => {
                    notificationState.remove(n.id);
                    toast({ title: "Notification deleted", action: { label: "Undo", onClick: () => notificationState.restore(n.id) } });
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
