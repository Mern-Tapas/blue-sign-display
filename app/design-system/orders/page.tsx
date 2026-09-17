import type { Metadata } from "next";
import { OrderActionsDemo, OrdersListDemo } from "@/components/docs/demos/orders-demo";
import { DsGrid, DsPageHeader, DsPreview, DsProps, DsSection } from "@/components/docs/ds-section";
import { OrderTimeline } from "@/components/commerce/order-timeline";
import { OrderDetails } from "@/components/orders/order-details";
import { OrderSupportCard } from "@/components/orders/order-support-card";
import { RefundStatusCard } from "@/components/orders/refund-status-card";
import { ShipmentTracker } from "@/components/orders/shipment-tracker";
import { orders } from "@/lib/data/reviews";
import { OrderHistory } from "@/components/commerce/order-history";

export const metadata: Metadata = { title: "Orders & returns" };

export default function OrdersDocsPage() {
  const [ofd, delivered, processing, cancelled, returned] = orders;
  return (
    <>
      <DsPageHeader
        title="Orders"
        muted="& returns"
        description="After checkout: the orders list, tracking, cancellation, returns and exchanges, refunds, invoices and help. Live at /account/orders and /account/orders/LM-100482."
      />

      <DsSection title="Orders list" description="Status written as a sentence with the return window or refund state, filters by status and date, and search by order number or product.">
        <OrdersListDemo />
      </DsSection>

      <DsSection title="Tracking" description="Stage progress with scan times, courier and AWB to copy, the delivery-OTP reminder, and the full scan history with locations.">
        <DsGrid>
          <DsPreview label="ShipmentTracker · out for delivery" className="block">
            <ShipmentTracker order={ofd!} trackingUrl="https://www.delhivery.com/" />
          </DsPreview>
          <DsPreview label="ShipmentTracker · processing" className="block">
            <ShipmentTracker order={processing!} />
          </DsPreview>
          <DsPreview label="OrderTimeline · newest first" className="block">
            <OrderTimeline events={ofd!.timeline} newestFirst />
          </DsPreview>
          <DsPreview label="OrderTimeline · returned order" className="block">
            <OrderTimeline events={returned!.timeline} />
          </DsPreview>
        </DsGrid>
      </DsSection>

      <DsSection title="Refunds">
        <DsGrid>
          <RefundStatusCard refund={returned!.refund!} />
          <RefundStatusCard refund={cancelled!.refund!} />
        </DsGrid>
      </DsSection>

      <DsSection title="Actions" description="Cancel explains the refund before confirming; returns walk through items, reason, exchange or refund, pickup and review; invoices wait for delivery.">
        <OrderActionsDemo />
      </DsSection>

      <DsSection title="Help">
        <div className="max-w-md">
          <OrderSupportCard orderId={delivered!.id} />
        </div>
      </DsSection>

      <DsSection title="Order details" description="The full page composition for a delivered order (return window open until 23 Sept in the demo data).">
        <div id="order-details">
          <OrderDetails order={delivered!} />
        </div>
      </DsSection>

      <DsSection title="Order history & timeline" description="Compact history list with the tracking timeline for the selected order.">
        <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
          <OrderHistory orders={orders} activeId={orders[0]!.id} />
          <DsPreview label={`Tracking · ${orders[0]!.id}`} className="block">
            <OrderTimeline events={orders[0]!.timeline} />
          </DsPreview>
        </div>
      </DsSection>

      <DsSection title="Props">
        <div className="flex flex-col gap-5">
          <DsProps
            component="OrderFilters · OrderItemCard · OrderDetails"
            rows={[
              { name: "orders · value · onChange", type: "OrderFilters", description: "{ query, status: all | active | delivered | returned | cancelled, range }; applyOrderFilters(orders, f, today)." },
              { name: "order · today · detailsHref", type: "OrderItemCard", description: "Status sentence, return window / refund line, Track or Buy again." },
              { name: "order", type: "OrderDetails", description: "Tracker, refund, items, rate prompt, history, address, payment, price details, help; cancel / return / invoice when allowed (lib/orders canCancel, canReturn)." },
            ]}
          />
          <DsProps
            component="ShipmentTracker · OrderTimeline (updated) · RefundStatusCard"
            rows={[
              { name: "order · trackingUrl", type: "ShipmentTracker", description: "Horizontal from sm, vertical on phones." },
              { name: "events · newestFirst", type: "OrderTimeline", description: "Adds scan location and IST time per event." },
              { name: "refund", type: "RefundStatusCard — { amount, destination, status, initiatedOn, expectedBy, creditedOn?, reference? }", description: "Order.refund in the data model." },
            ]}
          />
          <DsProps
            component="CancelOrderDialog · ReturnExchangeFlow"
            rows={[
              { name: "orderId · amount · paymentMethod · isCod · trigger · onConfirm", type: "CancelOrderDialog", description: "onConfirm({ reason, comment }); throw to show an error." },
              { name: "orderId · lines · deadline · isCod · paymentMethod · pickupAddress · trigger · onSubmit", type: "ReturnExchangeFlow", description: "onSubmit(ReturnRequest) with items, reason, resolution, exchangeSize, pickup, refundTo, bank, photos." },
            ]}
          />
          <DsProps
            component="InvoiceDownloadButton · RateProductPrompt · OrderSupportCard"
            rows={[
              { name: "orderId · available · getInvoice · fileName · label", type: "InvoiceDownloadButton", description: "Explains availability before delivery." },
              { name: "product · aspects · onSubmit · onDismiss", type: "RateProductPrompt", description: "Star tap opens WriteReviewDialog with that rating (new open / defaultRating props)." },
              { name: "orderId · topics · chatHref · phone · hours", type: "OrderSupportCard", description: "Common questions, chat and toll-free line." },
            ]}
          />
        </div>
      </DsSection>
    </>
  );
}
