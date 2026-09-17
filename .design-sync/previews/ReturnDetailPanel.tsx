import { ReturnDetailPanel, sampleData, toast } from "@bluesigns/ui";

const { adminReturns, adminOrders } = sampleData;
type Status = (typeof adminReturns)[number]["status"];

const HOUR = 3600000;
const plus = (iso: string, hours: number) => new Date(new Date(iso).getTime() + hours * HOUR).toISOString();

/** A dataset return plus what the queue tracks: customer note, payment mode, pickup slot and timeline. */
function record(status: Status) {
  const r = adminReturns.find((x) => x.status === status)!;
  const log = [
    { id: "requested", kind: "requested" as const, actor: r.customerName, action: `asked for ${r.resolution === "refund" ? "a refund" : "an exchange"}: ${r.reason.toLowerCase()}`, at: r.requestedAt },
    ...(status !== "requested" ? [{ id: "approved", kind: "approved" as const, actor: "Meera Iyer", action: "approved the return", at: plus(r.requestedAt, 3) }] : []),
    ...(status === "pickup-scheduled" || status === "received" ? [{ id: "pickup", kind: "pickup" as const, actor: "Delhivery", action: "booked a reverse pickup for tomorrow, 9 am – 1 pm", at: plus(r.requestedAt, 4) }] : []),
    ...(status === "received" ? [{ id: "received", kind: "received" as const, actor: "Warehouse", action: "received the item and passed quality check", at: plus(r.requestedAt, 48) }] : []),
  ].reverse();
  return {
    ...r,
    photos: status === "requested" ? 3 : r.photos,
    pickupSlot: status === "pickup-scheduled" || status === "received" ? "d1-am" : undefined,
    customerNote: "The colour is much darker than in the product photos. Unused, with tags.",
    paymentMode: adminOrders.find((o) => o.id === r.orderId)?.payment ?? "UPI",
    log,
  };
}

const handlers = {
  onClose: () => {},
  onApprove: () => toast({ title: "Return approved", description: "Next: pick a reverse pickup slot.", tone: "success" }),
  onReject: (reason: string) => toast({ title: "Return rejected", description: reason, tone: "neutral" }),
  onSchedule: () => toast({ title: "Pickup scheduled", tone: "success" }),
  onReceive: () => toast({ title: "Marked as received", tone: "success" }),
  onRefund: ({ amount }: { amount: number }) => toast({ title: `₹${amount} refund issued`, tone: "success" }),
};

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start bg-canvas p-6" style={{ height: 820 }}>
    {children}
  </div>
);

export const ToReview = () => (
  <Frame>
    <ReturnDetailPanel record={record("requested")} {...handlers} />
  </Frame>
);

export const ChoosePickupSlot = () => (
  <Frame>
    <ReturnDetailPanel record={record("approved")} {...handlers} />
  </Frame>
);

export const IssueRefund = () => (
  <Frame>
    <ReturnDetailPanel record={record("received")} {...handlers} />
  </Frame>
);
