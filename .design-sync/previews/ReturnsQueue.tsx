import { useState } from "react";
import { AdminFilterBar, ReturnsQueue, sampleData } from "@bluesigns/ui";

const { adminReturns, adminOrders } = sampleData;

/** Dataset returns plus the fields the queue tracks (customer note, payment mode, timeline). */
const records = adminReturns.map((r) => ({
  ...r,
  customerNote: "Unused, with tags.",
  paymentMode: adminOrders.find((o) => o.id === r.orderId)?.payment ?? "UPI",
  log: [],
}));

const empty = { title: "No returns to review", description: "New requests from customers land here. Approve or reject within 48 hours to keep your seller rating." };

export const Queue = () => {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div style={{ width: 1100 }}>
      <ReturnsQueue
        rows={records}
        selectedId={selected}
        onOpen={setSelected}
        empty={empty}
        toolbar={<AdminFilterBar search="" onSearchChange={() => {}} searchPlaceholder="Search returns or customers" />}
      />
    </div>
  );
};

export const CompactWithSelection = () => {
  const [selected, setSelected] = useState<string | null>(records[1]!.id);
  return (
    <div style={{ width: 640 }}>
      <ReturnsQueue rows={records.slice(0, 6)} selectedId={selected} onOpen={setSelected} compact empty={empty} />
    </div>
  );
};

export const Empty = () => (
  <div style={{ width: 640 }}>
    <ReturnsQueue rows={[]} selectedId={null} onOpen={() => {}} empty={empty} />
  </div>
);
