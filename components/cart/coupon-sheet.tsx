"use client";

import { useState } from "react";
import { ChevronRight, Ticket } from "lucide-react";
import { CouponCard, couponStatus } from "@/components/product/coupon-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { Input } from "@/components/ui/input";
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { couponSavings } from "@/lib/data/india";
import type { Coupon } from "@/lib/data/types";

export type CouponSheetProps = {
  coupons: Coupon[];
  subtotal: number;
  /** yyyy-mm-dd from the server for expiry checks. */
  today: string;
  appliedCode: string | null;
  onApply: (code: string | null) => void;
  /** Custom trigger; defaults to an "Apply coupon" row with the applied state. */
  trigger?: React.ReactElement;
};

/**
 * Coupon picker: enter a code or choose from the list (best saving first, unavailable ones
 * explained), then apply with the exact saving on the button.
 */
export function CouponSheet({ coupons, subtotal, today, appliedCode, onApply, trigger }: CouponSheetProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(appliedCode);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();

  const ranked = [...coupons].sort((a, b) => {
    const sa = couponStatus(a, subtotal, today, false) === "available" ? couponSavings(a, subtotal) : -1;
    const sb = couponStatus(b, subtotal, today, false) === "available" ? couponSavings(b, subtotal) : -1;
    return sb - sa;
  });
  const chosen = coupons.find((c) => c.code === selected);
  const saving = chosen ? couponSavings(chosen, subtotal) : 0;
  const applied = coupons.find((c) => c.code === appliedCode);

  function checkCode() {
    const found = coupons.find((c) => c.code === code.trim().toUpperCase());
    if (!found) return setError("This coupon code isn’t valid");
    const status = couponStatus(found, subtotal, today, false);
    if (status === "expired") return setError(`${found.code} has expired`);
    if (status === "locked") return setError(`Add ${formatPrice(found.minOrder - subtotal)} more to use ${found.code}`);
    setError(undefined);
    setSelected(found.code);
    setCode("");
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) setSelected(appliedCode);
      }}
    >
      <SheetTrigger asChild>
        {trigger ?? (
          <Card asChild variant="outline" padding="sm" className="state-layer w-full flex-row items-center text-left">
            <button type="button">
              <IconTile size="md" tone="accent">
                <Ticket className="-rotate-45" />
              </IconTile>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-title">{applied ? `${applied.code} applied` : "Apply coupon"}</span>
                <span className={cn("text-caption", applied ? "text-success-fg" : "text-fg-muted")}>
                  {applied ? `You save ${formatPrice(couponSavings(applied, subtotal))}` : `${coupons.filter((c) => couponStatus(c, subtotal, today, false) === "available").length} coupons available`}
                </span>
              </span>
              <ChevronRight aria-hidden className="size-icon-md text-fg-muted" />
            </button>
          </Card>
        )}
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader title="Apply coupon" description={`For your bag of ${formatPrice(subtotal)}`} />
        <SheetBody className="flex flex-col gap-4 pb-4">
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              checkCode();
            }}
            className="flex flex-col gap-1.5"
          >
            <Input
              aria-label="Coupon code"
              placeholder="Enter coupon code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(undefined);
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "coupon-sheet-error" : undefined}
              className="uppercase placeholder:normal-case"
              wrapperClassName="pr-1"
              endSlot={
                <Button type="submit" size="sm" variant="neutral" disabled={!code.trim()}>
                  Check
                </Button>
              }
            />
            {error && (
              <p id="coupon-sheet-error" role="alert" className="px-4 text-caption text-danger-fg">
                {error}
              </p>
            )}
          </form>
          <ul className="flex flex-col gap-3">
            {ranked.map((c) => (
              <li key={c.code}>
                <CouponCard
                  coupon={c}
                  subtotal={subtotal}
                  today={today}
                  applied={selected === c.code}
                  onApply={(code) => setSelected(code)}
                  onRemove={() => setSelected(null)}
                />
              </li>
            ))}
          </ul>
        </SheetBody>
        <SheetFooter className="flex-row items-center">
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-caption text-fg-muted">Coupon savings</span>
            <span className="text-heading-sm text-success-fg figures">{formatPrice(saving)}</span>
          </div>
          <Button
            size="lg"
            onClick={() => {
              onApply(selected);
              setOpen(false);
            }}
          >
            {selected ? "Apply" : appliedCode ? "Remove coupon" : "Done"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
