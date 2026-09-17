"use client";

import { useId, useState } from "react";
import { ChevronDown, CircleAlert, CircleCheck, LocateFixed, MapPin } from "lucide-react";
import { deliveryLocation, useDeliveryLocation, type DeliveryLocation } from "@/components/providers/location-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Divider } from "@/components/ui/divider";
import { Field } from "@/components/ui/field";
import { Inset } from "@/components/ui/inset";
import { isValidPincode, PincodeInput } from "@/components/ui/pincode-input";
import { RadioCard, RadioCardGroup } from "@/components/ui/radio-card";
import { cn } from "@/lib/cn";
import type { Address, PincodeInfo } from "@/lib/data/types";

export type DeliverToPincodeProps = {
  /** Resolves a PIN to its city and serviceability (API call in production). */
  lookup: (pin: string) => Promise<PincodeInfo | undefined> | PincodeInfo | undefined;
  /** Saved addresses for signed-in shoppers, shown above the PIN field. */
  addresses?: Address[];
  /** Browser location → PIN (reverse geocoding). Omit to hide the button. */
  onDetectLocation?: () => Promise<string | undefined>;
  /** `chip` for the desktop header; `bar` is a full-width strip under the mobile header. */
  appearance?: "chip" | "bar";
  /** Controlled open state (e.g. from navUi when a product page asks for a PIN). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onChange?: (location: DeliveryLocation, info?: PincodeInfo) => void;
  className?: string;
};

/**
 * "Deliver to Bengaluru 560066". Opens a dialog to pick a saved address or check a PIN code;
 * the choice is stored per device and shared with delivery checks and checkout.
 */
export function DeliverToPincode({
  lookup,
  addresses = [],
  onDetectLocation,
  appearance = "chip",
  open: openProp,
  onOpenChange,
  onChange,
  className,
}: DeliverToPincodeProps) {
  const id = useId();
  const location = useDeliveryLocation();
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string; info?: PincodeInfo } | null>(null);
  const [checking, setChecking] = useState(false);
  const [detecting, setDetecting] = useState(false);

  function setOpen(next: boolean) {
    if (openProp === undefined) setOpenState(next);
    onOpenChange?.(next);
    if (next) {
      setPin(location?.addressId ? "" : (location?.pincode ?? ""));
      setStatus(null);
    }
  }

  function choose(loc: DeliveryLocation, info?: PincodeInfo) {
    deliveryLocation.set(loc);
    onChange?.(loc, info);
    setOpen(false);
  }

  async function check(value = pin) {
    if (!isValidPincode(value)) {
      setStatus({ tone: "error", text: "Enter a valid 6-digit PIN code" });
      return;
    }
    setChecking(true);
    const info = await lookup(value);
    setChecking(false);
    if (!info) setStatus({ tone: "error", text: `We couldn’t find ${value}. Check the PIN code and try again.` });
    else if (!info.serviceable) setStatus({ tone: "error", text: `Sorry, we don’t deliver to ${info.city} (${value}) yet.`, info });
    else setStatus({ tone: "success", text: `${info.city}, ${info.state}`, info });
  }

  async function detect() {
    if (!onDetectLocation) return;
    setDetecting(true);
    const found = await onDetectLocation().catch(() => undefined);
    setDetecting(false);
    if (found) {
      setPin(found);
      void check(found);
    } else setStatus({ tone: "error", text: "Couldn’t detect your location. Enter your PIN code instead." });
  }

  const label = location ? `${location.city} ${location.pincode}` : "Select delivery location";
  const trigger =
    appearance === "chip" ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={cn(
          "state-layer relative flex h-control-md max-w-56 items-center gap-2 rounded-pill px-3 text-left",
          className,
        )}
      >
        <MapPin aria-hidden className="size-icon-md shrink-0 text-accent-fg" />
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="text-caption text-fg-muted">Deliver to</span>
          <span className="truncate text-label text-fg figures">{label}</span>
        </span>
        <ChevronDown aria-hidden className="size-icon-sm shrink-0 text-fg-muted" />
      </button>
    ) : (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={cn("flex h-10 w-full items-center gap-2 bg-surface-sunken px-(--gutter) text-left text-label focus-ring-row", className)}
      >
        <MapPin aria-hidden className="size-icon-md shrink-0 text-accent-fg" />
        <span className="min-w-0 flex-1 truncate">
          {location ? (
            <>
              Deliver to <span className="text-fg figures">{label}</span>
            </>
          ) : (
            <span className="text-fg">Select delivery location</span>
          )}
        </span>
        <ChevronDown aria-hidden className="size-icon-sm shrink-0 text-fg-muted" />
      </button>
    );

  return (
    <>
      {trigger}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="sm">
          <DialogHeader title="Choose delivery location" description="Delivery dates, Cash on Delivery and offers depend on where you are." />
          <DialogBody className="flex flex-col gap-5">
            {addresses.length > 0 && (
              <RadioCardGroup
                aria-label="Saved addresses"
                value={location?.addressId ?? ""}
                onValueChange={(addrId) => {
                  const a = addresses.find((x) => x.id === addrId);
                  if (a) choose({ pincode: a.pincode, city: a.city, state: a.state, addressId: a.id, label: a.type === "home" ? "Home" : "Work" });
                }}
              >
                {addresses.map((a) => (
                  <RadioCard
                    key={a.id}
                    value={a.id}
                    title={
                      <span className="flex items-center gap-2">
                        {a.name}
                        <Badge size="sm">{a.type === "home" ? "Home" : "Work"}</Badge>
                      </span>
                    }
                    description={`${a.house}, ${a.locality}, ${a.city} ${a.pincode}`}
                  />
                ))}
              </RadioCardGroup>
            )}
            {addresses.length > 0 && <Divider label="or enter a PIN code" />}
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                void check();
              }}
              className="flex flex-col gap-3"
            >
              <Field id={`${id}-pin`} label="PIN code" error={status?.tone === "error" ? status.text : undefined}>
                <div className="flex gap-2">
                  <PincodeInput
                    value={pin}
                    onValueChange={(v) => {
                      setPin(v);
                      if (status) setStatus(null);
                    }}
                    onComplete={(v) => void check(v)}
                  />
                  <Button type="submit" variant="secondary" loading={checking}>
                    Check
                  </Button>
                </div>
              </Field>
              {status?.tone === "success" && status.info && (
                <Inset tone="success" size="md" role="status" className="flex flex-col gap-3">
                  <p className="flex items-center gap-2 text-body-strong">
                    <CircleCheck aria-hidden className="size-icon-lg shrink-0" />
                    Delivery available · {status.text}
                  </p>
                  <ul className="flex flex-col gap-1 pl-7 text-caption">
                    <li>Usually delivered in {status.info.etaDays} days</li>
                    <li className="flex items-center gap-1">
                      {!status.info.cod && <CircleAlert aria-hidden className="size-icon-sm" />}
                      {status.info.cod ? "Cash on Delivery available" : "Cash on Delivery isn’t available here"}
                    </li>
                  </ul>
                  <Button
                    size="md"
                    onClick={() => choose({ pincode: status.info!.pincode, city: status.info!.city, state: status.info!.state }, status.info)}
                    className="self-start"
                  >
                    Deliver to {status.info.pincode}
                  </Button>
                </Inset>
              )}
              {onDetectLocation && (
                <Button type="button" variant="ghost" leadingIcon={<LocateFixed aria-hidden />} loading={detecting} onClick={detect} className="self-start">
                  Use my current location
                </Button>
              )}
            </form>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}
