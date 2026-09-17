"use client";

import { useState } from "react";
import { Ban, CheckCircle2, CircleDollarSign, FileDown, Link2, MoreHorizontal, PackageCheck, Printer, RotateCcw, ShoppingBag, StickyNote, Truck, Undo2 } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { copyText } from "@/components/ui/copy-button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import { adminDate, adminDateTime, adminRelative } from "@/lib/admin-format";
import { ADMIN_TODAY, orderStatusMeta, type AdminCustomer, type AdminOrder } from "@/lib/data/admin";
import { formatPrice } from "@/lib/format";
import { ActivityFeed, StatusPill, type ActivityItem } from "../admin-display";
import { PageHeader } from "../page-header";
import { CancelOrderAdminDialog } from "./cancel-order-admin-dialog";
import { FulfilmentCard } from "./fulfilment-card";
import { OrderAddressCard } from "./order-address-card";
import { OrderCustomerCard } from "./order-customer-card";
import { isCancellable, isPrepaid, type fulfilmentSteps } from "./order-helpers";
import { OrderItemsCard } from "./order-items-card";
import { OrderNotesCard } from "./order-notes-card";
import { OrderPaymentCard } from "./order-payment-card";
import { ShipOrderDialog, type ShipDetails } from "./ship-order-dialog";

type Stage = (typeof fulfilmentSteps)[number];
type EventKind = "placed" | "paid" | "confirmed" | "packed" | "shipped" | "out" | "delivered" | "cancelled" | "rto" | "returned" | "note";
type OrderEvent = { id: string; actor: string; action: string; at: string; kind: EventKind };

type DetailState = {
  order: AdminOrder;
  stageTimes: Partial<Record<Stage, string>>;
  events: OrderEvent[];
  pickupDate?: string;
  cancelReason?: string;
};

const MIN = 60000;
const HOUR = 60 * MIN;
const OPS = "Priya Nair";

const at = (iso: string, plus: number) => new Date(new Date(iso).getTime() + plus).toISOString();

/** Demo history reconstructed from the order's current status (the dataset stores only the latest state). */
function initialState(order: AdminOrder): DetailState {
  const p = order.placedAt;
  const s = order.status;
  const reached = (stage: Stage) => {
    const order_: Record<Stage, boolean> = {
      Placed: true,
      Confirmed: !["pending", "cancelled"].includes(s),
      Packed: ["packed", "shipped", "out-for-delivery", "delivered", "rto", "returned"].includes(s),
      Shipped: ["shipped", "out-for-delivery", "delivered", "rto", "returned"].includes(s),
      Delivered: ["delivered", "returned"].includes(s),
    };
    return order_[stage];
  };
  const stageTimes: DetailState["stageTimes"] = {
    Placed: p,
    ...(reached("Confirmed") && { Confirmed: at(p, 2 * MIN) }),
    ...(reached("Packed") && { Packed: at(p, 4 * HOUR) }),
    ...(reached("Shipped") && { Shipped: at(p, 20 * HOUR) }),
    ...(reached("Delivered") && { Delivered: at(p, 72 * HOUR) }),
  };

  const events: (OrderEvent | false)[] = [
    { id: "placed", kind: "placed", actor: order.customerName, action: `placed the order on the ${order.channel === "App" ? "app" : "website"}`, at: p },
    isPrepaid(order.payment) && s !== "pending" && { id: "paid", kind: "paid", actor: "Razorpay", action: `captured ${formatPrice(order.total)} via ${order.payment}`, at: at(p, MIN) },
    !!stageTimes.Confirmed && { id: "confirmed", kind: "confirmed", actor: "System", action: "confirmed the order and reserved stock", at: stageTimes.Confirmed },
    s === "cancelled" && { id: "cancelled", kind: "cancelled", actor: order.customerName, action: order.paymentStatus === "refunded" ? `cancelled the order · ${formatPrice(order.total)} refund started` : "cancelled the order", at: at(p, 3 * HOUR) },
    !!stageTimes.Packed && { id: "packed", kind: "packed", actor: OPS, action: "marked the order as packed", at: stageTimes.Packed },
    !!stageTimes.Shipped && { id: "shipped", kind: "shipped", actor: OPS, action: `shipped with ${order.courier} · AWB ${order.awb}`, at: stageTimes.Shipped },
    s === "out-for-delivery" && { id: "out", kind: "out", actor: order.courier ?? "Courier", action: "is out for delivery", at: at(p, 60 * HOUR) },
    !!stageTimes.Delivered && { id: "delivered", kind: "delivered", actor: order.courier ?? "Courier", action: order.payment === "COD" ? `delivered the parcel and collected ${formatPrice(order.total)} in cash` : "delivered the parcel", at: stageTimes.Delivered },
    s === "rto" && { id: "rto", kind: "rto", actor: order.courier ?? "Courier", action: "marked the parcel RTO after 3 failed delivery attempts", at: at(p, 6 * 24 * HOUR) },
    s === "returned" && { id: "returned", kind: "returned", actor: order.customerName, action: `returned the items · ${formatPrice(order.total)} refunded`, at: at(p, 8 * 24 * HOUR) },
  ];

  return { order, stageTimes, events: events.filter((e): e is OrderEvent => e !== false).sort((a, b) => b.at.localeCompare(a.at)) };
}

