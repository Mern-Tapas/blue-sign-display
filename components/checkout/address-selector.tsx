"use client";

import { useState } from "react";
import { RadioGroup } from "radix-ui";
import { CircleAlert, Pencil, Phone, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { RadioIndicator, selectableCardClass } from "@/components/ui/radio-card";
import { formatAddress } from "@/lib/address";
import { cn } from "@/lib/cn";
import { formatPhone } from "@/lib/format";
import type { Address, PincodeInfo } from "@/lib/data/types";
import { AddressDialog } from "./address-dialog";
import type { AddressFormValue } from "./address-form";

/* ---------- Card ---------- */

export type SavedAddressCardProps = {
  address: Address;
  /** Serviceability for this address's PIN. */
  pin?: PincodeInfo;
  selected?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
  /** Rendered inside a RadioGroup (selector) or standalone (address book). */
  selectable?: boolean;
  className?: string;
};

function CardBody({ address: a, pin }: { address: Address; pin?: PincodeInfo }) {
  return (
    <span className="flex min-w-0 flex-1 flex-col gap-1 text-left">
      <span className="flex flex-wrap items-center gap-2">
        <span className="text-body-strong">{a.name}</span>
        <Badge size="sm">{a.type === "home" ? "Home" : "Work"}</Badge>
        {a.isDefault && (
          <Badge size="sm" tone="accent">
            Default
          </Badge>
        )}
      </span>
      <span className="text-body text-fg-muted">{formatAddress(a)}</span>
      <span className="flex items-center gap-1.5 text-body text-fg">
        <Phone aria-hidden className="size-icon-sm text-fg-muted" />
        <span className="figures">{formatPhone(a.mobile)}</span>
      </span>
      {pin && !pin.serviceable && (
        <span className="mt-1 flex items-center gap-1.5 text-caption text-danger-fg">
          <CircleAlert aria-hidden className="size-icon-sm" /> Not deliverable to this PIN code
        </span>
      )}
      {pin?.serviceable && !pin.cod && <span className="mt-1 text-caption text-fg-muted">Cash on Delivery isn’t available here</span>}
    </span>
  );
}

/** One saved address: name, type and default badges, full address, mobile and serviceability. */
export function SavedAddressCard({ address, pin, selected = false, onEdit, onRemove, selectable = false, className }: SavedAddressCardProps) {
  const disabled = pin ? !pin.serviceable : false;
  const actions = (onEdit || onRemove) && (
    <span className="relative z-10 mt-3 flex gap-2 pl-8">
      {onEdit && (
        <Button variant="secondary" size="sm" leadingIcon={<Pencil aria-hidden />} onClick={onEdit}>
          Edit
        </Button>
      )}
      {onRemove && (
        <ConfirmDialog
          trigger={
            <Button variant="ghost" size="sm" leadingIcon={<Trash2 aria-hidden />}>
              Remove
            </Button>
          }
          tone="danger"
          title="Remove this address?"
          description={formatAddress(address)}
          confirmLabel="Remove"
          onConfirm={onRemove}
        />
      )}
    </span>
  );

  if (!selectable) {
    return (
      <Card asChild variant="outline" padding="sm" radius="xl" className={cn("gap-0", selected && "selected", disabled && "bg-surface-sunken", className)}>
        <article data-slot="saved-address">
          <div className="flex gap-3">
            <CardBody address={address} pin={pin} />
          </div>
          {actions && <span className="-ml-8">{actions}</span>}
        </article>
      </Card>
    );
  }

  return (
    <div
      data-slot="saved-address"
      className={cn(selectableCardClass, "flex-col gap-0 p-4", selected && "selected border-transparent", disabled && "bg-surface-sunken", className)}
    >
      <RadioGroup.Item
        value={address.id}
        disabled={disabled}
        aria-label={`${address.name}, ${address.type}, ${formatAddress(address)}`}
        className="group focus-ring-card flex w-full items-start gap-3 rounded-lg text-left [--focus-card-radius:var(--radius-xl)] after:absolute after:inset-0 after:rounded-xl disabled:cursor-not-allowed"
      >
        <RadioIndicator className="mt-0.5" />
        <CardBody address={address} pin={pin} />
      </RadioGroup.Item>
      {actions}
    </div>
  );
}

/* ---------- Selector ---------- */

export type AddressSelectorProps = {
  addresses: Address[];
  value: string | null;
  onValueChange: (id: string) => void;
  lookup: (pin: string) => PincodeInfo | undefined;
  onSave: (value: AddressFormValue, id?: string) => void;
  onRemove?: (id: string) => void;
  className?: string;
};

/** Checkout address step: pick a saved address (non-serviceable ones disabled with a reason), edit, remove or add new. */
export function AddressSelector({ addresses, value, onValueChange, lookup, onSave, onRemove, className }: AddressSelectorProps) {
  const [editing, setEditing] = useState<Address | "new" | null>(null);

  return (
    <div data-slot="address-selector" className={cn("flex flex-col gap-3", className)}>
      <RadioGroup.Root aria-label="Delivery address" value={value ?? ""} onValueChange={onValueChange} className="grid gap-3">
        {addresses.map((a) => (
          <SavedAddressCard
            key={a.id}
            selectable
            address={a}
            pin={lookup(a.pincode)}
            selected={value === a.id}
            onEdit={() => setEditing(a)}
            onRemove={onRemove ? () => onRemove(a.id) : undefined}
          />
        ))}
      </RadioGroup.Root>
      <Button variant="secondary" leadingIcon={<Plus aria-hidden />} onClick={() => setEditing("new")} className="self-start">
        Add a new address
      </Button>
      <AddressDialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)} address={editing && editing !== "new" ? editing : undefined} onSave={onSave} />
    </div>
  );
}
