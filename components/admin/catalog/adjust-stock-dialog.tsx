"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Inset } from "@/components/ui/inset";
import { NumberInput } from "@/components/ui/number-input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import type { InventoryRow } from "./catalog-data";

export type StockReason = "received" | "damaged" | "correction";

export const stockReasons: Record<StockReason, { label: string; direction?: "add" | "remove" }> = {
  received: { label: "Received from supplier", direction: "add" },
  damaged: { label: "Damaged or expired", direction: "remove" },
  correction: { label: "Count correction" },
};

export type StockAdjustment = { delta: number; reason: StockReason; note: string };

export type AdjustStockDialogProps = {
  row: InventoryRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (row: InventoryRow, adjustment: StockAdjustment) => void;
};

/** Change on-hand units for one SKU with a reason, so the adjustment log explains every change. */
export function AdjustStockDialog({ row, open, onOpenChange, onSave }: AdjustStockDialogProps) {
  const [reason, setReason] = useState<StockReason>("received");
  const [direction, setDirection] = useState<"add" | "remove">("add");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [attempted, setAttempted] = useState(false);

  const dir = stockReasons[reason].direction ?? direction;
  const onHand = row?.onHand ?? 0;
  const next = dir === "add" ? onHand + quantity : onHand - quantity;
  const errors = {
    quantity: next < 0 ? `Only ${formatNumber(onHand)} on hand. Remove ${formatNumber(onHand)} or fewer.` : undefined,
    note: reason === "correction" && !note.trim() ? "Say why the count changed, for the adjustment log." : undefined,
  };
  const invalid = Boolean(errors.quantity || errors.note);

  function close(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setReason("received");
      setDirection("add");
      setQuantity(1);
      setNote("");
      setAttempted(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent size="sm">
        {row && (
          <form
            className="flex min-h-0 flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              setAttempted(true);
              if (invalid) return;
              onSave(row, { delta: dir === "add" ? quantity : -quantity, reason, note: note.trim() });
              close(false);
            }}
          >
            <DialogHeader title="Adjust stock" description={`${row.productName}${row.variant === "Default" ? "" : ` · ${row.variant}`}`} />
            <DialogBody className="flex flex-col gap-4">
              <p className="-mt-2 text-code text-fg-muted">{row.sku}</p>
              <Field label="Reason" required>
                <Select value={reason} onValueChange={(v) => setReason(v as StockReason)} options={(Object.keys(stockReasons) as StockReason[]).map((r) => ({ value: r, label: stockReasons[r].label }))} />
              </Field>
              {reason === "correction" && (
                <SegmentedControl
                  aria-label="Add or remove units"
                  fullWidth
                  value={direction}
                  onValueChange={(v) => setDirection(v as "add" | "remove")}
                  options={[
                    { value: "add", label: "Add units" },
                    { value: "remove", label: "Remove units" },
                  ]}
                />
              )}
              <Field label={dir === "add" ? "Units to add" : "Units to remove"} error={errors.quantity} required>
                <div className="flex flex-wrap items-center gap-2">
                  <NumberInput
                    value={quantity}
                    onValueChange={(v) => setQuantity(v ?? 1)}
                    min={1}
                    max={9999}
                    stepper="inline"
                    aria-label={dir === "add" ? "Units to add" : "Units to remove"}
                    wrapperClassName="w-36"
                  />
                  <span className="text-caption text-fg-muted">or</span>
                  {[5, 10, 25].map((n) => (
                    <Button key={n} variant="secondary" size="sm" onClick={() => setQuantity(n)} aria-label={`Set to ${n} units`} className="figures">
                      {n}
                    </Button>
                  ))}
                </div>
              </Field>
              <Field label="Note" required={reason === "correction"} error={attempted ? errors.note : undefined} hint={reason === "received" ? "Supplier, invoice or GRN number" : undefined}>
                <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder={reason === "received" ? "Invoice TK-2291 from Tiruppur Knits" : reason === "damaged" ? "Crushed box in inward shipment" : "Cycle count on 15 Sep"} />
              </Field>
              <Inset size="sm" className="flex items-center justify-between gap-3" aria-live="polite">
                <span className="text-caption text-fg-muted">On hand after this change</span>
                <span className={cn("text-body-strong figures", next < 0 && "text-danger-fg")}>
                  {formatNumber(onHand)} → {formatNumber(Math.max(next, 0))}
                </span>
              </Inset>
            </DialogBody>
            <DialogFooter>
              <Button variant="secondary" onClick={() => close(false)}>
                Cancel
              </Button>
              <Button type="submit">{dir === "add" ? `Add ${formatNumber(quantity)}` : `Remove ${formatNumber(quantity)}`}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
