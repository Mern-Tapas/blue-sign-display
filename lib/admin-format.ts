// Deterministic date/time formatting for admin screens (no locale-dependent Intl output that could differ
// between server and browser ICU builds).

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function adminDate(iso: string) {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function adminDateShort(iso: string) {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function adminDateTime(iso: string) {
  const d = new Date(iso);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${h % 12 || 12}:${m} ${h < 12 ? "am" : "pm"}`;
}

/** Relative to the demo "today" (pass ADMIN_TODAY): "Today, 11:02 am", "Yesterday, 5:00 pm", "12 Sep". */
export function adminRelative(iso: string, today: Date) {
  const d = new Date(iso);
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const time = `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() < 12 ? "am" : "pm"}`;
  if (d.getTime() >= start) return `Today, ${time}`;
  if (d.getTime() >= start - 86400000) return `Yesterday, ${time}`;
  return adminDateShort(iso);
}
