"use client";

import { DsGrid, DsPreview } from "@/components/docs/ds-section";
import { CancelOrderDialog } from "@/components/orders/cancel-order-dialog";
import { InvoiceDownloadButton } from "@/components/orders/invoice-download-button";
import { OrdersView } from "@/components/orders/orders-view";
import { RateProductPrompt } from "@/components/orders/rate-product-prompt";
import { ReturnExchangeFlow } from "@/components/orders/return-exchange-flow";
import { toast } from "@/components/providers/toast-store";
import { TextButton } from "@/components/ui/text-button";
import { getProduct } from "@/lib/data/products";
import { orders } from "@/lib/data/reviews";
import { orderLines } from "@/lib/orders";

const wait = (ms = 900) => new Promise((r) => setTimeout(r, ms));

export function OrdersListDemo() {
  return <OrdersView orders={orders} detailsHref={() => "/design-system/orders#order-details"} />;
}

export function OrderActionsDemo() {
  const multi = orders[0]!;
  const hoodie = getProduct("fleece-hoodie")!;
  return (
    <DsGrid>
      <DsPreview label="CancelOrderDialog · ReturnExchangeFlow · Invoice" className="flex-col items-start">
        <div className="flex flex-wrap gap-2">
          <CancelOrderDialog
            orderId="LM-100251"
            amount={3499}
            paymentMethod="UPI · sujon@okaxis"
            onConfirm={async () => {
              await wait();
            }}
          />
          <ReturnExchangeFlow
            orderId={multi.id}
            lines={orderLines(multi)}
            deadline="2026-09-29"
            paymentMethod={multi.paymentMethod!}
            pickupAddress={multi.address}
            onSubmit={async () => {
              await wait();
            }}
          />
          <ReturnExchangeFlow
            orderId="LM-100251"
            lines={orderLines(orders[2]!)}
            deadline="2026-09-29"
            isCod
            paymentMethod="Cash on Delivery"
            pickupAddress={multi.address}
            trigger={<TextButton>COD return (bank refund)</TextButton>}
            onSubmit={async () => {
              await wait();
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <InvoiceDownloadButton orderId="LM-100377" available getInvoice={async () => new Blob(["Demo invoice"], { type: "text/plain" })} fileName="Invoice-LM-100377.txt" />
          <InvoiceDownloadButton orderId="LM-100482" available={false} getInvoice={async () => new Blob()} />
        </div>
        <p className="text-caption text-fg-muted">Choose “Size too small” on the hoodie to see the exchange path.</p>
      </DsPreview>
      <DsPreview label="RateProductPrompt" className="flex-col items-stretch">
        <RateProductPrompt product={{ name: hoodie.name, image: hoodie.images[0]! }} aspects={["Fit", "Fabric quality"]} onDismiss={() => toast({ title: "Dismissed" })} />
      </DsPreview>
    </DsGrid>
  );
}
