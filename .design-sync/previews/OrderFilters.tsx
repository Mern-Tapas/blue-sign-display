import { useState } from "react";
import { OrderFilters, sampleData } from "@bluesigns/ui";

const { orders } = sampleData;

type Filters = { query: string; status: "all" | "active" | "delivered" | "cancelled" | "returned"; range: "30d" | "6m" | "2026" | "2025" | "all" };

function Demo({ initial }: { initial: Filters }) {
  const [value, setValue] = useState<Filters>(initial);
  return (
    <div className="rounded-xl bg-canvas p-4" style={{ maxWidth: 720 }}>
      <OrderFilters orders={orders} value={value} onChange={setValue} />
    </div>
  );
}

export const Default = () => <Demo initial={{ query: "", status: "all", range: "all" }} />;

export const DeliveredThisYear = () => <Demo initial={{ query: "", status: "delivered", range: "2026" }} />;

export const Searching = () => <Demo initial={{ query: "hoodie", status: "all", range: "6m" }} />;