const icons: Record<EventKind, React.ReactNode> = {
  placed: <ShoppingBag aria-hidden />,
  paid: <CircleDollarSign aria-hidden />,
  confirmed: <CheckCircle2 aria-hidden />,
  packed: <PackageCheck aria-hidden />,
  shipped: <Truck aria-hidden />,
  out: <Truck aria-hidden />,
  delivered: <CheckCircle2 aria-hidden />,
  cancelled: <Ban aria-hidden />,
  rto: <Undo2 aria-hidden />,
  returned: <RotateCcw aria-hidden />,
  note: <StickyNote aria-hidden />,
};

const tones: Record<EventKind, ActivityItem["tone"]> = {
  placed: "neutral",
  paid: "success",
  confirmed: "neutral",
  packed: "accent",
  shipped: "accent",
  out: "accent",
  delivered: "success",
  cancelled: "neutral",
  rto: "danger",
  returned: "warning",
  note: "neutral",
};

export type AdminOrderDetailProps = { order: AdminOrder; customer?: AdminCustomer };

/** /admin/orders/[id]: items, fulfilment with the next action, timeline, customer, address, payment and notes. */
export function AdminOrderDetail({ order: initialOrder, customer }: AdminOrderDetailProps) {
  const [state, setState] = useState<DetailState>(() => initialState(initialOrder));
  const [shipOpen, setShipOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [busy, setBusy] = useState<"packed" | "delivered" | null>(null);

  const { order } = state;
  const meta = orderStatusMeta[order.status];

  /** Demo clock for new actions: just after the latest recorded event, never before midday on the demo "today". */
  const stamp = (s: DetailState) => {
    const latest = Math.max(new Date(s.events[0]?.at ?? ADMIN_TODAY.toISOString()).getTime(), ADMIN_TODAY.getTime() + 12 * HOUR);
    return new Date(latest + 7 * MIN).toISOString();
  };

  /** Applies a change, logs it in the timeline, and returns the previous state for Undo. */
  const apply = (kind: EventKind, action: string, change: (s: DetailState, when: string) => Partial<DetailState>) => {
    const prev = state;
    const when = stamp(state);
    const next: DetailState = { ...state, ...change(state, when) };
    next.events = [{ id: `local-${state.events.length}`, kind, actor: "You", action, at: when }, ...state.events];
    setState(next);
    return () => setState(prev);
  };

  const markPacked = () => {
    setBusy("packed");
    window.setTimeout(() => {
      setBusy(null);
      const undo = apply("packed", "marked the order as packed", (s, when) => ({ order: { ...s.order, status: "packed" }, stageTimes: { ...s.stageTimes, Packed: when } }));
      toast({ title: `${order.id} marked as packed`, description: "Next: add a courier and AWB to ship it.", tone: "success", action: { label: "Undo", onClick: undo } });
    }, 400);
  };

  const ship = (d: ShipDetails) => {
    apply("shipped", `shipped with ${d.courier} · AWB ${d.awb}`, (s, when) => ({ order: { ...s.order, status: "shipped", courier: d.courier, awb: d.awb }, stageTimes: { ...s.stageTimes, Shipped: when }, pickupDate: d.pickupDate }));
    setShipOpen(false);
    toast({ title: `Shipped with ${d.courier}`, description: `AWB ${d.awb} · pickup ${adminDate(d.pickupDate)}. The customer has the tracking link.`, tone: "success" });
  };

  const markDelivered = () => {
    setBusy("delivered");
    window.setTimeout(() => {
      setBusy(null);
      const cod = order.payment === "COD";
      const undo = apply("delivered", cod ? `marked the order delivered · ${formatPrice(order.total)} cash collected` : "marked the order delivered", (s, when) => ({
        order: { ...s.order, status: "delivered", paymentStatus: cod ? "paid" : s.order.paymentStatus },
        stageTimes: { ...s.stageTimes, Delivered: when },
      }));
      toast({ title: `${order.id} marked as delivered`, description: cod ? "COD cash will be remitted with the next settlement." : "The 7-day return window has started.", tone: "success", action: { label: "Undo", onClick: undo } });
    }, 400);
  };

  const cancel = (reason: string) => {
    const refund = isPrepaid(order.payment) && order.paymentStatus === "paid";
    apply("cancelled", `cancelled the order: ${reason}${refund ? ` · ${formatPrice(order.total)} refund started` : ""}`, (s) => ({
      order: { ...s.order, status: "cancelled", paymentStatus: refund ? "refunded" : s.order.paymentStatus },
      cancelReason: reason,
    }));
    toast({ title: `${order.id} cancelled`, description: refund ? `${formatPrice(order.total)} refund to ${order.payment} started (5–7 working days).` : "Nothing to refund. Stock is back in inventory.", tone: "neutral" });
  };

  const feed: ActivityItem[] = state.events.map((e) => ({ id: e.id, actor: e.actor, action: e.action, at: e.at, icon: icons[e.kind], tone: tones[e.kind] }));
  const cancellable = isCancellable(order.status);

  return (
    <>
      <PageHeader
        title={order.id}
        breadcrumbs={[{ label: "Orders", href: "/admin/orders" }, { label: order.id }]}
        meta={
          <>
            <StatusPill tone={meta.tone} label={meta.label} live={meta.live} />
            <span className="figures">Placed {adminDateTime(order.placedAt)}</span>
            <span aria-hidden>·</span>
            <span>{order.channel === "App" ? "App order" : "Web order"}</span>
            <span aria-hidden>·</span>
            <span>Demo data</span>
          </>
        }
        actions={
          <>
            <Button
              variant="secondary"
              leadingIcon={<Printer aria-hidden />}
              onClick={() => toast({ title: "GST invoice sent to the printer", description: `Tax invoice for ${order.id} · ${formatPrice(order.total)}`, tone: "success" })}
            >
              Print invoice
            </Button>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <IconButton label="More order actions" variant="secondary">
                  <MoreHorizontal aria-hidden />
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => toast({ title: "Invoice downloaded", description: `${order.id}-invoice.pdf`, tone: "success" })}>
                  <FileDown aria-hidden />
                  Download invoice (PDF)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={async () => {
                    const ok = await copyText(`${window.location.origin}/admin/orders/${order.id}`);
                    toast(ok ? { title: "Order link copied", tone: "success" } : { title: "Couldn’t copy the link", tone: "danger" });
                  }}
                >
                  <Link2 aria-hidden />
                  Copy order link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive disabled={!cancellable} onSelect={() => setCancelOpen(true)}>
                  <Ban aria-hidden />
                  Cancel order
                </DropdownMenuItem>
                {!cancellable && order.status !== "cancelled" && <DropdownMenuLabel className="max-w-56">Shipped orders can’t be cancelled. Ask the courier for RTO instead.</DropdownMenuLabel>}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
        <div className="flex min-w-0 flex-col gap-4">
          <OrderItemsCard lines={order.lines} />
          <FulfilmentCard
            order={order}
            stageTimes={state.stageTimes}
            pickupDate={state.pickupDate}
            cancelReason={state.cancelReason}
            busy={busy}
            onMarkPacked={markPacked}
            onShip={() => setShipOpen(true)}
            onMarkDelivered={markDelivered}
            onPrintLabel={() => toast({ title: "Shipping label sent to the printer", description: `4 × 6 in label for ${order.id}`, tone: "success" })}
            onSendPaymentLink={() => {
              apply("note", "sent a UPI payment link by SMS", () => ({}));
              toast({ title: "Payment link sent", description: `${order.customerName} gets a UPI link by SMS and WhatsApp.`, tone: "success" });
            }}
          />
          <Card padding="md">
            <h2 className="text-title">Timeline</h2>
            <ActivityFeed items={feed} formatTime={(iso) => adminRelative(iso, ADMIN_TODAY)} />
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <OrderCustomerCard order={order} customer={customer} />
          <OrderAddressCard order={order} />
          <OrderPaymentCard order={order} />
          <OrderNotesCard initialNote={order.notes} />
        </div>
      </div>

      <ShipOrderDialog orderId={order.id} pincode={order.pincode} open={shipOpen} onOpenChange={setShipOpen} onShip={ship} />
      <CancelOrderAdminDialog order={order} open={cancelOpen} onOpenChange={setCancelOpen} onCancel={cancel} />
    </>
  );
}
