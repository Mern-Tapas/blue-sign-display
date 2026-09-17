import { SettingsSubnav } from "@bluesigns/ui";

const sections = [
  { id: "store-profile", label: "Store profile" },
  { id: "shipping", label: "Shipping" },
  { id: "payments", label: "Payments" },
  { id: "taxes", label: "Taxes" },
  { id: "notifications", label: "Notifications" },
  { id: "staff", label: "Staff & roles" },
  { id: "danger-zone", label: "Danger zone" },
];

export const Default = () => (
  <div className="rounded-xl bg-surface p-4 shadow-flat" style={{ width: 320 }}>
    <SettingsSubnav sections={sections} />
  </div>
);

export const BesideSections = () => (
  <div className="grid grid-cols-3 gap-6 bg-canvas p-6" style={{ width: 900 }}>
    <SettingsSubnav sections={sections} />
    <div className="col-span-2 flex flex-col gap-4">
      {sections.slice(0, 3).map((s) => (
        <section key={s.id} id={s.id} className="flex flex-col gap-1 rounded-xl bg-surface p-5 shadow-flat">
          <h2 className="text-title">{s.label}</h2>
          <p className="text-body text-fg-muted">Settings for {s.label.toLowerCase()} appear here.</p>
        </section>
      ))}
    </div>
  </div>
);
