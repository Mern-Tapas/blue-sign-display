"use client";

import { useState } from "react";
import { BadgePercent, Ban, Mail, MoreHorizontal, PackageCheck, ShoppingBag, UserPlus, Undo2, XCircle } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { Alert } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import { Inset } from "@/components/ui/inset";
import { copyText } from "@/components/ui/copy-button";
import { adminDate, adminDateShort, adminRelative } from "@/lib/admin-format";
import { ADMIN_DEMO_NOTE, ADMIN_TODAY, orderStatusMeta, type AdminCustomer, type AdminOrder } from "@/lib/data/admin";
import { formatNumber, formatPhone, formatPrice } from "@/lib/format";
import { ActivityFeed, type ActivityItem } from "../admin-display";
import { KpiRow, KpiTile } from "../metrics";
import { PageHeader } from "../page-header";
import { CustomerContactCard } from "./customer-contact-card";
import { customerStats, daysAgoLabel, initialTags } from "./customer-data";
import { CustomerNotesCard } from "./customer-notes-card";
import { CustomerOrdersTable } from "./customer-orders-table";
import { CustomerSpendCard } from "./customer-spend-card";
import { CustomerTagsCard } from "./customer-tags-card";
import { SegmentBadge } from "./segment-badge";
import { SendCouponDialog } from "./send-coupon-dialog";

export type CustomerProfileProps = { customer: AdminCustomer; orders: AdminOrder[] };

