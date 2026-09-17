"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, CheckCircle2, ImageIcon, PackageOpen, RotateCcw, Truck, Wallet, XCircle } from "lucide-react";
import { ProductImage } from "@/components/commerce/product-image";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DescriptionList } from "@/components/ui/description-list";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Inset } from "@/components/ui/inset";
import { RadioCard, RadioCardGroup } from "@/components/ui/radio-card";
import { adminDateTime, adminRelative } from "@/lib/admin-format";
import { ADMIN_TODAY } from "@/lib/data/admin";
import { formatPrice } from "@/lib/format";
import { ActivityFeed, StatusPill, type ActivityItem } from "../admin-display";
import { DetailPanel } from "../admin-parts";
import { returnStatusMeta } from "./order-helpers";
import { RejectReturnDialog } from "./reject-return-dialog";
import { pickupSlots, refundMethodLabel, slotLabel, type RefundMethod, type ReturnLogKind, type ReturnRecord } from "./return-records";

export type ReturnDetailPanelProps = {
  record: ReturnRecord;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
  onSchedule: (slotId: string) => void;
  onReceive: () => void;
  onRefund: (refund: { amount: number; method: RefundMethod }) => void;
};

const logIcon: Record<ReturnLogKind, React.ReactNode> = {
  requested: <RotateCcw aria-hidden />,
  approved: <CheckCircle2 aria-hidden />,
  pickup: <Truck aria-hidden />,
  received: <PackageOpen aria-hidden />,
  refunded: <Wallet aria-hidden />,
  rejected: <XCircle aria-hidden />,
};
const logTone: Record<ReturnLogKind, ActivityItem["tone"]> = { requested: "warning", approved: "success", pickup: "accent", received: "accent", refunded: "success", rejected: "neutral" };

/**
 * Review one return beside the queue (a sheet below lg): evidence first (photos, reason, note), then the
 * next step for its status. Mount with `key={record.id}` so form state resets per return.
 */
