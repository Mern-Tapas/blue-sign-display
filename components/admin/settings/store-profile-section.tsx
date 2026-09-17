"use client";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { INDIAN_STATES } from "@/lib/data/india";
import { SettingsSection } from "../admin-display";
import type { SettingsSectionFormProps, StoreSettings } from "./settings-data";

type ProfileKey = keyof StoreSettings["profile"];

/** Store identity used on invoices, emails and the GST registration. */
export function StoreProfileSection({ draft, update, error, touch }: SettingsSectionFormProps) {
  const p = draft.profile;
  const set = (key: ProfileKey, value: string) => update((d) => ({ ...d, profile: { ...d.profile, [key]: value } }));
  const bind = (key: ProfileKey, transform: (v: string) => string = (v) => v) => ({
    name: `profile.${key}`,
    value: p[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(key, transform(e.target.value)),
    onBlur: () => touch(`profile.${key}`),
  });

  return (
    <SettingsSection title="Store profile" description="Shown on tax invoices, order emails and the help page. The GSTIN must match your GST registration.">
      <Field label="Store name" required error={error("profile.storeName")}>
        <Input {...bind("storeName")} autoComplete="organization" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Support email" required error={error("profile.supportEmail")}>
          <Input {...bind("supportEmail", (v) => v.trim())} type="email" autoComplete="email" />
        </Field>
        <Field label="Support phone" required error={error("profile.supportPhone")} hint="Shown on invoices and the help page">
          <Input
            {...bind("supportPhone", (v) => v.replace(/\D/g, "").slice(0, 10))}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            startSlot={<span className="text-body text-fg-muted">+91</span>}
            className="figures"
          />
        </Field>
      </div>
      <Field label="GSTIN" required error={error("profile.gstin")} hint={`15 characters, e.g. 29ABCDE1234F1Z5 · ${p.gstin.length}/15`}>
        <Input {...bind("gstin", (v) => v.toUpperCase().replace(/[^0-9A-Z]/g, "").slice(0, 15))} autoCapitalize="characters" spellCheck={false} className="text-code" />
      </Field>
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-4 text-body-strong">Registered business address</legend>
        <Field label="Address" required error={error("profile.address")}>
          <Input {...bind("address")} autoComplete="street-address" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="City" required error={error("profile.city")}>
            <Input {...bind("city")} autoComplete="address-level2" />
          </Field>
          <Field label="State">
            <Select value={p.state} onValueChange={(v) => set("state", v)} options={INDIAN_STATES.map((s) => ({ value: s, label: s }))} />
          </Field>
          <Field label="PIN code" required error={error("profile.pincode")}>
            <Input {...bind("pincode", (v) => v.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="postal-code" className="figures" />
          </Field>
        </div>
      </fieldset>
    </SettingsSection>
  );
}
