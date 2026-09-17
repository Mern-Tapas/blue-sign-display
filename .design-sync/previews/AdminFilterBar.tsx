import { useState } from "react";
import { AdminFilterBar, sampleData } from "@bluesigns/ui";

const { adminOrders } = sampleData;

const paymentFilter = {
  id: "payment",
  label: "Payment",
  options: ["UPI", "Card", "COD", "Net banking", "Wallet", "EMI"].map((p) => ({ value: p, label: p, count: adminOrders.filter((o) => o.payment === p).length })),
};

const statusFilter = {
  id: "status",
  label: "Status",
  options: [
    { value: "confirmed", label: "To pack" },
    { value: "packed", label: "Ready to ship" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
  ].map((o) => ({ ...o, count: adminOrders.filter((x) => x.status === o.value).length })),
};

export const WithActiveFilters = () => {
  const [q, setQ] = useState("");
  const [values, setValues] = useState<Record<string, string[]>>({ payment: ["COD", "UPI"], status: ["confirmed"] });
  return (
    <div style={{ width: 900 }}>
      <AdminFilterBar search={q} onSearchChange={setQ} searchPlaceholder="Search order, customer, AWB" filters={[paymentFilter, statusFilter]} values={values} onValuesChange={setValues} />
    </div>
  );
};

export const Idle = () => {
  const [q, setQ] = useState("");
  const [values, setValues] = useState<Record<string, string[]>>({});
  return (
    <div style={{ width: 900 }}>
      <AdminFilterBar search={q} onSearchChange={setQ} searchPlaceholder="Search order, customer, AWB" filters={[paymentFilter, statusFilter]} values={values} onValuesChange={setValues} />
    </div>
  );
};

export const SearchOnly = () => {
  const [q, setQ] = useState("Kavya");
  return (
    <div style={{ width: 900 }}>
      <AdminFilterBar search={q} onSearchChange={setQ} searchPlaceholder="Search customers by name, email or phone" />
    </div>
  );
};
