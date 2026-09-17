import { cn } from "@/lib/cn";

const sizes = { xs: "size-3", sm: "size-4", md: "size-5", lg: "size-8" } as const;

export type SpinnerProps = React.ComponentProps<"svg"> & {
  size?: keyof typeof sizes;
  label?: string;
};

export function Spinner({ size = "sm", label = "Loading", className, ...props }: SpinnerProps) {
  return (
    <svg
      data-slot="spinner"
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label={label}
      className={cn("animate-spin text-current", sizes[size], className)}
      {...props}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
