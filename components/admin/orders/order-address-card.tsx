import { MapPin } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import type { AdminOrder } from "@/lib/data/admin";

const streets = ["12th Main Road, Indiranagar", "Linking Road, Bandra West", "Lodhi Colony", "Road No. 36, Jubilee Hills", "Anna Salai, Teynampet", "FC Road, Shivajinagar", "Park Street", "CG Road, Navrangpura", "MI Road", "MG Road, Ernakulam", "Hazratganj", "GS Road, Ulubari"];

/** Demo street line, stable per order (the dataset stores city, state and PIN code only). */
function streetFor(orderId: string) {
  const n = Number(orderId.replace(/\D/g, "")) || 0;
  return `Flat ${(n % 80) + 101}, ${streets[n % streets.length]}`;
}

/** Where it ships. The PIN code is what courier serviceability is checked against. */
export function OrderAddressCard({ order }: { order: AdminOrder }) {
  const lines = [order.customerName, streetFor(order.id), `${order.city}, ${order.state}`, `PIN code ${order.pincode}`];
  return (
    <Card padding="md">
      <CardHeader title="Delivery address" action={<CopyButton value={lines.join("\n")} label="Copy address" size="sm" />} />
      <div className="flex gap-2.5">
        <MapPin aria-hidden className="mt-0.5 size-icon-md shrink-0 text-fg-muted" />
        <address className="text-body not-italic">
          {lines.map((l) => (
            <span key={l} className="block figures">
              {l}
            </span>
          ))}
        </address>
      </div>
    </Card>
  );
}
