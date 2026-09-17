import { cva, type VariantProps } from "class-variance-authority";
import { Progress as ProgressPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";

const trackVariants = cva("relative w-full overflow-hidden rounded-pill", {
  variants: {
    size: { sm: "h-1.5", md: "h-2.5", lg: "h-4" },
    track: {
      plain: "bg-surface-sunken",
      hatch: "bg-hatch text-fg-subtle bg-surface-sunken",
    },
  },
  defaultVariants: { size: "md", track: "plain" },
});

const indicatorTones = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-fg",
} as const;

export type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> &
  VariantProps<typeof trackVariants> & {
    value: number;
    max?: number;
    tone?: keyof typeof indicatorTones;
  };

export function Progress({ value, max = 100, size, track, tone = "accent", className, ...props }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      max={max}
      className={cn(trackVariants({ size, track }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full rounded-pill transition-[width] duration-(--dur-slow) ease-out", indicatorTones[tone])}
        style={{ width: `${pct}%` }}
      />
    </ProgressPrimitive.Root>
  );
}
