import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export type CheckoutStep = { id: string; label: string; description?: string };

export type CheckoutStepperProps = {
  steps: CheckoutStep[];
  current: number;
  /** Makes completed steps clickable (button mode). */
  onStepClick?: (index: number) => void;
  className?: string;
};

/** Horizontal step indicator inside a floating pill track. */
export function CheckoutStepper({ steps, current, onStepClick, className }: CheckoutStepperProps) {
  return (
    <nav aria-label="Checkout progress" className={cn("w-full", className)}>
      <ol className="flex items-center gap-1 rounded-pill bg-surface p-1.5 shadow-flat">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          const clickable = done && onStepClick;
          const content = (
            <>
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-pill text-caption-strong transition-colors duration-(--dur-fast) figures",
                  done && "bg-accent text-fg-on-accent",
                  active && "bg-surface text-fg",
                  !done && !active && "bg-surface-sunken text-fg-muted",
                )}
              >
                {done ? <Check aria-hidden className="size-icon-sm" strokeWidth={3} /> : i + 1}
              </span>
              <span className={cn("truncate text-label", !active && "max-sm:sr-only")}>{step.label}</span>
            </>
          );
          return (
            <li key={step.id} className={cn("flex min-w-0 items-center", active ? "flex-[2]" : "flex-1")}>
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onStepClick(i)}
                  className="state-layer relative flex h-control-md w-full min-w-0 items-center gap-2.5 rounded-pill px-2 text-fg"
                >
                  {content}
                </button>
              ) : (
                <span
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "flex h-control-md w-full min-w-0 items-center gap-2.5 rounded-pill px-2 transition-colors duration-(--dur-fast)",
                    active ? "bg-surface-inverse text-fg-inverse" : "text-fg-muted",
                  )}
                >
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
