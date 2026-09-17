"use client";

import { useId, useState } from "react";
import { ArrowLeft, CircleCheck, RefreshCw, RotateCcw, Undo2 } from "lucide-react";
import { ProductImage } from "@/components/commerce/product-image";
import { DeliverySlotPicker, type DeliverySlotValue } from "@/components/checkout/delivery-slot-picker";
import { SizeSelector } from "@/components/product/size-selector";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { FileUpload, type UploadItem } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Inset } from "@/components/ui/inset";
import { RadioCard, RadioCardGroup, selectableCardClass } from "@/components/ui/radio-card";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { Steps } from "@/components/ui/steps";
import { cn } from "@/lib/cn";
import { formatDate, formatPrice } from "@/lib/format";
import type { OrderLine } from "@/lib/orders";

export const returnReasons = [
  { id: "size-small", label: "Size too small", exchange: true },
  { id: "size-large", label: "Size too large", exchange: true },
  { id: "damaged", label: "Damaged or defective", photos: true },
  { id: "wrong", label: "Received a different item", photos: true },
  { id: "quality", label: "Quality not as expected" },
  { id: "changed-mind", label: "Changed my mind" },
];

export type ReturnRequest = {
  items: { productId: string; size?: string }[];
  reason: string;
  resolution: "refund" | "exchange";
  exchangeSize?: string;
  pickup: { date: string; slot: string };
  refundTo: "original" | "bank";
  bank?: { account: string; ifsc: string; name: string };
  photos: File[];
};

export type ReturnExchangeFlowProps = {
  orderId: string;
  lines: OrderLine[];
  /** yyyy-mm-dd last day to return. */
  deadline: string;
  isCod?: boolean;
  paymentMethod: string;
  pickupAddress: string;
  trigger?: React.ReactElement;
  onSubmit: (request: ReturnRequest) => Promise<void>;
};

const STEPS = ["Items", "Reason", "Resolution", "Pickup", "Review"];

/**
 * Guided return or exchange in one dialog: pick items → reason (photos for damage) → exchange a
 * size or refund (COD orders add bank details) → pickup slot → review. Each step validates
 * before moving on; Back keeps what was entered.
 */