/** /admin/customers/[id]: who the customer is, what they've bought and what staff know about them. */
export function CustomerProfile({ customer, orders }: CustomerProfileProps) {
  const [blocked, setBlocked] = useState(false);
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const firstName = customer.name.split(" ")[0]!;
  const stats = customerStats(customer, orders);

  const sorted = [...orders].sort((a, b) => (a.placedAt < b.placedAt ? 1 : -1));
  const activity: ActivityItem[] = [
    ...sorted.slice(0, 6).map((o) => {
      const meta = orderStatusMeta[o.status];
      const bad = o.status === "rto" || o.status === "cancelled" || o.status === "returned";
      return {
        id: o.id,
        actor: firstName,
        action: `placed ${o.id} for ${formatPrice(o.total)} by ${o.payment}. ${meta.label === "Delivered" ? "Delivered." : `Now: ${meta.label}.`}`,
        at: o.placedAt,
        tone: bad ? ("danger" as const) : o.status === "delivered" ? ("success" as const) : ("accent" as const),
        icon: bad ? <XCircle /> : o.status === "delivered" ? <PackageCheck /> : <ShoppingBag />,
      };
    }),
    { id: "joined", actor: firstName, action: `created an account from ${customer.city}`, at: `${customer.joinedAt}T10:00:00`, tone: "neutral" as const, icon: <UserPlus /> },
  ];

  function block() {
    setBlocked(true);
    toast({
      title: `${customer.name} is blocked`,
      description: "They can’t place orders or redeem coupons until you unblock them.",
      tone: "danger",
      action: { label: "Undo", onClick: () => setBlocked(false) },
    });
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <Breadcrumbs items={[{ label: "Customers", href: "/admin/customers" }, { label: customer.name }]} />
        <div className="flex items-end gap-4">
          <span aria-hidden className="max-sm:hidden">
            <Avatar name={customer.name} size="xl" />
          </span>
          <PageHeader
            className="min-w-0 flex-1"
            title={customer.name}
            meta={
              <>
                <SegmentBadge segment={customer.segment} />
                {blocked && (
                  <Badge tone="danger" size="sm">
                    Blocked
                  </Badge>
                )}
                <span>Customer since {adminDate(customer.joinedAt)}</span>
                <span aria-hidden>·</span>
                <span className="text-code">{customer.id}</span>
                <span aria-hidden>·</span>
                <span>{ADMIN_DEMO_NOTE}</span>
              </>
            }
            actions={
              <>
                <Button asChild variant="secondary" leadingIcon={<Mail aria-hidden />}>
                  <a href={`mailto:${customer.email}`}>Email</a>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <IconButton label="More customer actions" variant="secondary">
                      <MoreHorizontal aria-hidden />
                    </IconButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => setCouponOpen(true)} disabled={blocked}>
                      <BadgePercent aria-hidden />
                      Send coupon
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={async () => {
                        const ok = await copyText(formatPhone(customer.phone));
                        toast(ok ? { title: "Phone number copied", description: formatPhone(customer.phone), tone: "success" } : { title: "Couldn’t copy", tone: "danger" });
                      }}
                    >
                      Copy phone number
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {blocked ? (
                      <DropdownMenuItem
                        onSelect={() => {
                          setBlocked(false);
                          toast({ title: `${customer.name} is unblocked`, tone: "success" });
                        }}
                      >
                        <Undo2 aria-hidden />
                        Unblock customer
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem destructive onSelect={() => setConfirmBlock(true)}>
                        <Ban aria-hidden />
                        Block customer
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            }
          />
        </div>
      </div>

      {blocked && (
        <Alert
          tone="danger"
          title="This customer is blocked"
          action={
            <Button size="sm" variant="secondary" onClick={() => setBlocked(false)}>
              Unblock
            </Button>
          }
        >
          Checkout rejects their phone and email, and their coupons stop working. Orders already placed still ship.
        </Alert>
      )}

      <KpiRow>
        <KpiTile label="Orders" value={formatNumber(stats.count)} note={`${formatNumber(orders.length)} in the last 60 days`} />
        <KpiTile label="Lifetime value" value={formatPrice(stats.lifetimeValue)} note="net of cancellations, returns and RTO" />
        <KpiTile label="Average order value" value={formatPrice(stats.aov)} />
        <KpiTile label="Last order" value={adminDateShort(stats.lastOrderAt)} note={daysAgoLabel(stats.lastOrderAt)} />
      </KpiRow>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-4">
          <CustomerOrdersTable
            orders={orders}
            firstName={firstName}
            emptyAction={
              !blocked && (
                <Button variant="secondary" size="sm" leadingIcon={<BadgePercent aria-hidden />} onClick={() => setCouponOpen(true)}>
                  Send a coupon
                </Button>
              )
            }
          />
          <Card padding="md" className="gap-4">
            <h2 className="text-title">Activity</h2>
            <ActivityFeed items={activity} formatTime={(iso) => adminRelative(iso, ADMIN_TODAY)} />
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <CustomerContactCard customer={customer} />
          <Card padding="md" className="gap-4">
            <h2 className="text-title">Default address</h2>
            <Inset size="sm" asChild>
              <address className="flex flex-col gap-0.5 text-body not-italic">
                <span className="text-body-strong">{customer.name}</span>
                <span>{customer.city}</span>
                <span>
                  {customer.state} <span className="figures">{customer.pincode}</span>
                </span>
                <span className="text-caption text-fg-muted">India · {formatPhone(customer.phone)}</span>
              </address>
            </Inset>
          </Card>
          <CustomerSpendCard orders={orders} firstName={firstName} />
          <CustomerTagsCard initialTags={initialTags(customer, orders)} />
          <CustomerNotesCard firstName={firstName} />
        </div>
      </div>

      <ConfirmDialog
        open={confirmBlock}
        onOpenChange={setConfirmBlock}
        tone="danger"
        icon={<Ban />}
        title={`Block ${customer.name}?`}
        description={`They won’t be able to place new orders or redeem coupons with ${customer.email} or ${formatPhone(customer.phone)}. Orders already placed will still ship, and you can unblock them at any time.`}
        confirmLabel="Block customer"
        onConfirm={block}
      />
      <SendCouponDialog open={couponOpen} onOpenChange={setCouponOpen} customers={[customer]} />
    </>
  );
}
