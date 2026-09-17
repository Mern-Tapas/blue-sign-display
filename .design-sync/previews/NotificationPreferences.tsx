import { NotificationPreferences, sampleData, toast } from "@bluesigns/ui";

const { notificationCategories, defaultNotificationPrefs } = sampleData;
const save = async () => {
  await new Promise((r) => setTimeout(r, 700));
  toast({ title: "Notification settings saved", tone: "success" });
};

export const AllCategories = () => (
  <div style={{ maxWidth: 820 }}>
    <NotificationPreferences categories={notificationCategories} defaultValue={defaultNotificationPrefs} onSave={save} />
  </div>
);

export const EssentialsOnly = () => (
  <div style={{ maxWidth: 820 }}>
    <NotificationPreferences
      categories={notificationCategories.slice(0, 2)}
      defaultValue={{
        orders: { sms: true, email: false, whatsapp: true, push: false },
        account: { sms: false, email: true, whatsapp: false, push: false },
      }}
      onSave={save}
    />
  </div>
);
