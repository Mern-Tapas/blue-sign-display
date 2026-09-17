import { CountdownTimer } from "@bluesigns/ui";

// Deadlines relative to load; a real countdown must match a real end time.
const base = Date.now();

export const Blocks = () => <CountdownTimer endsAt={base + 5 * 3600e3 + 42 * 60e3} />;

export const Tones = () => (
  <div className="flex flex-col items-start gap-3">
    <CountdownTimer endsAt={base + 2 * 86400e3 + 3 * 3600e3} tone="contrast" size="lg" showSeconds={false} />
    <CountdownTimer endsAt={base + 9 * 3600e3} tone="accent" />
    <div className="rounded-lg bg-accent p-3">
      <CountdownTimer endsAt={base + 47 * 60e3} tone="on-color" size="sm" />
    </div>
  </div>
);

export const Inline = () => (
  <div className="flex flex-col items-start gap-2">
    <CountdownTimer variant="inline" endsAt={base + 3 * 3600e3 + 12 * 60e3} className="text-danger-fg" label="Deal ends in" />
    <CountdownTimer variant="inline" endsAt={base + 26 * 3600e3} label="Sale ends in" />
  </div>
);

export const Expired = () => (
  <CountdownTimer variant="inline" endsAt={base - 60e3} label="Deal ends in" expiredText="This deal has ended" />
);
