import { Card, CardHeader } from "@/components/ui/card";
import { TrendChip } from "@/components/ui/trend-chip";
import { cn } from "@/lib/cn";

export type StatCardProps = {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  trend?: number;
  caption?: string;
  action?: React.ReactNode;
  variant?: "surface" | "accent" | "contrast";
  /** Optional footer slot — progress bar, avatar group, sparkline. */
  children?: React.ReactNode;
  className?: string;
};

/** KPI tile from the dashboards — big tabular figure, small trend chip, optional arrow action. */
export function StatCard({ label, value, icon, trend, caption, action, variant = "surface", children, className }: StatCardProps) {
  return (
    <Card variant={variant} className={cn("justify-between", className)}>
      <CardHeader title={<span className="text-body font-normal">{label}</span>} action={action} icon={icon} />
      <div className="flex flex-col gap-2">
        <div className="text-figure-lg figures">{value}</div>
        {trend !== undefined && (
          <TrendChip value={trend} variant={variant === "surface" ? "soft" : "solid"} caption={caption} />
        )}
      </div>
      {children}
    </Card>
  );
}
