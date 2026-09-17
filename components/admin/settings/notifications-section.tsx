"use client";

import { Switch } from "@/components/ui/switch";
import { SettingsSection } from "../admin-display";
import { notificationEvents, type NotificationChannel, type SettingsSectionFormProps } from "./settings-data";

const channels: { id: NotificationChannel; label: string }[] = [
  { id: "email", label: "Email" },
  { id: "sms", label: "SMS" },
  { id: "whatsapp", label: "WhatsApp" },
];

/** Which customer messages go out on which channel. */
export function NotificationsSection({ draft, update }: SettingsSectionFormProps) {
  const toggle = (event: string, channel: NotificationChannel, on: boolean) =>
    update((d) => ({ ...d, notifications: { ...d.notifications, [event]: { ...d.notifications[event]!, [channel]: on } } }));

  return (
    <SettingsSection
      title="Notifications"
      description="Messages to shoppers about their orders. SMS uses your DLT-registered templates; WhatsApp only reaches shoppers who opted in at checkout."
    >
      <div className="-mx-(--card-pad) overflow-x-auto px-(--card-pad)">
        <table className="w-full min-w-[20rem] text-left text-body">
          <caption className="sr-only">Customer notifications by channel</caption>
          <thead>
            <tr className="border-b border-border-subtle">
              <th scope="col" className="h-row-sm pr-3 text-overline text-fg-muted">
                Event
              </th>
              {channels.map((c) => (
                <th key={c.id} scope="col" className="h-row-sm w-16 px-2 text-center text-overline text-fg-muted sm:w-24">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {notificationEvents.map((ev) => (
              <tr key={ev.id}>
                <th scope="row" className="py-3 pr-3 font-normal">
                  <span className="block text-body">{ev.label}</span>
                  <span className="block text-caption text-fg-muted max-sm:hidden">{ev.note}</span>
                </th>
                {channels.map((c) => (
                  <td key={c.id} className="px-2 text-center">
                    <Switch
                      size="sm"
                      aria-label={`${ev.label} by ${c.label}`}
                      checked={draft.notifications[ev.id]?.[c.id] ?? false}
                      onCheckedChange={(on) => toggle(ev.id, c.id, on)}
                      className="inline-flex"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SettingsSection>
  );
}
