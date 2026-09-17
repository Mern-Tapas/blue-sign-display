import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type StepStatus = "complete" | "current" | "upcoming" | "error";

export type StepItem = {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Trailing detail — a timestamp or location. */
  meta?: React.ReactNode;
  /** Overrides the status derived from `current` (e.g. "error" for a failed payment). */
  status?: StepStatus;
  icon?: React.ReactNode;
};

export type StepsProps = Omit<React.ComponentProps<"ol">, "children"> & {
  steps: StepItem[];
  /** Index of the current step; earlier steps are complete. Use steps.length for all done. */
  current: number;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md";
  /** Accessible name for the list, e.g. "Return progress". */
  "aria-label"?: string;
};

function statusFor(step: StepItem, i: number, current: number): StepStatus {
  if (step.status) return step.status;
  if (i < current) return "complete";
  if (i === current) return "current";
  return "upcoming";
}

const spoken: Record<StepStatus, string> = { complete: "completed", current: "current step", upcoming: "not started", error: "failed" };

/**
 * Generic progress steps (returns, KYC, onboarding, shipment scans). Server-safe and
 * display-only; each step's state is spelled out for screen readers, not just coloured.
 */
export function Steps({ steps, current, orientation = "horizontal", size = "md", className, ...props }: StepsProps) {
  const dot = size === "sm" ? "size-6 text-caption [&_svg]:size-3" : "size-8 text-label [&_svg]:size-4";
  const vertical = orientation === "vertical";

  return (
    <ol
      data-slot="steps"
      data-orientation={orientation}
      className={cn(vertical ? "flex flex-col" : "flex w-full items-start", className)}
      {...props}
    >
      {steps.map((step, i) => {
        const status = statusFor(step, i, current);
        const last = i === steps.length - 1;
        const nextStatus = last ? null : statusFor(steps[i + 1]!, i + 1, current);
        const connectorDone = status === "complete" && nextStatus !== "upcoming";
        const connectorHalf = status === "complete" && nextStatus === "upcoming";

        const marker = (
          <span
            aria-hidden
            className={cn(
              "relative z-10 flex shrink-0 items-center justify-center rounded-pill font-medium figures transition-colors duration-(--dur-base)",
              dot,
              status === "complete" && "bg-accent text-fg-on-accent",
              status === "current" && "bg-surface text-accent-fg ring-2 ring-accent ring-inset",
              status === "upcoming" && "bg-surface-sunken text-fg-muted",
              status === "error" && "bg-danger text-fg-on-danger",
            )}
          >
            {status === "complete" ? (step.icon ?? <Check strokeWidth={3} />) : status === "error" ? <X strokeWidth={3} /> : (step.icon ?? i + 1)}
          </span>
        );

        const connector = !last && (
          <span
            aria-hidden
            className={cn(
              "absolute rounded-pill bg-border",
              vertical
                ? cn("top-0 bottom-0 w-0.5", size === "sm" ? "left-[11px]" : "left-[15px]")
                : cn("right-0 left-0 h-0.5", size === "sm" ? "top-[11px]" : "top-[15px]"),
            )}
          >
            <span
              className={cn(
                "absolute rounded-pill bg-accent transition-[width,height] duration-(--dur-slow) ease-out",
                vertical ? "inset-x-0 top-0" : "inset-y-0 left-0",
                connectorDone ? (vertical ? "h-full" : "w-full") : connectorHalf ? (vertical ? "h-1/2" : "w-1/2") : vertical ? "h-0" : "w-0",
              )}
            />
          </span>
        );

        const text = (
          <span className={cn("flex min-w-0 flex-col gap-0.5", !vertical && "items-center px-1 text-center")}>
            <span
              className={cn(
                size === "sm" ? "text-label" : "text-body-strong",
                status === "upcoming" ? "text-fg-muted" : status === "error" ? "text-danger-fg" : "text-fg",
              )}
            >
              {step.label}
              <span className="sr-only"> — {spoken[status]}</span>
            </span>
            {step.description && <span className="text-caption text-fg-muted">{step.description}</span>}
            {step.meta && <span className="text-caption text-fg-muted figures">{step.meta}</span>}
          </span>
        );

        return vertical ? (
          <li key={step.id} aria-current={status === "current" ? "step" : undefined} className={cn("relative flex gap-3", !last && "pb-6")}>
            <span className="relative flex flex-col items-center">{marker}</span>
            {!last && <span className={cn("absolute top-0 bottom-0", size === "sm" ? "left-0 w-6" : "left-0 w-8")}>{connector}</span>}
            <span className={cn("pt-0.5", size === "md" && "pt-1")}>{text}</span>
          </li>
        ) : (
          <li key={step.id} aria-current={status === "current" ? "step" : undefined} className="relative flex min-w-0 flex-1 flex-col items-center gap-2">
            {!last && <span className="absolute top-0 left-1/2 h-8 w-full">{connector}</span>}
            {marker}
            {text}
          </li>
        );
      })}
    </ol>
  );
}
