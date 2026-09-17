import { AdminFilterBar, OrdersTable, sampleData, toast } from "@bluesigns/ui";

const { adminOrders } = sampleData;
type Order = (typeof adminOrders)[number];

const actions = {
  onMarkPacked: (list: Order[]) => toast({ title: `${list.length} orders marked as packed`, tone: "success" }),
  onPrintLabels: (list: Order[]) => toast({ title: `${list.length} shipping labels sent to the printer`, tone: "success" }),
  onExport: (list: Order[]) => toast({ title: `Exported ${list.length} orders`, tone: "success" }),
};

export const Orders = () => (
  <div style={{ width: 1100 }}>
    <OrdersTable
      rows={adminOrders.slice(0, 10)}
      empty={{ title: "No orders in this range", description: "Orders placed in the selected date range appear here." }}
      toolbar={
        <AdminFilterBar
          search=""
          onSearchChange={() => {}}
          searchPlaceholder="Search ID, customer or AWB"
          filters={[{ id: "payment", label: "Payment", options: ["UPI", "Card", "COD"].map((p) => ({ value: p, label: p, count: adminOrders.filter((o) => o.payment === p).length })) }]}
          values={{}}
          onValuesChange={() => {}}
        />
      }
      {...actions}
    />
  </div>
);

export const Loading = () => (
  <div style={{ width: 1100 }}>
    <OrdersTable rows={adminOrders.slice(0, 5)} loading empty={{ title: "No orders in this range" }} {...actions} />
  </div>
);

export const Empty = () => (
  <div style={{ width: 1100 }}>
    <OrdersTable
      rows={[]}
      empty={{ title: "Nothing to pack", description: "Confirmed orders land here as soon as payment clears. Pack them before their ship-by time." }}
      {...actions}
    />
  </div>
);
