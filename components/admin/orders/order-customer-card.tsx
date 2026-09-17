import { Mail, Phone } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { TextLink } from "@/components/ui/text-link";
import { adminDate } from "@/lib/admin-format";
import type { AdminCustomer, AdminOrder } from "@/lib/data/admin";
import { formatNumber, formatPhone, formatPrice } from "@/lib/format";

/** Who ordered: profile link, order history at a glance and copyable contact details. */
export function OrderCustomerCard({ order, customer }: { order: AdminOrder; customer?: AdminCustomer }) {
  const phone = customer ? formatPhone(customer.phone) : undefined;
  const contacts = customer && phone ? [
    { icon: <Mail />, value: customer.email, copy: customer.email, label: "Copy email" },
    { icon: <Phone />, value: phone, copy: phone.replace(/\s/g, ""), label: "Copy phone" },
  ] : [];

  return (
    <Card padding="md">
      <CardHeader title="Customer" />
      <div className="flex flex-col gap-0.5">
        {customer ? (
          <TextLink href={`/admin/customers/${customer.id}`} size="md" className="self-start">
            {customer.name}
          </TextLink>
        ) : (
          <p className="text-body-strong">{order.customerName}</p>
        )}
        {customer && (
          <p className="text-caption text-fg-muted figures">
            {formatNumber(customer.orders)} {customer.orders === 1 ? "order" : "orders"} · {formatPrice(customer.lifetimeValue)} lifetime · since {adminDate(customer.joinedAt)}
          </p>
        )}
      </div>
      {contacts.length > 0 && (
        <ul className="flex flex-col gap-1">
          {contacts.map((c) => (
            <li key={c.label} className="flex min-h-control-sm items-center gap-2.5">
              <span aria-hidden className="text-fg-muted [&_svg]:size-icon-md">
                {c.icon}
              </span>
              <span className="min-w-0 flex-1 truncate text-body">{c.value}</span>
              <CopyButton value={c.copy} label={c.label} size="xs" />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