export function ReturnExchangeFlow({ orderId, lines, deadline, isCod = false, paymentMethod, pickupAddress, trigger, onSubmit }: ReturnExchangeFlowProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>(lines.length === 1 ? [lines[0]!.productId] : []);
  const [reason, setReason] = useState("");
  const [photos, setPhotos] = useState<UploadItem[]>([]);
  const [resolution, setResolution] = useState<"refund" | "exchange">("refund");
  const [exchangeSize, setExchangeSize] = useState<string>();
  const [slot, setSlot] = useState<DeliverySlotValue>(null);
  const [refundTo, setRefundTo] = useState<"original" | "bank">(isCod ? "bank" : "original");
  const [bank, setBank] = useState({ account: "", ifsc: "", name: "" });
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const chosenLines = lines.filter((l) => selected.includes(l.productId));
  const reasonInfo = returnReasons.find((r) => r.id === reason);
  const refundAmount = chosenLines.reduce((n, l) => n + l.price * l.quantity, 0);
  const exchangeLine = chosenLines.length === 1 && chosenLines[0]!.product.sizes?.length ? chosenLines[0]! : null;

  function reset() {
    setStep(0);
    setSelected(lines.length === 1 ? [lines[0]!.productId] : []);
    setReason("");
    setPhotos([]);
    setResolution("refund");
    setExchangeSize(undefined);
    setSlot(null);
    setRefundTo(isCod ? "bank" : "original");
    setBank({ account: "", ifsc: "", name: "" });
    setError(undefined);
    setDone(false);
  }

  function validate(s: number) {
    if (s === 0 && selected.length === 0) return "Select at least one item";
    if (s === 1 && !reason) return "Choose a reason";
    if (s === 1 && reasonInfo?.photos && photos.length === 0) return "Add a photo of the problem so we can approve the return quickly";
    if (s === 2 && resolution === "exchange" && !exchangeSize) return "Choose the size you want instead";
    if (s === 2 && resolution === "refund" && refundTo === "bank") {
      if (!/^\d{9,18}$/.test(bank.account)) return "Enter a valid bank account number";
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bank.ifsc.toUpperCase())) return "Enter a valid 11-character IFSC code";
      if (bank.name.trim().length < 2) return "Enter the account holder’s name";
    }
    if (s === 3 && !slot) return "Choose a pickup slot";
  }

  function next() {
    const err = validate(step);
    if (err) return setError(err);
    setError(undefined);
    setStep((s) => s + 1);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (busy) return;
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="secondary" size="sm" leadingIcon={<RotateCcw aria-hidden />}>
            Return or exchange
          </Button>
        )}
      </DialogTrigger>
      <DialogContent size="lg">
        {done ? (
          <>
            <DialogHeader
              icon={<CircleCheck />}
              title={resolution === "exchange" ? "Exchange requested" : "Return requested"}
              description={`Pickup on ${slot ? formatDate(`${slot.date}T12:00:00`, { weekday: "long", day: "numeric", month: "long" }) : "the chosen day"}. Keep the item in its original packaging with tags attached.`}
            />
            <DialogBody className="py-4 text-body text-fg-muted">
              {resolution === "exchange"
                ? `Your new size ships as soon as the pickup is done.`
                : `${formatPrice(refundAmount)} is refunded ${refundTo === "bank" ? "to your bank account" : `to ${paymentMethod}`} after a quality check, usually within 2 days of pickup.`}
            </DialogBody>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <form
            noValidate
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={async (e) => {
              e.preventDefault();
              if (step < STEPS.length - 1) return next();
              setBusy(true);
              try {
                await onSubmit({
                  items: chosenLines.map((l) => ({ productId: l.productId, size: l.size })),
                  reason,
                  resolution,
                  exchangeSize,
                  pickup: slot!,
                  refundTo,
                  bank: refundTo === "bank" ? { ...bank, ifsc: bank.ifsc.toUpperCase() } : undefined,
                  photos: photos.map((p) => p.file),
                });
                setDone(true);
              } catch {
                setError("Couldn’t submit the request. Try again.");
              } finally {
                setBusy(false);
              }
            }}
          >
            <DialogHeader title={`Return or exchange · ${orderId}`} description={`Eligible until ${formatDate(deadline, { day: "numeric", month: "long" })}`} />
            <DialogBody className="flex flex-col gap-5">
              <Steps steps={STEPS.map((s) => ({ id: s, label: s }))} current={step} size="sm" aria-label="Return steps" />

              {step === 0 && (
                <fieldset className="flex flex-col gap-3">
                  <legend className="mb-2 text-label">Which items?</legend>
                  {lines.map((l) => (
                    <label key={l.productId} data-state={selected.includes(l.productId) ? "checked" : "unchecked"} className={cn(selectableCardClass, "cursor-pointer items-center gap-3 p-3")}>
                      <Checkbox
                        aria-label={`Return ${l.product.name}`}
                        checked={selected.includes(l.productId)}
                        onCheckedChange={(v) => setSelected((s) => (v === true ? [...s, l.productId] : s.filter((x) => x !== l.productId)))}
                      />
                      <ProductImage src={l.product.images[0]!} alt="" sizes="56px" wrapperClassName="size-14 shrink-0 rounded-md" />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-body-strong">{l.product.name}</span>
                        <span className="text-caption text-fg-muted figures">{[l.size && `Size ${l.size}`, `Qty ${l.quantity}`, formatPrice(l.price * l.quantity)].filter(Boolean).join(" · ")}</span>
                      </span>
                    </label>
                  ))}
                </fieldset>
              )}

              {step === 1 && (
                <>
                  <fieldset className="flex flex-col gap-3">
                    <legend className="mb-2 text-label">What’s the reason?</legend>
                    <RadioGroup aria-label="Return reason" value={reason} onValueChange={(v) => { setReason(v); setError(undefined); if (!returnReasons.find((r) => r.id === v)?.exchange) setResolution("refund"); }}>
                      {returnReasons.map((r) => (
                        <Radio key={r.id} value={r.id} label={r.label} />
                      ))}
                    </RadioGroup>
                  </fieldset>
                  {reasonInfo?.photos && (
                    <Field label="Photos of the problem" hint="Up to 4 photos · required for damaged or wrong items" required>
                      <FileUpload accept="image/*" maxFiles={4} variant="button" value={photos} onValueChange={setPhotos} />
                    </Field>
                  )}
                </>
              )}

              {step === 2 && (
                <>
                  <RadioCardGroup aria-label="Resolution" value={resolution} onValueChange={(v) => setResolution(v as "refund" | "exchange")} className="sm:grid-cols-2">
                    <RadioCard value="refund" icon={<Undo2 aria-hidden />} title="Refund" description={formatPrice(refundAmount)} />
                    <RadioCard value="exchange" icon={<RefreshCw aria-hidden />} title="Exchange" description={exchangeLine && reasonInfo?.exchange ? "Same item, different size" : "For size issues on one item"} disabled={!exchangeLine || !reasonInfo?.exchange} />
                  </RadioCardGroup>
                  {resolution === "exchange" && exchangeLine && (
                    <SizeSelector
                      label="New size"
                      sizes={exchangeLine.product.sizes!.filter((s) => s !== exchangeLine.size).map((s, i) => ({ value: s, stock: i === 0 ? 0 : 6 }))}
                      value={exchangeSize}
                      onValueChange={setExchangeSize}
                    />
                  )}
                  {resolution === "refund" && (
                    <fieldset className="flex flex-col gap-3">
                      <legend className="mb-2 text-label">Refund to</legend>
                      <RadioGroup aria-label="Refund destination" value={refundTo} onValueChange={(v) => setRefundTo(v as "original" | "bank")}>
                        {!isCod && <Radio value="original" label={paymentMethod} description="Original payment method · 2–5 days after pickup" />}
                        <Radio value="bank" label="Bank account (NEFT / IMPS)" description={isCod ? "Cash on Delivery orders are refunded to a bank account" : "1–2 days after pickup"} />
                      </RadioGroup>
                      {refundTo === "bank" && (
                        <div className="grid animate-fade-in gap-3 sm:grid-cols-2">
                          <Field id={`${id}-acc`} label="Account number">
                            <Input inputMode="numeric" autoComplete="off" value={bank.account} onChange={(e) => setBank((b) => ({ ...b, account: e.target.value.replace(/\D/g, "").slice(0, 18) }))} className="figures" />
                          </Field>
                          <Field id={`${id}-ifsc`} label="IFSC code">
                            <Input autoComplete="off" value={bank.ifsc} onChange={(e) => setBank((b) => ({ ...b, ifsc: e.target.value.toUpperCase().slice(0, 11) }))} placeholder="HDFC0001234" className="uppercase" />
                          </Field>
                          <Field id={`${id}-holder`} label="Account holder name" className="sm:col-span-2">
                            <Input autoComplete="name" value={bank.name} onChange={(e) => setBank((b) => ({ ...b, name: e.target.value }))} />
                          </Field>
                        </div>
                      )}
                    </fieldset>
                  )}
                </>
              )}

              {step === 3 && (
                <>
                  <Inset size="sm" asChild>
                    <p className="text-body">
                      <span className="block text-caption text-fg-muted">Pickup from</span>
                      {pickupAddress}
                    </p>
                  </Inset>
                  <DeliverySlotPicker value={slot} onValueChange={setSlot} startInDays={1} days={4} slots={[{ id: "morning", label: "Morning", time: "9 AM – 1 PM" }, { id: "afternoon", label: "Afternoon", time: "1 – 6 PM" }]} />
                </>
              )}

              {step === 4 && (
                <Inset asChild>
                  <dl className="flex flex-col gap-3 text-body">
                    <div className="flex justify-between gap-4">
                      <dt className="text-fg-muted">Items</dt>
                      <dd className="text-right">{chosenLines.map((l) => l.product.name).join(", ")}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-fg-muted">Reason</dt>
                      <dd className="text-right">{reasonInfo?.label}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-fg-muted">Resolution</dt>
                      <dd className="text-right">{resolution === "exchange" ? `Exchange for size ${exchangeSize}` : `Refund ${formatPrice(refundAmount)} to ${refundTo === "bank" ? `bank •• ${bank.account.slice(-4)}` : paymentMethod}`}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-fg-muted">Pickup</dt>
                      <dd className="text-right">{slot && formatDate(`${slot.date}T12:00:00`, { weekday: "short", day: "numeric", month: "short" })} · {slot?.slot === "morning" ? "9 AM – 1 PM" : "1 – 6 PM"}</dd>
                    </div>
                  </dl>
                </Inset>
              )}

              {error && (
                <p role="alert" className="text-caption text-danger-fg">
                  {error}
                </p>
              )}
            </DialogBody>
            <DialogFooter className="border-t border-border-subtle pt-4">
              {step > 0 ? (
                <Button type="button" variant="ghost" leadingIcon={<ArrowLeft aria-hidden />} onClick={() => { setError(undefined); setStep((s) => s - 1); }} disabled={busy}>
                  Back
                </Button>
              ) : (
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              )}
              <Button type="submit" loading={busy}>
                {step < STEPS.length - 1 ? "Continue" : resolution === "exchange" ? "Request exchange" : "Request return"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
