import { RefundLedger, sampleData } from "@bluesigns/ui";

const { adminReturns, ADMIN_TODAY } = sampleData;

const HOUR = 3600000;
const at = (daysAgo: number, hour: number) => new Date(ADMIN_TODAY.getTime() - daysAgo * 24 * HOUR + hour * HOUR).toISOString();

/** Returns as the queue keeps them: dataset row + customer note, payment mode, timeline and refund details. */
const records = adminReturns.slice(0, 5).map((r, i) => ({
  ...r,
  status: "refunded" as const,
  customerNote: "Unused, with tags. Would like the money back.",
  paymentMode: "UPI",
  log: [],
  refund: { amount: r.amount, method: i % 2 === 0 ? ("source" as const) : ("store-credit" as const), at: at(i, 11 + i) },
}));

export const WithRefunds = () => (
  <div style={{ width: 460 }}>
    <RefundLedger records={records} />
  </div>
);

export const Empty = () => (
  <div style={{ width: 460 }}>
    <RefundLedger records={[]} />
  </div>
);
