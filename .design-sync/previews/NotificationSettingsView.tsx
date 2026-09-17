import { NotificationSettingsView } from "@bluesigns/ui";

export const Desktop = () => (
  <div style={{ maxWidth: 820 }}>
    <NotificationSettingsView />
  </div>
);

export const WithPageHeading = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 820 }}>
    <div className="flex flex-col gap-1">
      <h1 className="text-heading-lg">Notification settings</h1>
      <p className="text-body text-fg-muted">Choose how we reach you for each kind of update.</p>
    </div>
    <NotificationSettingsView />
  </div>
);
