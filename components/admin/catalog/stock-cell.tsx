import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { stockState } from "./catalog-data";

export type StockCellProps = {
  stock: number;
  reorderPoint: number;
  /** Words after a healthy count where the column header isn't visible (phone cards): "28 in stock". */
  suffix?: string;
  className?: string;
};

/** Units on hand. Out of stock and low stock say so in words; healthy stock is just the number. */
export function StockCell({ stock, reorderPoint, suffix, className }: StockCellProps) {
  const state = stockState(stock, reorderPoint);
  if (state === "out") {
    return (
      <Badge tone="danger" size="sm" className={className}>
        Out of stock
      </Badge>
    );
  }
  if (state === "low") {
    return (
      <Badge tone="warning" size="sm" className={cn("figures", className)}>
        <span aria-hidden>Low · {formatNumber(stock)}</span>
        <span className="sr-only">Low stock: {formatNumber(stock)} left</span>
      </Badge>
    );
  }
  return (
    <span className={cn("figures", className)}>
      {formatNumber(stock)}
      {suffix && ` ${suffix}`}
    </span>
  );
}
