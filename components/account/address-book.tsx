"use client";

import { useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { AddressDialog } from "@/components/checkout/address-dialog";
import { SavedAddressCard } from "@/components/checkout/address-selector";
import type { AddressFormValue } from "@/components/checkout/address-form";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { TextButton } from "@/components/ui/text-button";
import { cn } from "@/lib/cn";
import type { Address, PincodeInfo } from "@/lib/data/types";

export type AddressBookProps = {
  addresses: Address[];
  lookup: (pin: string) => PincodeInfo | undefined;
  onChange: (addresses: Address[]) => void;
  max?: number;
  className?: string;
};

/** Saved addresses: default first, add / edit in a dialog, set default, remove with confirm; serviceability shown per address. */
export function AddressBook({ addresses, lookup, onChange, max = 10, className }: AddressBookProps) {
  const [editing, setEditing] = useState<Address | "new" | null>(null);
  const sorted = [...addresses].sort((a, b) => Number(Boolean(b.isDefault)) - Number(Boolean(a.isDefault)));

  function save(value: AddressFormValue, id?: string) {
    const nextId = id ?? `addr-${Date.now()}`;
    const entry: Address = { ...value, id: nextId, landmark: value.landmark || undefined, isDefault: value.isDefault || addresses.length === 0 };
    const base = entry.isDefault ? addresses.map((a) => ({ ...a, isDefault: false })) : addresses;
    onChange(id ? base.map((a) => (a.id === id ? entry : a)) : [...base, entry]);
    toast({ title: id ? "Address updated" : "Address added", tone: "success" });
  }

  return (
    <section data-slot="address-book" aria-label="Saved addresses" className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-body text-fg-muted figures">
          {addresses.length} of {max} addresses
        </p>
        <Button leadingIcon={<Plus aria-hidden />} onClick={() => setEditing("new")} disabled={addresses.length >= max}>
          Add address
        </Button>
      </div>
      {sorted.length === 0 ? (
        <Card variant="outline" padding="none">
          <EmptyState icon={<MapPin aria-hidden />} title="No saved addresses" description="Save your home and work addresses for one-tap checkout." action={<Button onClick={() => setEditing("new")}>Add address</Button>} />
        </Card>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {sorted.map((a) => (
            <li key={a.id} className="flex flex-col">
              <SavedAddressCard address={a} pin={lookup(a.pincode)} onEdit={() => setEditing(a)} onRemove={() => onChange(addresses.filter((x) => x.id !== a.id))} className="h-full" />
              {!a.isDefault && (
                <TextButton className="mt-1 self-start" onClick={() => onChange(addresses.map((x) => ({ ...x, isDefault: x.id === a.id })))}>
                  Set as default
                </TextButton>
              )}
            </li>
          ))}
        </ul>
      )}
      <AddressDialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)} address={editing && editing !== "new" ? editing : undefined} onSave={save} />
    </section>
  );
}
