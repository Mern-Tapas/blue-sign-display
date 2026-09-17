import type { Metadata } from "next";
import { EmptyNotificationsDemo, NotificationItemStatesDemo } from "@/components/docs/demos/notifications-demo";
import { DsGrid, DsPageHeader, DsPreview, DsProps, DsSection } from "@/components/docs/ds-section";
import { EnableNotificationsBanner } from "@/components/notifications/enable-notifications-banner";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { notifications } from "@/lib/data/notifications";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsDocsPage() {
  return (
    <>
      <DsPageHeader
        title="Notifications"
        muted="that earn attention"
        description="Order updates, price drops, back-in-stock alerts, offers and security notices. Read state and deletions live on this device and stay in sync between the bell and /account/notifications. All notifications here are demo content."
      />

      <DsSection title="Bell" description="The unread count sits in the badge and the accessible name. The popover shows the latest five, Mark all as read and View all; opening an item marks it read and closes the popover.">
        <DsPreview label="NotificationBell" className="justify-end">
          <NotificationBell notifications={notifications} />
        </DsPreview>
      </DsSection>

      <DsSection title="Item" description="Unread items get a tint, a dot and bold titles, plus 'unread' in the text for screen readers. Product notifications show the product; others show a type icon. The options menu stays visible on touch and appears on hover or focus with a mouse.">
        <DsGrid>
          <DsPreview label="Unread · read · account" className="block">
            <NotificationItemStatesDemo />
          </DsPreview>
          <DsPreview label="Empty" className="block">
            <EmptyNotificationsDemo />
          </DsPreview>
        </DsGrid>
      </DsSection>

      <DsSection title="Notification center" description="Tabs by kind with unread counts. Grouped into Today, Yesterday and Earlier once the clock is known on the client. Deleting shows an Undo toast.">
        <DsPreview label="NotificationCenter" surface="canvas" className="block">
          <NotificationCenter notifications={notifications} />
        </DsPreview>
      </DsSection>

      <DsSection title="Push opt-in" description="Ask only after saying what the shopper gets, never on page load. Hidden once granted, when unsupported or after Not now. When blocked, it explains how to allow notifications in site settings, because the browser won't ask again.">
        <DsPreview label="EnableNotificationsBanner" className="block">
          <EnableNotificationsBanner />
          <p className="text-caption text-fg-muted">Nothing shows if this browser has already allowed notifications, doesn’t support them, or you chose Not now.</p>
        </DsPreview>
      </DsSection>

      <DsSection title="Props">
        <DsProps
          component="NotificationBell · NotificationItem · NotificationList · NotificationCenter · EnableNotificationsBanner"
          rows={[
            { name: "notifications · viewAllHref · max", type: "NotificationBell", description: "Popover with the latest items; badge counts unread after local overrides." },
            { name: "notification · now · onOpen · onToggleRead · onDelete · compact", type: "NotificationItem", description: "Pass now from useNow() so relative times render only after hydration." },
            { name: "notifications · grouped · compact · max · emptyTitle · emptyDescription · onItemOpen", type: "NotificationList", description: "Applies useResolvedNotifications (read / unread / deleted per device)." },
            { name: "notifications · settingsHref", type: "NotificationCenter", description: "All, Orders, Offers and Account tabs." },
            { name: "benefit · onGranted", type: "EnableNotificationsBanner", description: "Calls Notification.requestPermission only from the button." },
          ]}
        />
      </DsSection>
    </>
  );
}
