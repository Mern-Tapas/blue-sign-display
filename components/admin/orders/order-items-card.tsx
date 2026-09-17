import { ProductImage } from "@/components/commerce/product-image";
import { Card, CardHeader } from "@/components/ui/card";
import type { AdminOrderLine } from "@/lib/data/admin";
import { formatNumber, formatPrice } from "@/lib/format";

/** Line items as the packer needs them: photo, name, SKU, size, quantity and line price. */
export function OrderItemsCard({ lines }: { lines: AdminOrderLine[] }) {
  const units = lines.reduce((s, l) => s + l.quantity, 0);
  return (
    <Card padding="md">
      <CardHeader title="Items" description={`${formatNumber(lines.length)} ${lines.length === 1 ? "product" : "products"} · ${formatNumber(units)} ${units === 1 ? "unit" : "units"}`} />
      <ul className="flex flex-col divide-y divide-border-subtle">
        {lines.map((l, i) => (
          <li key={`${l.sku}-${i}`} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 sm:items-center">
            <ProductImage src={l.image} alt="" sizes="56px" wrapperClassName="size-14 shrink-0 rounded-md" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-body-strong">{l.name}</p>
                <p className="text-code break-all text-fg-muted">{l.sku}</p>
              </div>
              <p className="flex flex-wrap gap-x-3 text-caption text-fg-muted figures sm:w-32 sm:justify-end">
                {l.size && <span>Size {l.size}</span>}
                <span>
                  {formatNumber(l.quantity)} × {formatPrice(l.price)}
                </span>
              </p>
            </div>
            <p className="w-24 shrink-0 text-right text-body-strong figures">{formatPrice(l.price * l.quantity)}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
