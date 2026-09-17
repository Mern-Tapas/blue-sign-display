"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { notificationState } from "@/components/providers/notifications-store";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TextButton } from "@/components/ui/text-button";
import type { AppNotification } from "@/lib/data/types";
import { NotificationList, useResolvedNotifications } from "./notification-list";

export type NotificationBellProps = {
  notifications: AppNotification[];
  viewAllHref?: string;
  max?: number;
  className?: string;
};

/** Header bell with the unread count; opens the latest notifications with Mark all as read and View all. */
export function NotificationBell({ notifications, viewAllHref = "/account/notifications", max = 5, className }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const resolved = useResolvedNotifications(notifications);
  const unread = resolved.filter((n) => !n.read);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <IconButton label={unread.length ? `Notifications, ${unread.length} unread` : "Notifications"} variant="secondary" badge={unread.length} className={className}>
          <Bell aria-hidden />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent align="end" className="flex w-[min(24rem,calc(100vw-2rem))] flex-col p-0" aria-label="Notifications">
        <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-3">
          <p className="text-title">Notifications</p>
          <TextButton disabled={unread.length === 0} onClick={() => notificationState.markRead(unread.map((n) => n.id))}>
            Mark all as read
          </TextButton>
        </div>
        <div className="max-h-[min(28rem,70dvh)] overflow-y-auto p-2">
          <NotificationList notifications={notifications} max={max} grouped={false} compact onItemOpen={() => setOpen(false)} />
        </div>
        <div className="border-t border-border-subtle p-2">
          <Button asChild variant="ghost" fullWidth onClick={() => setOpen(false)}>
            <Link href={viewAllHref}>View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
