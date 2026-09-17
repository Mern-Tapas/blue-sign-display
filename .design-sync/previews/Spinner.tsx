import { Button, Spinner } from "@bluesigns/ui";

export const Sizes = () => (
  <div className="flex items-center gap-4">
    <Spinner size="xs" />
    <Spinner size="sm" />
    <Spinner size="md" className="text-accent" />
    <Spinner size="lg" className="text-fg-muted" />
  </div>
);

export const InContext = () => (
  <div className="flex flex-wrap items-center gap-4">
    <Button loading variant="secondary">
      Loading
    </Button>
    <span className="flex items-center gap-2 text-label text-fg-muted">
      <Spinner size="sm" label="Checking delivery" /> Checking delivery to 560087…
    </span>
  </div>
);

export const Centered = () => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-surface p-8 shadow-flat" style={{ maxWidth: 360 }}>
    <Spinner size="lg" className="text-accent" label="Processing payment" />
    <p className="text-body text-fg-muted">Processing your UPI payment…</p>
  </div>
);
