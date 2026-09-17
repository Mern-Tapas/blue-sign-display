import { ActivityFeed, icons, sampleData } from "@bluesigns/ui";

const { PackageCheck, RotateCcw, Truck } = icons;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Deterministic "Today, 11:02 am" / "12 Sep" formatter relative to the demo date. */
const formatTime = (iso: string) => {
  const d = new Date(iso);
  const today = sampleData.ADMIN_TODAY;
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const time = `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() < 12 ? "am" : "pm"}`;
  if (d.getTime() >= start) return `Today, ${time}`;
  if (d.getTime() >= start - 86400000) return `Yesterday, ${time}`;
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

export const AuditTrail = () => (
  <div style={{ maxWidth: 560 }}>
    <ActivityFeed items={sampleData.auditLog.slice(0, 5)} formatTime={formatTime} />
  </div>
);

export const WithIcons = () => (
  <div style={{ maxWidth: 560 }}>
    <ActivityFeed
      formatTime={formatTime}
      items={[
        { id: "e1", actor: "Priya Nair", action: "packed LM-200599 (2 items)", at: "2026-09-15T11:20:00", tone: "success", icon: <PackageCheck /> },
        { id: "e2", actor: "Delhivery", action: "picked up LM-200594 from the Bengaluru warehouse", at: "2026-09-15T09:05:00", tone: "accent", icon: <Truck /> },
        { id: "e3", actor: "Kavya Rao", action: "requested a return for Velocity Runner (size too small)", at: "2026-09-14T18:40:00", tone: "warning", icon: <RotateCcw /> },
      ]}
    />
  </div>
);
