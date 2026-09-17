"use client";

import { useState } from "react";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ADMIN_TODAY } from "@/lib/data/admin";
import { couriers, validateAwb } from "./order-helpers";

export type ShipDetails = { courier: string; awb: string; pickupDate: string };

export type ShipOrderDialogProps = {
  orderId: string;
  pincode: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShip: (details: ShipDetails) => void;
};

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const maxPickup = new Date(ADMIN_TODAY.getFullYear(), ADMIN_TODAY.getMonth(), ADMIN_TODAY.getDate() + 6);

/** Hand a packed order to a courier: courier, AWB (validated) and pickup date. */
export function ShipOrderDialog({ orderId, pincode, open, onOpenChange, onShip }: ShipOrderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        {/* Mounted per open, so every shipment starts from a clean form */}
        <ShipOrderForm orderId={orderId} pincode={pincode} onShip={onShip} />
      </DialogContent>
    </Dialog>
  );
}

function ShipOrderForm({ orderId, pincode, onShip }: Pick<ShipOrderDialogProps, "orderId" | "pincode" | "onShip">) {
  const [courier, setCourier] = useState("");
  const [awb, setAwb] = useState("");
  const [pickup, setPickup] = useState<Date>(ADMIN_TODAY);
  const [touched, setTouched] = useState({ courier: false, awb: false });
  const [saving, setSaving] = useState(false);

  const courierError = touched.courier && !courier ? "Choose the courier that will pick up this parcel." : undefined;
  const awbError = touched.awb ? validateAwb(awb) : undefined;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ courier: true, awb: true });
    if (!courier || validateAwb(awb)) {
      document.getElementById(!courier ? "ship-courier" : "ship-awb")?.focus();
      return;
    }
    setSaving(true);
    window.setTimeout(() => onShip({ courier, awb: awb.trim().toUpperCase(), pickupDate: iso(pickup) }), 500);
  }

  return (
    <form onSubmit={submit} noValidate className="flex min-h-0 flex-col">
      <DialogHeader title={`Ship ${orderId}`} description={`Assign a courier and AWB. The customer gets tracking by SMS and email once the parcel is picked up. Delivering to PIN code ${pincode}.`} icon={<Truck aria-hidden />} />
      <DialogBody className="flex flex-col gap-4">
        <Field label="Courier" required error={courierError} id="ship-courier">
          <Select
            value={courier}
            onValueChange={(v) => {
              setCourier(v);
              setTouched((t) => ({ ...t, courier: true }));
            }}
            placeholder="Choose a courier"
            options={couriers.map((c) => ({ value: c, label: c }))}
            disabled={saving}
          />
        </Field>
        <Field label="AWB number" required error={awbError} hint="Printed under the barcode on the courier label." id="ship-awb">
          <Input
            value={awb}
            onChange={(e) => setAwb(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, awb: true }))}
            placeholder="e.g. 1234567890123"
            autoComplete="off"
            spellCheck={false}
            inputMode="text"
            className="text-code"
            disabled={saving}
          />
        </Field>
        <Field label="Pickup date" hint="Couriers pick up between 10 am and 6 pm." id="ship-pickup">
          <DatePicker value={pickup} onValueChange={setPickup} min={ADMIN_TODAY} max={maxPickup} defaultMonth={ADMIN_TODAY} disabled={saving} />
        </Field>
      </DialogBody>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary" disabled={saving}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" loading={saving} leadingIcon={<Truck aria-hidden />}>
          Ship order
        </Button>
      </DialogFooter>
    </form>
  );
}
