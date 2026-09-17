"use client";

import { useCallback, useState } from "react";
import { Building2, CircleAlert, CircleCheck, House, Loader2, User } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChipGroup } from "@/components/ui/chip";
import { Combobox } from "@/components/ui/combobox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { isValidPincode, PincodeInput } from "@/components/ui/pincode-input";
import { cn } from "@/lib/cn";
import { useForm } from "@/lib/form/use-form";
import { INDIAN_STATES, lookupPincode } from "@/lib/data/india";
import type { AddressType, PincodeInfo } from "@/lib/data/types";
import { validateMobile, validateName } from "@/lib/validation";

/** Address as entered in the form (the saved Address adds an id). */
export type AddressFormValue = {
  name: string;
  mobile: string;
  pincode: string;
  house: string;
  locality: string;
  landmark: string;
  city: string;
  state: string;
  type: AddressType;
  isDefault: boolean;
  /** Optional second number for the delivery partner. */
  alternateMobile: string;
};

/** @deprecated Use AddressFormValue. Kept as an alias for existing imports. */
export type Address = AddressFormValue;

export const emptyAddress: AddressFormValue = {
  name: "",
  mobile: "",
  pincode: "",
  house: "",
  locality: "",
  landmark: "",
  city: "",
  state: "",
  type: "home",
  isDefault: false,
  alternateMobile: "",
};

type Errors = Partial<Record<keyof AddressFormValue, string>>;

export function validateAddress(a: AddressFormValue, pin?: PincodeInfo | null): Errors {
  const e: Errors = {};
  const name = validateName(a.name);
  if (name) e.name = name;
  const mobile = validateMobile(a.mobile);
  if (mobile) e.mobile = mobile;
  if (a.alternateMobile && validateMobile(a.alternateMobile)) e.alternateMobile = "Enter a valid 10-digit number or leave it empty";
  if (!isValidPincode(a.pincode)) e.pincode = "Enter a valid 6-digit PIN code";
  else if (pin && !pin.serviceable) e.pincode = `We don’t deliver to ${pin.pincode} yet`;
  if (a.house.trim().length < 3) e.house = "Enter your flat, house number or building";
  if (a.locality.trim().length < 3) e.locality = "Enter the area, street or locality";
  if (!a.city.trim()) e.city = "Enter your city";
  if (!a.state) e.state = "Select your state";
  return e;
}

export type AddressFormProps = {
  id?: string;
  defaultValue?: Partial<AddressFormValue>;
  onSubmit: (address: AddressFormValue) => void;
  /** Resolves a PIN to city / state / serviceability (API in production). */
  lookup?: (pin: string) => PincodeInfo | undefined | Promise<PincodeInfo | undefined>;
  className?: string;
};

/**
 * Indian delivery address. Mobile first (delivery partners call it), PIN auto-fills city and
 * state and flags non-serviceable areas, then house and locality, an optional landmark and
 * Home / Work. Submit from an external button with `form={id}`.
 */
