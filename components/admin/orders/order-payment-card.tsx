import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { DescriptionList, type DescriptionItem } from "@/components/ui/description-list";
import { Inset } from "@/components/ui/inset";
import type { AdminOrder } from "@/lib/data/admin";
import { formatNumber, formatPrice } from "@/lib/format";
import { COD_FEE, paymentBadge } from "./order-helpers";

/** Price breakdown exactly as charged, then how it was paid and where any refund stands. */
export function OrderPaymentCard({ order }: { order: AdminOrder }) {
  const units = order.lines.reduce((s, l) => s + l.quantity, 0);
  const badge = paymentBadge(order);
  const cod = order.payment === "COD";

  const breakdown: DescriptionItem[] = [
    { key: "subtotal", term: `Subtotal (${formatNumber(units)} ${units === 1 ? "unit" : "units"})`, description: formatPrice(order.subtotal) },
    ...(order.discount > 0
      ? [{ key: "discount", term: <span className="inline-flex flex-wrap items-baseline gap-1.5">Discount <span className="text-code text-fg">{order.coupon}</span></span>, description: <span className="text-success-fg">−{formatPrice(order.discount)}</span> }]
      : []),
    { key: "shipping", term: "Shipping", description: order.shipping === 0 ? "Free" : formatPrice(order.shipping) },
    ...(cod ? [{ key: "cod", term: "COD fee", description: formatPrice(COD_FEE) }] : []),
    { key: "total", term: "Total", description: formatPrice(order.total), emphasis: true },
  ];

  const refund =
    order.paymentStatus === "refunded"
      ? `${formatPrice(order.total)} refunded to the ${order.payment} source. Reaches the customer in 5–7 working days.`
      : cod && order.paymentStatus === "pending"
        ? `Courier collects ${formatPrice(order.total)} in cash on delivery. Remitted with your next settlement.`
        : order.paymentStatus === "pending"
          ? "No money captured yet."
          : "No refunds on this order.";

  return (
    <Card padding="md">
      <CardHeader title="Payment" description="Prices include GST" />
      <DescriptionList items={breakdown} />
      <Inset size="sm" className="flex flex-col gap-2">
        <DescriptionList
          size="sm"
          items={[
            { key: "mode", term: "Mode", description: cod ? "Cash on delivery" : order.payment },
            { key: "status", term: "Status", description: <Badge tone={badge.tone} size="sm">{badge.label}</Badge> },
          ]}
        />
        <p className="text-caption text-fg-muted">{refund}</p>
      </Inset>
    </Card>
  );
}