export function ReturnDetailPanel({ record: r, onClose, onApprove, onReject, onSchedule, onReceive, onRefund }: ReturnDetailPanelProps) {
  const [slot, setSlot] = useState("");
  const [amount, setAmount] = useState(String(r.amount));
  const [method, setMethod] = useState<RefundMethod>("source");
  const [amountTouched, setAmountTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const meta = returnStatusMeta[r.status];

  const value = Number(amount.replace(/[,\s₹]/g, ""));
  const amountError = !amountTouched
    ? undefined
    : !amount.trim() || Number.isNaN(value)
      ? "Enter the refund amount in rupees."
      : value <= 0
        ? "The refund must be more than ₹0."
        : value > r.amount
          ? `You can refund up to ${formatPrice(r.amount)}, the price paid for this item.`
          : undefined;

  const run = (fn: () => void) => {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      fn();
    }, 400);
  };

  const photos = Array.from({ length: r.photos }, (_, i) => i + 1);

  let footer: React.ReactNode = null;
  if (r.status === "requested") {
    footer = (
      <>
        <Button leadingIcon={<CheckCircle2 aria-hidden />} loading={busy} onClick={() => run(onApprove)} className="flex-1">
          Approve
        </Button>
        <RejectReturnDialog returnId={r.id} customerName={r.customerName} onReject={onReject} disabled={busy} />
      </>
    );
  } else if (r.status === "approved") {
    footer = (
      <Button leadingIcon={<CalendarCheck aria-hidden />} disabled={!slot} loading={busy} onClick={() => run(() => onSchedule(slot))} fullWidth>
        Schedule pickup
      </Button>
    );
  } else if (r.status === "pickup-scheduled") {
    footer = (
      <Button leadingIcon={<PackageOpen aria-hidden />} loading={busy} onClick={() => run(onReceive)} fullWidth>
        Mark received
      </Button>
    );
  } else if (r.status === "received") {
    footer = (
      <Button
        leadingIcon={<Wallet aria-hidden />}
        loading={busy}
        fullWidth
        onClick={() => {
          setAmountTouched(true);
          if (!amount.trim() || Number.isNaN(value) || value <= 0 || value > r.amount) {
            document.getElementById(`refund-amount-${r.id}`)?.focus();
            return;
          }
          run(() => onRefund({ amount: value, method }));
        }}
      >
        Issue refund{!Number.isNaN(value) && value > 0 && value <= r.amount ? ` of ${formatPrice(value)}` : ""}
      </Button>
    );
  }

  return (
    <DetailPanel open onOpenChange={(o) => !o && onClose()} title={`Return ${r.id}`} description={`${r.customerName} · requested ${adminRelative(r.requestedAt, ADMIN_TODAY)}`} footer={footer}>
      <div className="flex items-start gap-3">
        <ProductImage src={r.image} alt="" sizes="56px" wrapperClassName="size-14 shrink-0 rounded-md" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-body-strong">{r.productName}</p>
          <p className="text-caption text-fg-muted">
            Order{" "}
            <Link href={`/admin/orders/${r.orderId}`} className="text-accent-fg underline-offset-4 hover:underline">
              {r.orderId}
            </Link>{" "}
            · {r.paymentMode}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={meta.tone} label={meta.label} />
            <Badge tone={r.resolution === "refund" ? "neutral" : "info"} size="sm">
              {r.resolution === "refund" ? "Refund" : "Exchange"}
            </Badge>
          </div>
        </div>
        <p className="text-body-strong figures">{formatPrice(r.amount)}</p>
      </div>

      <section aria-labelledby={`photos-${r.id}`} className="flex flex-col gap-2">
        <h3 id={`photos-${r.id}`} className="text-label">
          Customer photos
        </h3>
        {photos.length > 0 ? (
          <ul className="grid grid-cols-3 gap-2">
            {photos.map((n) => (
              <li key={n} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-md bg-surface-sunken text-fg-muted shadow-flat">
                <ImageIcon aria-hidden className="size-icon-base" />
                <span className="text-caption">Photo {n}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-caption text-fg-muted">No photos attached. Ask for photos before approving damage or quality claims.</p>
        )}
      </section>

      <DescriptionList
        layout="stacked"
        size="sm"
        items={[
          { key: "reason", term: "Reason", description: r.reason },
          { key: "note", term: "Customer note", description: `“${r.customerNote}”` },
          { key: "requested", term: "Requested", description: adminDateTime(r.requestedAt) },
        ]}
      />

      {r.status === "approved" && (
        <fieldset className="flex flex-col gap-2">
          <legend className="pb-2 text-label">Reverse pickup slot</legend>
          <RadioCardGroup value={slot} onValueChange={setSlot} className="grid-cols-2 gap-2" aria-label="Reverse pickup slot">
            {pickupSlots.map((s) => (
              <RadioCard key={s.id} value={s.id} size="sm" indicator={false} title={s.time} description={s.day} className="flex-col items-start gap-0" />
            ))}
          </RadioCardGroup>
          <p className="text-caption text-fg-muted">Delhivery collects the parcel and the customer gets the slot by SMS.</p>
        </fieldset>
      )}

      {r.status === "pickup-scheduled" && (
        <Inset size="sm" className="flex items-start gap-2.5">
          <Truck aria-hidden className="mt-0.5 size-icon-md shrink-0 text-fg-muted" />
          <p className="text-body">
            Delhivery reverse pickup, <span className="text-body-strong">{slotLabel(r.pickupSlot)}</span>. Mark it received after the quality check.
          </p>
        </Inset>
      )}

      {r.status === "received" && (
        <div className="flex flex-col gap-4">
          {r.resolution === "exchange" && (
            <Alert tone="info" size="sm">
              The customer asked for an exchange. Refund only if the replacement size is out of stock.
            </Alert>
          )}
          <Field label="Refund amount" required error={amountError} hint={`Up to ${formatPrice(r.amount)}`} id={`refund-amount-${r.id}`}>
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} onBlur={() => setAmountTouched(true)} inputMode="decimal" startSlot={<span className="text-body text-fg-muted">₹</span>} className="figures" />
          </Field>
          <fieldset className="flex flex-col gap-2">
            <legend className="pb-2 text-label">Refund to</legend>
            <RadioCardGroup value={method} onValueChange={(v) => setMethod(v as RefundMethod)} className="gap-2" aria-label="Refund to">
              <RadioCard value="source" size="sm" title={refundMethodLabel.source} description={`${r.paymentMode === "COD" ? "Bank account via UPI" : r.paymentMode} · 5–7 working days`} />
              <RadioCard value="store-credit" size="sm" title={refundMethodLabel["store-credit"]} description="Instant · usable on the next order" />
            </RadioCardGroup>
          </fieldset>
        </div>
      )}

      {r.status === "refunded" && r.refund && (
        <Alert tone="success" size="sm" title={`Refunded ${formatPrice(r.refund.amount)}`}>
          {refundMethodLabel[r.refund.method]}
          {r.refund.method === "source" ? ", reaches the customer in 5–7 working days." : ", available now."}
        </Alert>
      )}

      {r.status === "rejected" && (
        <Alert tone="neutral" size="sm" title="Return rejected">
          {r.rejectReason ?? "Rejected after review."}
        </Alert>
      )}

      <section aria-labelledby={`timeline-${r.id}`} className="flex flex-col gap-3">
        <h3 id={`timeline-${r.id}`} className="text-label">
          Timeline
        </h3>
        <ActivityFeed items={r.log.map((l) => ({ id: l.id, actor: l.actor, action: l.action, at: l.at, icon: logIcon[l.kind], tone: logTone[l.kind] }))} formatTime={(iso) => adminRelative(iso, ADMIN_TODAY)} />
      </section>
    </DetailPanel>
  );
}
