"use client";

import { useId, useState } from "react";
import { Banknote, CircleAlert, MapPin, RotateCcw, Truck } from "lucide-react";
import { deliveryLocation, useDeliveryLocation } from "@/components/providers/location-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { isValidPincode, PincodeInput } from "@/components/ui/pincode-input";
import { cn } from "@/lib/cn";
import { LOCALE, TIME_ZONE } from "@/lib/format";
import { useHydrated } from "@/lib/use-hydrated";
import type { PincodeInfo } from "@/lib/data/types";

export type PincodeDeliveryCheckProps = {
  lookup: (pin: string) => PincodeInfo | undefined | Promise<PincodeInfo | undefined>;
  /** Product's own handling time added to the PIN's transit days. */
  productDays?: number;
  returnDays?: number;
  /** Product-level COD eligibility (high-value or digital items may not allow it). */
  codEligible?: boolean;
  className?: string;
};

function deliveryDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return new Intl.DateTimeFormat(LOCALE, { weekday: "short", day: "numeric", month: "short", timeZone: TIME_ZONE }).format(d);
}

/**
 * "Deliver to 560066 · Delivery by Wed, 17 Sept · COD available". Uses the stored delivery PIN
 * (shared with the header) and computes the date only after hydration so it is never stale.
 */
export function PincodeDeliveryCheck({ lookup, productDays = 0, returnDays = 14, codEligible = true, className }: PincodeDeliveryCheckProps) {
  const id = useId();
  const hydrated = useHydrated();
  const location = useDeliveryLocation();
  const [editing, setEditing] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string>();
  const [checking, setChecking] = useState(false);
  const [info, setInfo] = useState<PincodeInfo | undefined>();

  // Resolve the stored PIN synchronously when possible (demo lookups are sync)
  const storedInfo = !info && location ? (lookup(location.pincode) as PincodeInfo | undefined) : undefined;
  const current = info ?? (storedInfo && !(storedInfo instanceof Promise) ? storedInfo : undefined);

  async function check(value = pin) {
    if (!isValidPincode(value)) return setError("Enter a valid 6-digit PIN code");
    setChecking(true);
    const found = await lookup(value);
    setChecking(false);
    if (!found) return setError(`We couldn’t find ${value}. Check the PIN code.`);
    setError(undefined);
    setInfo(found);
    setEditing(false);
    deliveryLocation.set({ pincode: found.pincode, city: found.city, state: found.state });
  }

  const showForm = hydrated && (editing || !location);

  return (
    <Card asChild variant="outline" padding="sm" radius="xl" className={cn("gap-4", className)}>
    <section data-slot="pincode-delivery-check" aria-label="Delivery options">
      {showForm ? (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void check();
          }}
        >
          <Field id={`${id}-pin`} label="Check delivery" error={error} hint={error ? undefined : "Enter your PIN code for delivery date and Cash on Delivery"}>
            <div className="flex gap-2">
              <PincodeInput
                value={pin}
                onValueChange={(v) => {
                  setPin(v);
                  if (error) setError(undefined);
                }}
                onComplete={(v) => void check(v)}
              />
              <Button type="submit" variant="secondary" loading={checking}>
                Check
              </Button>
            </div>
          </Field>
        </form>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-body">
            <MapPin aria-hidden className="size-icon-md text-accent-fg" />
            {hydrated && location ? (
              <span>
                Deliver to <span className="font-medium figures">{location.city} {location.pincode}</span>
              </span>
            ) : (
              <span className="text-fg-muted">Checking delivery…</span>
            )}
          </p>
          {hydrated && (
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                setPin(location?.pincode ?? "");
                setEditing(true);
              }}
            >
              Change
            </Button>
          )}
        </div>
      )}

      {hydrated && current && !showForm && (
        <ul aria-live="polite" className="flex flex-col gap-3 text-body">
          {current.serviceable ? (
            <>
              <li className="flex items-start gap-3">
                <Truck aria-hidden className="mt-0.5 size-icon-md shrink-0 text-fg-muted" />
                <span>
                  Delivery by <span className="font-medium">{deliveryDate(current.etaDays + productDays)}</span>
                  <span className="block text-caption text-fg-muted">Free above ₹499 · order in the next few hours for this date</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Banknote aria-hidden className="mt-0.5 size-icon-md shrink-0 text-fg-muted" />
                {current.cod && codEligible ? <span>Cash on Delivery available</span> : <span className="text-fg-muted">Cash on Delivery not available for this PIN code</span>}
              </li>
              <li className="flex items-start gap-3">
                <RotateCcw aria-hidden className="mt-0.5 size-icon-md shrink-0 text-fg-muted" />
                <span>{returnDays}-day return and exchange</span>
              </li>
            </>
          ) : (
            <li role="alert" className="flex items-start gap-3 text-danger-fg">
              <CircleAlert aria-hidden className="mt-0.5 size-icon-md shrink-0" />
              We don’t deliver to {current.city} ({current.pincode}) yet. Try another PIN code.
            </li>
          )}
        </ul>
      )}
    </section>
    </Card>
  );
}
