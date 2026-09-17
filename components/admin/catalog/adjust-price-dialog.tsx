"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Inset } from "@/components/ui/inset";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import type { AdminProduct } from "@/lib/data/admin";
import { formatPrice } from "@/lib/format";

/** New selling price: never above MRP, never below ₹1; optionally rounded to end in 9 (₹1,299). */
export function adjustedPrice(p: Pick<AdminProduct, "price" | "mrp">, percent: number, roundTo9: boolean) {
  const raw = p.price * (1 + percent / 100);
  const rounded = roundTo9 ? Math.max(9, Math.round(raw / 10) * 10 - 1) : Math.round(raw);
  return Math.max(1, Math.min(p.mrp, rounded));
}

export type AdjustPriceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: AdminProduct[];
  onApply: (percent: number, roundTo9: boolean) => void;
};

/** Bulk price change by a percentage on the selling price. MRP stays as printed. */
export function AdjustPriceDialog({ open, onOpenChange, products, onApply }: AdjustPriceDialogProps) {
  const [direction, setDirection] = useState<"decrease" | "increase">("decrease");
  const [value, setValue] = useState("10");
  const [roundTo9, setRoundTo9] = useState(true);
  const [touched, setTouched] = useState(false);

  const n = Number(value);
  const error = !/^\d+(\.\d+)?$/.test(value.trim()) || n <= 0 ? "Enter a percentage above 0" : n > 90 ? "Keep the change at 90% or less" : undefined;
  const percent = direction === "increase" ? n : -n;
  const sample = products.slice(0, 3);
  const capped = !error && products.some((p) => p.price * (1 + percent / 100) > p.mrp);

  function close(next: boolean) {
    onOpenChange(next);
    if (!next) {
      setTouched(false);
      setValue("10");
      setDirection("decrease");
    }
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent size="sm">
        <form
          className="flex min-h-0 flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (error) return;
            onApply(percent, roundTo9);
            close(false);
          }}
        >
          <DialogHeader title="Adjust prices" description={`Change the selling price of ${products.length} ${products.length === 1 ? "product" : "products"}. MRP stays the same.`} />
          <DialogBody className="flex flex-col gap-4">
            <SegmentedControl
              aria-label="Direction"
              fullWidth
              value={direction}
              onValueChange={(v) => setDirection(v as "decrease" | "increase")}
              options={[
                { value: "decrease", label: "Decrease" },
                { value: "increase", label: "Increase" },
              ]}
            />
            <Field label="By" error={touched ? error : undefined} hint="Percentage of the current selling price">
              <Input inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} endSlot={<span className="text-body text-fg-muted">%</span>} />
            </Field>
            <Switch label="End prices in 9" description="₹1,299 instead of ₹1,300" checked={roundTo9} onCheckedChange={setRoundTo9} />
            {!error && sample.length > 0 && (
              <Inset size="sm" className="flex flex-col gap-2">
                <p className="text-label">Preview</p>
                <ul className="flex flex-col gap-1.5">
                  {sample.map((p) => (
                    <li key={p.id} className="flex items-baseline justify-between gap-3 text-caption">
                      <span className="min-w-0 truncate text-fg-muted">{p.name}</span>
                      <span className="shrink-0 figures">
                        <span className="text-fg-muted line-through">{formatPrice(p.price)}</span> {formatPrice(adjustedPrice(p, percent, roundTo9))}
                      </span>
                    </li>
                  ))}
                </ul>
                {products.length > sample.length && <p className="text-caption text-fg-muted">and {products.length - sample.length} more</p>}
                {capped && <p className="text-caption text-warning-fg">Some prices would pass MRP, so they stop at MRP.</p>}
              </Inset>
            )}
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={() => close(false)}>
              Cancel
            </Button>
            <Button type="submit">Update {products.length} {products.length === 1 ? "price" : "prices"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
