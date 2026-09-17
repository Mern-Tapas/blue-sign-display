import { cn } from "@/lib/cn";
import { FormSection } from "@/components/ui/form-section";
import { StatusDot, type StatusTone } from "@/components/ui/status-dot";

/* ---------------------------------------------------------------- StatusPill */

export type StatusPillProps = {
  tone: StatusTone;
  label: string;
  /** Pulsing dot for live states (out for delivery, processing). */
  live?: boolean;
  className?: string;
};

/** Dot + words; the dot never carries the meaning alone. */
export function StatusPill({ tone, label, live = false, className }: StatusPillProps) {
  return (
    <StatusDot data-slot="status-pill" tone={tone} pulse={live} pill className={cn("h-6 whitespace-nowrap px-2.5 text-caption-strong", className)}>
      {label}
    </StatusDot>
  );
}

/* ---------------------------------------------------------------- ActivityFeed */

export type ActivityItem = {
  id: string;
  /** Who did it: "Priya (ops)", "System", "Razorpay". */
  actor: string;
  /** What happened, phrased as a sentence fragment: "marked LM-100482 as shipped". */
  action: React.ReactNode;
  /** ISO timestamp. */
  at: string;
  icon?: React.ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
};

const toneClass = {
  neutral: "bg-surface-sunken text-fg-muted",
  accent: "bg-accent-soft text-accent-soft-fg",
  success: "bg-success-soft text-success-fg",
  warning: "bg-warning-soft text-warning-fg",
  danger: "bg-danger-soft text-danger-fg",
};

/** Audit trail / recent activity: a vertical rail of events with actor, action and time. */
export function ActivityFeed({ items, className, formatTime }: { items: ActivityItem[]; className?: string; formatTime: (iso: string) => string }) {
  return (
    <ol data-slot="activity-feed" className={cn("flex flex-col", className)}>
      {items.map((it, i) => (
        <li key={it.id} className="relative flex gap-3 pb-5 last:pb-0">
          {i < items.length - 1 && <span aria-hidden className="absolute top-8 bottom-0 left-3.5 w-px bg-border-subtle" />}
          <span aria-hidden className={cn("relative flex size-7 shrink-0 items-center justify-center rounded-pill [&_svg]:size-icon-sm", toneClass[it.tone ?? "neutral"])}>
            {it.icon ?? <span className="size-1.5 rounded-pill bg-current" />}
          </span>
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-body">
              <span className="text-body-strong">{it.actor}</span> {it.action}
            </p>
            <time dateTime={it.at} className="text-caption text-fg-muted figures">
              {formatTime(it.at)}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------------------------------------------------------------- SettingsSection */

export type SettingsSectionProps = {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

/**
 * Settings row: explanation on the left from lg, controls in a card on the right.
 *
 * A thin wrapper over the shared `FormSection` (`layout="split"`), kept so the settings
 * screens keep their import and their props.
 */
export function SettingsSection({ title, description, children, className }: SettingsSectionProps) {
  return (
    <FormSection title={title} description={description} layout="split" className={className}>
      {children}
    </FormSection>
  );
}
