import { BadgePercent } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { BagTotals } from "@/lib/pricing";

export type PriceDetailsProps = {
  totals: BagTotals;
  /** Shown in the coupon row when no coupon is applied (e.g. an "Apply coupon" button). */
  couponAction?: React.ReactNode;
  /** Card with heading (bag, checkout) or bare rows (drawers, dialogs). */
  variant?: "card" | "plain";
  title?: string;
  /** Hide fee rows that are zero (compact summaries). */
  compact?: boolean;
  id?: string;
  className?: string;
};

function Row({ label, value, tone, hint }: { label: React.ReactNode; value: React.ReactNode; tone?: "success"; hint?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-fg-muted">
        {label}
        {hint && <span className="block text-caption">{hint}</span>}
      </dt>
      <dd className={cn("text-right figures", tone === "success" ? "text-success-fg" : "text-fg")}>{value}</dd>
    </div>
  );
}

/**
 * "Price details (3 items)": total MRP, discount on MRP, coupon, platform and delivery fees,
 * optional gift wrap / express / COD, total amount and a "You save" line. Every fee is listed
 * before payment — nothing appears later. Server-safe.
 */
export function PriceDetails({ totals: t, couponAction, variant = "card", title = "Price details", compact = false, id, className }: PriceDetailsProps) {
  const rows = (
    <dl className="flex flex-col gap-2.5 text-body">
      <Row label="Total MRP" value={formatPrice(t.mrp)} />
      {(t.mrpDiscount > 0 || !compact) && <Row label="Discount on MRP" value={t.mrpDiscount > 0 ? `−${formatPrice(t.mrpDiscount)}` : formatPrice(0)} tone={t.mrpDiscount > 0 ? "success" : undefined} />}
      {t.couponDiscount > 0 ? (
        <Row label={`Coupon (${t.couponCode})`} value={`−${formatPrice(t.couponDiscount)}`} tone="success" />
      ) : (
        !compact && <Row label="Coupon discount" value={couponAction ?? <span className="text-fg-muted">—</span>} />
      )}
      {t.platformFee > 0 && <Row label="Platform fee" value={formatPrice(t.platformFee)} />}
      <Row
        label="Delivery fee"
        value={
          t.delivery > 0 ? (
            formatPrice(t.delivery)
          ) : t.deliveryWaived > 0 ? (
            <span>
              <s className="mr-1.5 text-fg-muted">{formatPrice(t.deliveryWaived)}</s>
              <span className="text-success-fg">FREE</span>
            </span>
          ) : (
            <span className="text-fg-muted">—</span>
          )
        }
      />
      {t.express > 0 && <Row label="Express delivery" value={formatPrice(t.express)} />}
      {t.giftWrap > 0 && <Row label="Gift wrap" value={formatPrice(t.giftWrap)} />}
      {t.cod > 0 && <Row label="Cash on Delivery fee" value={formatPrice(t.cod)} />}
      <Divider className="my-1" />
      <div className="flex items-baseline justify-between gap-4">
        <dt className="text-body-lg font-medium">Total amount</dt>
        <dd className="text-heading-md figures">{formatPrice(t.total)}</dd>
      </div>
    </dl>
  );

  const save = t.savings > 0 && (
    <Alert size="sm" tone="success" role="note" icon={<BadgePercent aria-hidden />} className="figures">
      You save {formatPrice(t.savings)} on this order
    </Alert>
  );

  if (variant === "plain") {
    return (
      <div data-slot="price-details" id={id} className={cn("flex flex-col gap-3", className)}>
        {rows}
        {save}
      </div>
    );
  }

  return (
    <Card asChild className={className}>
      <section data-slot="price-details" id={id} aria-labelledby={id ? `${id}-title` : undefined}>
        <h2 id={id ? `${id}-title` : undefined} className="text-title">
          {title} <span className="font-normal text-fg-muted figures">({t.itemCount} {t.itemCount === 1 ? "item" : "items"})</span>
        </h2>
        {rows}
        {save}
        <p className="text-caption text-fg-muted">Prices are inclusive of all taxes.</p>
      </section>
    </Card>
  );
}