export function AddressForm({ id: idProp, defaultValue, onSubmit, lookup = lookupPincode, className }: AddressFormProps) {
  const [pin, setPin] = useState<{ status: "idle" | "checking" | "done"; info?: PincodeInfo | null }>({ status: "idle" });

  // Serviceability comes from outside the values, so the rule closes over it. useForm reads
  // the function fresh on every run, which is why a stale PIN can't outlive its lookup.
  const validate = useCallback((v: AddressFormValue) => validateAddress(v, pin.info) as Record<string, string>, [pin.info]);

  const form = useForm<AddressFormValue>({
    initial: { ...emptyAddress, ...defaultValue },
    validate,
    idPrefix: idProp,
    onSubmit: (v) => onSubmit(v),
  });
  const { values: value, setField } = form;
  const set = <K extends keyof AddressFormValue>(key: K, v: AddressFormValue[K]) => setField(key, v);
  const errors = form.errors as Errors;

  async function checkPin(code: string) {
    setPin({ status: "checking" });
    const info = (await lookup(code)) ?? null;
    setPin({ status: "done", info });
    if (info) {
      if (!value.city) setField("city", info.city);
      setField("state", info.state);
    }
  }

  return (
    <form {...form.formProps} data-slot="address-form" className={cn("grid gap-4 sm:grid-cols-2", className)}>
      <Field id={form.fieldId("name")} label="Full name" error={errors.name} required>
        <Input autoComplete="name" value={value.name} onChange={(e) => set("name", e.target.value)} startSlot={<User aria-hidden />} />
      </Field>
      <Field id={form.fieldId("mobile")} label="Mobile number" error={errors.mobile} hint="For delivery updates and the delivery partner" required>
        <PhoneInput value={value.mobile} onValueChange={(v) => set("mobile", v)} />
      </Field>

      <Field
        id={form.fieldId("pincode")}
        label="PIN code"
        error={errors.pincode}
        hint={
          pin.status === "checking" ? (
            <span className="flex items-center gap-1">
              <Loader2 aria-hidden className="size-icon-sm motion-safe:animate-spin" /> Checking PIN code…
            </span>
          ) : pin.info ? (
            pin.info.serviceable ? (
              <span className="flex items-center gap-1 text-success-fg">
                <CircleCheck aria-hidden className="size-icon-sm" /> {pin.info.city}, {pin.info.state}
                {!pin.info.cod && " · no Cash on Delivery"}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-danger-fg">
                <CircleAlert aria-hidden className="size-icon-sm" /> Not serviceable yet
              </span>
            )
          ) : pin.status === "done" ? (
            "We couldn’t find this PIN — enter city and state"
          ) : (
            "City and state fill in automatically"
          )
        }
        required
      >
        <PincodeInput
          value={value.pincode}
          onValueChange={(v) => {
            set("pincode", v);
            if (v.length < 6 && pin.status !== "idle") setPin({ status: "idle" });
          }}
          onComplete={(v) => void checkPin(v)}
        />
      </Field>
      <Field id={form.fieldId("house")} label="Flat, house no., building" error={errors.house} required>
        <Input autoComplete="address-line1" value={value.house} onChange={(e) => set("house", e.target.value)} placeholder="Flat 402, Prestige Lakeside" />
      </Field>
      <Field id={form.fieldId("locality")} label="Area, street, locality" error={errors.locality} required className="sm:col-span-2">
        <Input autoComplete="address-line2" value={value.locality} onChange={(e) => set("locality", e.target.value)} placeholder="Varthur Road, Whitefield" />
      </Field>
      <Field id={form.fieldId("landmark")} label="Landmark" hint="Optional — helps the delivery partner find you">
        <Input value={value.landmark} onChange={(e) => set("landmark", e.target.value)} placeholder="Near Phoenix Marketcity" />
      </Field>
      <Field id={form.fieldId("city")} label="City / district" error={errors.city} required>
        <Input autoComplete="address-level2" value={value.city} onChange={(e) => set("city", e.target.value)} />
      </Field>
      <Field id={form.fieldId("state")} label="State" error={errors.state} required>
        <Combobox options={INDIAN_STATES.map((s) => ({ value: s, label: s }))} value={value.state || null} onValueChange={(s) => set("state", s ?? "")} placeholder="Select state" searchPlaceholder="Search states" required />
      </Field>
      <Field id={form.fieldId("alternateMobile")} label="Alternate mobile" error={errors.alternateMobile} hint="Optional">
        <PhoneInput value={value.alternateMobile} onValueChange={(v) => set("alternateMobile", v)} autoComplete="off" />
      </Field>

      <fieldset className="flex flex-col gap-2 sm:col-span-2">
        <legend className="mb-2 text-label">Address type</legend>
        <ChipGroup
          type="single"
          aria-label="Address type"
          size="md"
          value={value.type}
          onValueChange={(v: string) => v && set("type", v as AddressType)}
          options={[
            { value: "home", label: "Home", icon: <House aria-hidden /> },
            { value: "work", label: "Work", icon: <Building2 aria-hidden /> },
          ]}
        />
        <p className="text-caption text-fg-muted">{value.type === "work" ? "Delivered 10 AM – 6 PM on weekdays" : "Delivered all day, 7 days a week"}</p>
      </fieldset>
      <Checkbox label="Make this my default address" checked={value.isDefault} onCheckedChange={(v) => set("isDefault", v === true)} className="sm:col-span-2" />
    </form>
  );
}
