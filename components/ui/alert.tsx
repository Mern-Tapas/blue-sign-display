import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert, CircleCheck, Info, Sparkles, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

const alertVariants = cva("relative flex w-full", {
  variants: {
    tone: {
      info: "bg-info-soft text-info-fg",
      success: "bg-success-soft text-success-fg",
      warning: "bg-warning-soft text-warning-fg",
      danger: "bg-danger-soft text-danger-fg",
      accent: "bg-accent-soft text-accent-soft-fg",
      neutral: "bg-surface text-fg shadow-flat",
    },
    size: {
      /** Inline note: price hints, delivery notes, one-line warnings. */
      sm: "gap-2 rounded-lg px-3 py-2 text-label [&_[data-slot=alert-icon]_svg]:size-icon-md",
      md: "gap-3 rounded-xl p-4 text-body [&_[data-slot=alert-icon]_svg]:size-icon-base",
    },
  },
  defaultVariants: { tone: "info", size: "md" },
});

const icons = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
  accent: Sparkles,
  neutral: Info,
} as const;

export type AlertProps = Omit<React.ComponentProps<"div">, "title"> &
  VariantProps<typeof alertVariants> & {
    title?: React.ReactNode;
    icon?: React.ReactNode | false;
    /** Right-aligned action slot (button / dismiss IconButton). */
    action?: React.ReactNode;
  };

export function Alert({ tone = "info", size = "md", title, icon, action, className, children, role, ...props }: AlertProps) {
  const Icon = icons[tone ?? "info"];
  return (
    <div
      data-slot="alert"
      role={role ?? (tone === "danger" || tone === "warning" ? "alert" : "status")}
      className={cn(alertVariants({ tone, size }), className)}
      {...props}
    >
      {icon !== false && (
        <span data-slot="alert-icon" className={cn("shrink-0", size === "sm" ? "mt-px" : "mt-px")}>
          {icon ?? <Icon aria-hidden />}
        </span>
      )}
      <div className="min-w-0 flex-1">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={cn(title && "mt-0.5")}>{children}</div>}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
}
