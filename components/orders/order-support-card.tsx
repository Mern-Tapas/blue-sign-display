import Link from "next/link";
import { ChevronRight, Clock, CreditCard, FileText, MessageCircle, Package, Phone, RotateCcw, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export type SupportTopic = { id: string; label: string; href: string; icon?: React.ReactNode };

export type OrderSupportCardProps = {
  orderId: string;
  topics?: SupportTopic[];
  chatHref?: string;
  /** "1800 123 4567" — toll-free line, shown with hours. */
  phone?: string;
  hours?: string;
  className?: string;
};

const defaultTopics = (id: string): SupportTopic[] => [
  { id: "where", label: "Where is my order?", href: `/help?topic=tracking&order=${id}`, icon: <Package /> },
  { id: "cancel", label: "Cancel this order", href: `/help?topic=cancel&order=${id}`, icon: <XCircle /> },
  { id: "return", label: "Return or exchange", href: `/help?topic=returns&order=${id}`, icon: <RotateCcw /> },
  { id: "refund", label: "Payment or refund issue", href: `/help?topic=refunds&order=${id}`, icon: <CreditCard /> },
  { id: "invoice", label: "Invoice and GST", href: `/help?topic=invoice&order=${id}`, icon: <FileText /> },
];

/** "Need help with this order?": the common questions first, then chat and a phone line with hours. Server-safe. */
export function OrderSupportCard({ orderId, topics, chatHref = "/help?chat=1", phone = "1800 123 4567", hours = "8 AM – 10 PM, all days", className }: OrderSupportCardProps) {
  const list = topics ?? defaultTopics(orderId);
  return (
    <Card asChild className={className}>
      <section data-slot="order-support" aria-labelledby={`support-${orderId}`}>
        <h3 id={`support-${orderId}`} className="text-title">
          Need help with this order?
        </h3>
        <ul className="-mx-2 flex flex-col">
          {list.map((t) => (
            <li key={t.id}>
              <Link href={t.href} className="flex min-h-row-md items-center gap-3 rounded-lg px-2 text-body text-fg transition-colors duration-(--dur-fast) hover:bg-highlight focus-ring-row [&>svg]:size-icon-md [&>svg]:shrink-0 [&>svg]:text-fg-muted">
                {t.icon}
                <span className="flex-1">{t.label}</span>
                <ChevronRight aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <div className="grid gap-2 border-t border-border-subtle pt-4 sm:grid-cols-2">
          <Link href={chatHref} className="flex items-center gap-2 rounded-xl bg-accent-soft px-3 py-2.5 text-label text-accent-soft-fg transition-colors duration-(--dur-fast) hover:bg-accent-soft-hover">
            <MessageCircle aria-hidden className="size-icon-md" /> Chat with us
          </Link>
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 rounded-xl bg-surface-sunken px-3 py-2.5 text-label text-fg transition-colors duration-(--dur-fast) hover:bg-surface-hover">
            <Phone aria-hidden className="size-icon-md text-fg-muted" /> <span className="figures">{phone}</span>
          </a>
        </div>
        <p className="flex items-center gap-1.5 text-caption text-fg-muted">
          <Clock aria-hidden className="size-icon-sm" /> {hours} · keep order {orderId} handy
        </p>
      </section>
    </Card>
  );
}
