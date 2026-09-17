import { cn } from "@/lib/cn";

export type EmptyStateProps = Omit<React.ComponentProps<"div">, "title"> & {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  compact?: boolean;
};

export function EmptyState({ icon, title, description, action, compact, className, ...props }: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "gap-2 px-4 py-8" : "gap-3 px-6 py-16",
        className,
      )}
      {...props}
    >
      {icon && (
        <span
          className={cn(
            "mb-1 flex items-center justify-center rounded-pill bg-surface-sunken text-fg-muted",
            compact ? "size-12 [&_svg]:size-5" : "size-16 [&_svg]:size-7",
          )}
        >
          {icon}
        </span>
      )}
      <p className={cn("font-medium text-fg", compact ? "text-body-lg" : "text-heading-sm")}>{title}</p>
      {description && <p className="max-w-sm text-body text-fg-muted">{description}</p>}
      {action && <div className="mt-2 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}
