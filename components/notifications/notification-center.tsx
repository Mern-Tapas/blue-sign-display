"use client";

import Link from "next/link";
import { CheckCheck, Settings } from "lucide-react";
import { notificationState } from "@/components/providers/notifications-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/cn";
import type { AppNotification, NotificationType } from "@/lib/data/types";
import { NotificationList, useResolvedNotifications } from "./notification-list";

const tabs: { id: string; label: string; types?: NotificationType[] }[] = [
  { id: "all", label: "All" },
  { id: "orders", label: "Orders", types: ["order"] },
  { id: "offers", label: "Offers", types: ["offer", "price-drop", "back-in-stock"] },
  { id: "account", label: "Account", types: ["account"] },
];

export type NotificationCenterProps = {
  notifications: AppNotification[];
  settingsHref?: string;
  className?: string;
};

/** Full notifications page: tabs by kind with unread counts, Mark all as read, grouped list and a link to notification settings. */
export function NotificationCenter({ notifications, settingsHref = "/account/notification-settings", className }: NotificationCenterProps) {
  const resolved = useResolvedNotifications(notifications);
  const unread = resolved.filter((n) => !n.read);

  return (
    <section data-slot="notification-center" aria-label="Notifications" className={cn("flex flex-col gap-4", className)}>
      <Tabs defaultValue="all">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            {tabs.map((t) => {
              const count = unread.filter((n) => !t.types || t.types.includes(n.type)).length;
              return (
                <TabsTrigger key={t.id} value={t.id} count={count || undefined}>
                  {t.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" leadingIcon={<CheckCheck aria-hidden />} disabled={unread.length === 0} onClick={() => notificationState.markRead(unread.map((n) => n.id))}>
              Mark all as read
            </Button>
            <Button asChild variant="ghost" size="sm" leadingIcon={<Settings aria-hidden />}>
              <Link href={settingsHref}>Settings</Link>
            </Button>
          </div>
        </div>
        {tabs.map((t) => (
          <TabsContent key={t.id} value={t.id}>
            <Card variant="outline" padding="none" className="p-2 sm:p-3">
              <NotificationList
                notifications={t.types ? notifications.filter((n) => t.types!.includes(n.type)) : notifications}
                emptyTitle={t.id === "all" ? undefined : `No ${t.label.toLowerCase()} notifications`}
              />
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
