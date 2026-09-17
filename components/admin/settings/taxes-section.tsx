"use client";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Inset } from "@/components/ui/inset";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { formatPrice } from "@/lib/format";
import { SettingsSection } from "../admin-display";
import type { SettingsSectionFormProps, StoreSettings } from "./settings-data";

/** How prices relate to GST, and the HSN code and rate new products start with. */
export function TaxesSection({ draft, update, error, touch }: SettingsSectionFormProps) {
  const t = draft.taxes;
  const set = <K extends keyof StoreSettings["taxes"]>(key: K, value: StoreSettings["taxes"][K]) => update((d) => ({ ...d, taxes: { ...d.taxes, [key]: value } }));
  const rate = Number(t.gstRate);
  const listed = 1120;
  const base = t.inclusive ? Math.round(listed / (1 + rate / 100)) : listed;
  const tax = t.inclusive ? listed - base : Math.round((listed * rate) / 100);

  return (
    <SettingsSection title="Taxes" description="GST is calculated per product from its HSN code. Intra-state orders split into CGST and SGST; inter-state orders use IGST.">
      <Switch label="Prices include GST" description="Recommended: shoppers in India expect MRP-style prices with tax included" checked={t.inclusive} onCheckedChange={(on) => set("inclusive", on)} />
      <Inset size="sm" className="text-body" aria-live="polite">
        A product listed at <span className="figures">{formatPrice(listed)}</span> with {rate}% GST {t.inclusive ? "costs the shopper" : "is charged at"}{" "}
        <span className="text-body-strong figures">{formatPrice(base + tax)}</span>: <span className="figures">{formatPrice(base)}</span> + <span className="figures">{formatPrice(tax)}</span> GST.
      </Inset>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Default HSN code" required error={error("taxes.hsn")} hint="Used when a product has none">
          <Input name="taxes.hsn" inputMode="numeric" value={t.hsn} onChange={(e) => set("hsn", e.target.value.replace(/\D/g, "").slice(0, 8))} onBlur={() => touch("taxes.hsn")} className="text-code" />
        </Field>
        <Field label="Default GST rate">
          <Select value={t.gstRate} onValueChange={(v) => set("gstRate", v)} options={["0", "5", "12", "18", "28"].map((r) => ({ value: r, label: `${r}%` }))} />
        </Field>
      </div>
    </SettingsSection>
  );
}
