import { Coins, Info } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { Progress } from "@/components/ui/progress";
import { formatDate, formatNumber, formatPrice } from "@/lib/format";

export type RewardsCardProps = {
  points: number;
  pointValue: number;
  tier: string;
  nextTier?: string;
  nextTierAt?: number;
  expiringPoints?: number;
  expiringOn?: string;
  demo?: boolean;
  className?: string;
};

/** Points balance with its rupee value, tier progress, points about to expire and how to use them. Server-safe. */
export function RewardsCard({ points, pointValue, tier, nextTier, nextTierAt, expiringPoints, expiringOn, demo = false, className }: RewardsCardProps) {
  const toNext = nextTierAt ? Math.max(0, nextTierAt - points) : 0;
  return (
    <Card asChild className={className}>
      <section data-slot="rewards-card" aria-label="BlueSigns points">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <IconTile size="lg" tone="warning">
              <Coins />
            </IconTile>
            <div>
              <p className="text-caption text-fg-muted">BlueSigns points</p>
              <p className="text-figure-lg figures">{formatNumber(points)}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge tone="accent">{tier}</Badge>
            {demo && (
              <Badge tone="outline" size="sm">
                Demo
              </Badge>
            )}
          </div>
        </div>
        <p className="text-body text-fg-muted">
          Worth <span className="font-medium text-fg figures">{formatPrice(Math.floor(points * pointValue))}</span> off your next order.
        </p>
        {nextTier && nextTierAt && (
          <div className="flex flex-col gap-1.5">
            <Progress value={points} max={nextTierAt} track="hatch" aria-label={`Progress to ${nextTier}`} />
            <p className="text-caption text-fg-muted figures">{toNext > 0 ? `${formatNumber(toNext)} points to ${nextTier}` : `You’ve reached ${nextTier}`}</p>
          </div>
        )}
        {expiringPoints && expiringOn ? (
          <Alert size="sm" tone="warning" role="note" icon={<Info aria-hidden />} className="figures">
            {formatNumber(expiringPoints)} points expire on {formatDate(expiringOn)}
          </Alert>
        ) : null}
        <p className="text-caption text-fg-muted">Earn 1 point per ₹10 spent. Use points on the payment step; they can’t be exchanged for cash.</p>
      </section>
    </Card>
  );
}
