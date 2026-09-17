import { cn } from "@/lib/cn";

const tones = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  accent: "bg-accent",
  neutral: "bg-fg-subtle",
} as const;

export type StatusTone = keyof typeof tones;

export type StatusDotProps = React.ComponentProps<"span"> & {
  tone?: StatusTone;
  /** Pulsing halo for live / in-progress states. */
  pulse?: boolean;
  /** Render inside a subtle pill (as in the "Successful" table cells). */
  pill?: boolean;
};

export function StatusDot({ tone = "neutral", pulse, pill, className, children, ...props }: StatusDotProps) {
  return (
    <span
      data-slot="status-dot"
      className={cn(
        "inline-flex items-center gap-2 text-body text-fg",
        pill && "h-7 rounded-pill border border-border-subtle bg-surface px-3 text-label",
        className,
      )}
      {...props}
    >
      <span className="relative flex size-2 shrink-0">
        {pulse && <span className={cn("absolute inset-0 animate-ping rounded-pill opacity-60 motion-reduce:hidden", tones[tone])} />}
        <span className={cn("relative size-2 rounded-pill", tones[tone])} />
      </span>
      {children}
    </span>
  );
}
