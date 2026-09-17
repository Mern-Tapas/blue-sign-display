"use client";

import { useId, useState } from "react";
import { CircleCheck, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Inset } from "@/components/ui/inset";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/format";

export const cancelReasons = [
  { id: "delay", label: "Delivery is taking too long" },
  { id: "price", label: "Found a better price elsewhere" },
  { id: "mistake", label: "Ordered by mistake" },
  { id: "change", label: "Want to change size, colour or address" },
  { id: "other", label: "Other reason" },
];

export type CancelOrderDialogProps = {
  orderId: string;
  amount: number;
  /** "UPI · sujon@okaxis", "Cash on Delivery". */
  paymentMethod: string;
  isCod?: boolean;
  trigger?: React.ReactElement;
  onConfirm: (input: { reason: string; comment: string }) => Promise<void>;
};

/**
 * Cancellation with a required reason, an optional comment, and a plain statement of what
 * happens to the money before the shopper confirms. "Change size/address" suggests the
 * alternative instead of losing the order.
 */
export function CancelOrderDialog({ orderId, amount, paymentMethod, isCod = false, trigger, onConfirm }: CancelOrderDialogProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (busy) return;
        setOpen(o);
        if (!o) {
          setReason("");
          setComment("");
          setError(undefined);
          setDone(false);
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="secondary" size="sm" leadingIcon={<PackageX aria-hidden />}>
            Cancel order
          </Button>
        )}
      </DialogTrigger>
      <DialogContent size="md">
        {done ? (
          <>
            <DialogHeader icon={<CircleCheck />} title="Order cancelled" description={isCod ? "Nothing was charged for this order." : `${formatPrice(amount)} will be refunded to ${paymentMethod} within 5–7 working days.`} />
            <DialogFooter className="pt-5">
              <Button onClick={() => setOpen(false)}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <form
            noValidate
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!reason) return setError("Choose a reason so we can improve");
              setBusy(true);
              try {
                await onConfirm({ reason, comment: comment.trim() });
                setDone(true);
              } catch {
                setError("Couldn’t cancel right now. The order may already be out for delivery.");
              } finally {
                setBusy(false);
              }
            }}
          >
            <DialogHeader title={`Cancel order ${orderId}?`} description="This cancels every item in the order." />
            <DialogBody className="flex flex-col gap-5">
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-2 text-label">
                  Why are you cancelling? <span className="text-danger-fg">*</span>
                </legend>
                <RadioGroup
                  aria-label="Cancellation reason"
                  aria-describedby={error ? `${id}-error` : undefined}
                  value={reason}
                  onValueChange={(v) => {
                    setReason(v);
                    setError(undefined);
                  }}
                >
                  {cancelReasons.map((r) => (
                    <Radio key={r.id} value={r.id} label={r.label} description={r.id === "change" ? "You can change the address from order details, or reorder with a different size after cancelling." : undefined} />
                  ))}
                </RadioGroup>
                {error && (
                  <p id={`${id}-error`} role="alert" className="text-caption text-danger-fg">
                    {error}
                  </p>
                )}
              </fieldset>
              <Field label="Anything else? (optional)">
                <Textarea rows={3} maxLength={300} value={comment} onChange={(e) => setComment(e.target.value)} />
              </Field>
              <Inset size="sm" asChild>
                <p className="text-body text-fg-muted">
                  {isCod ? (
                    "This was a Cash on Delivery order, so there’s nothing to refund."
                  ) : (
                    <>
                      Refund of <span className="font-medium text-fg figures">{formatPrice(amount)}</span> goes back to {paymentMethod} within 5–7 working days of cancelling.
                    </>
                  )}
                </p>
              </Inset>
            </DialogBody>
            <DialogFooter className="border-t border-border-subtle pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={busy}>
                Keep order
              </Button>
              <Button type="submit" variant="danger" loading={busy}>
                Cancel order
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
