"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Inset } from "@/components/ui/inset";
import { Switch } from "@/components/ui/switch";
import { TextButton } from "@/components/ui/text-button";
import { Textarea } from "@/components/ui/textarea";
import { lookupPincode } from "@/lib/data/india";
import { formatNumber, formatPrice } from "@/lib/format";
import { SettingsSection } from "../admin-display";
import { PIN_PATTERN, parsePins, type SettingsSectionFormProps } from "./settings-data";

type Check =
  | { kind: "idle" }
  | { kind: "invalid" }
  | { kind: "result"; pin: string; inList: boolean };

const rupee = <span className="text-body text-fg-muted">₹</span>;

/** Delivery fees, express delivery and the PIN codes the store ships to, with a quick serviceability check. */
export function ShippingSection({ draft, update, error, touch }: SettingsSectionFormProps) {
  const s = draft.shipping;
  const [pin, setPin] = useState("");
  const [check, setCheck] = useState<Check>({ kind: "idle" });
  const pins = parsePins(s.pins);
  const set = <K extends keyof typeof s>(key: K, value: (typeof s)[K]) => update((d) => ({ ...d, shipping: { ...d.shipping, [key]: value } }));
  const digits = (v: string) => v.replace(/\D/g, "").slice(0, 6);

  const runCheck = () => {
    if (!PIN_PATTERN.test(pin)) return setCheck({ kind: "invalid" });
    setCheck({ kind: "result", pin, inList: pins.valid.includes(pin) });
  };

  const addPin = (code: string) => {
    set("pins", [...pins.valid, code].join(", "));
    setCheck({ kind: "result", pin: code, inList: true });
    toast({ title: `PIN ${code} added`, description: "Save changes to start delivering there.", tone: "success" });
  };

  const importCsv = (files: { file: File }[]) => {
    const file = files[files.length - 1]?.file;
    if (!file) return;
    file.text().then((text) => {
      const parsed = parsePins(text);
      const added = parsed.valid.filter((p) => !pins.valid.includes(p));
      if (added.length === 0) {
        toast({ title: "No new PIN codes found", description: `${file.name} has no 6-digit PIN codes that aren’t already listed.`, tone: "info" });
        return;
      }
      set("pins", [...pins.valid, ...added].join(", "));
      toast({ title: `Added ${formatNumber(added.length)} PIN codes`, description: `From ${file.name}${parsed.invalid.length ? ` · ${parsed.invalid.length} entries skipped` : ""}`, tone: "success" });
    });
  };

  const result = check.kind === "result" ? lookupPincode(check.pin) : undefined;

  return (
    <SettingsSection
      title="Shipping"
      description={`Orders at or above the free delivery threshold ship free. Below it, shoppers pay the delivery fee (${formatPrice(Number(s.deliveryFee) || 0)} today).`}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Free delivery threshold" required error={error("shipping.freeThreshold")} hint="Order value after discounts">
          <Input name="shipping.freeThreshold" inputMode="numeric" value={s.freeThreshold} onChange={(e) => set("freeThreshold", e.target.value.replace(/\D/g, ""))} onBlur={() => touch("shipping.freeThreshold")} startSlot={rupee} className="figures" />
        </Field>
        <Field label="Delivery fee" required error={error("shipping.deliveryFee")} hint="Charged below the threshold">
          <Input name="shipping.deliveryFee" inputMode="numeric" value={s.deliveryFee} onChange={(e) => set("deliveryFee", e.target.value.replace(/\D/g, ""))} onBlur={() => touch("shipping.deliveryFee")} startSlot={rupee} className="figures" />
        </Field>
      </div>

      <div className="flex flex-col gap-4 border-t border-border-subtle pt-5">
        <Switch label="Express delivery" description="Next-day delivery in metro PIN codes, dispatched by 2 pm" checked={s.express} onCheckedChange={(on) => set("express", on)} />
        {s.express && (
          <Field label="Express fee" required error={error("shipping.expressFee")} className="sm:max-w-[calc(50%-0.5rem)]">
            <Input name="shipping.expressFee" inputMode="numeric" value={s.expressFee} onChange={(e) => set("expressFee", e.target.value.replace(/\D/g, ""))} onBlur={() => touch("shipping.expressFee")} startSlot={rupee} className="figures" />
          </Field>
        )}
      </div>

      <div className="flex flex-col gap-4 border-t border-border-subtle pt-5">
        <Field
          label="Serviceable PIN codes"
          required
          error={error("shipping.pins")}
          hint={`${formatNumber(pins.valid.length)} PIN codes${pins.invalid.length ? ` · ignoring ${pins.invalid.slice(0, 3).join(", ")}${pins.invalid.length > 3 ? "…" : ""} (not 6 digits)` : ""}. Separate with commas or new lines.`}
        >
          <Textarea name="shipping.pins" rows={3} value={s.pins} onChange={(e) => set("pins", e.target.value)} onBlur={() => touch("shipping.pins")} className="figures" spellCheck={false} />
        </Field>
        <FileUpload variant="button" layout="list" accept=".csv,text/csv,text/plain" multiple={false} maxSize={1024 * 1024} title="Import CSV" description="One PIN code per row · up to 1 MB" onValueChange={importCsv} value={[]} />

        <Inset size="sm" className="flex flex-col gap-3">
          <Field label="Check a PIN code" error={check.kind === "invalid" ? "Enter a 6-digit PIN code, e.g. 560066." : undefined}>
            <div className="flex gap-2">
              <Input
                size="sm"
                inputMode="numeric"
                placeholder="560066"
                value={pin}
                onChange={(e) => {
                  setPin(digits(e.target.value));
                  if (check.kind !== "idle") setCheck({ kind: "idle" });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    runCheck();
                  }
                }}
                startSlot={<Search aria-hidden />}
                wrapperClassName="flex-1 bg-surface"
                className="figures"
              />
              <Button variant="secondary" size="sm" onClick={runCheck}>
                Check
              </Button>
            </div>
          </Field>
          <p aria-live="polite" className="text-body empty:hidden">
            {check.kind === "result" &&
              (check.inList ? (
                result ? (
                  result.serviceable ? (
                    <span className="text-success-fg">
                      Delivers to {result.city}, {result.state} in {result.etaDays} days · {result.cod ? "COD available" : "prepaid only"}.
                    </span>
                  ) : (
                    <span className="text-danger-fg">
                      {check.pin} is on your list, but couriers don’t reach {result.city} yet. Orders there will fail to ship.
                    </span>
                  )
                ) : (
                  <span>{check.pin} is on your list. No courier estimate in the demo data yet.</span>
                )
              ) : result?.serviceable ? (
                <span className="flex flex-wrap items-baseline gap-x-2 text-warning-fg">
                  Not on your list. Couriers deliver to {result.city} in {result.etaDays} days.
                  <TextButton onClick={() => addPin(check.pin)}>Add {check.pin}</TextButton>
                </span>
              ) : (
                <span className="text-danger-fg">
                  Not serviceable{result ? `: couriers don’t reach ${result.city} yet` : ""}. Shoppers see “Delivery not available” at checkout.
                </span>
              ))}
          </p>
        </Inset>
      </div>
    </SettingsSection>
  );
}
