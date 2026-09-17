"use client";

import { useRef, useState } from "react";
import { BadgePercent, IndianRupee, Percent, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Inset } from "@/components/ui/inset";
import { RadioCard, RadioCardGroup } from "@/components/ui/radio-card";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { SheetBody, SheetFooter, SheetHeader } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { adminDate } from "@/lib/admin-format";
import { ADMIN_TODAY } from "@/lib/data/admin";
import { formatNumber, formatPrice } from "@/lib/format";
import {
  COUPON_CODE_PATTERN,
  eligibleSegments,
  isoDate,
  shopperHeadline,
  statusFromDates,
  type CouponEligibility,
  type CouponRecord,
} from "./coupon-rules";
import { segmentMeta } from "./customer-data";

type CouponType = CouponRecord["type"];

type Draft = {
  code: string;
  description: string;
  type: CouponType;
  value: string;
  maxDiscount: string;
  minOrder: string;
  usageLimit: string;
  perCustomerLimit: string;
  eligibility: CouponEligibility;
  segment: string;
  startsAt: Date | null;
  endsAt: Date | null;
  stackable: boolean;
};

type FieldKey = "code" | "value" | "maxDiscount" | "minOrder" | "usageLimit" | "perCustomerLimit" | "segment" | "startsAt" | "endsAt";

export type CouponBuilderProps = {
  mode: "create" | "edit";
  /** Prefill (edit, or a duplicate in create mode). */
  initial?: CouponRecord;
  /** Codes already in use, to block duplicates. */
  existingCodes: string[];
  onSave: (coupon: CouponRecord) => void;
  onCancel: () => void;
};

const localDate = (iso: string) => new Date(`${iso}T00:00:00`);
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const num = (s: string) => (s.trim() === "" ? undefined : Number(s));
const digitsOnly = (s: string) => s.replace(/\D/g, "").slice(0, 7);

function toDraft(c?: CouponRecord): Draft {
  return {
    code: c?.code ?? "",
    description: c?.description ?? "",
    type: c?.type ?? "percent",
    value: c && c.type !== "free-shipping" ? String(c.value) : "",
    maxDiscount: c?.maxDiscount ? String(c.maxDiscount) : "",
    minOrder: c?.minOrder ? String(c.minOrder) : "",
    usageLimit: c?.usageLimit ? String(c.usageLimit) : "",
    perCustomerLimit: String(c?.perCustomerLimit ?? 1),
    eligibility: c?.eligibility ?? "all",
    segment: c?.segment ?? "",
    startsAt: c ? localDate(c.startsAt) : ADMIN_TODAY,
    endsAt: c ? localDate(c.endsAt) : addDays(ADMIN_TODAY, 30),
    stackable: c?.stackable ?? false,
  };
}

function validate(d: Draft, mode: CouponBuilderProps["mode"], existingCodes: string[], used: number) {
  const e: Partial<Record<FieldKey, string>> = {};
  const value = num(d.value);
  const min = num(d.minOrder) ?? 0;
  const limit = num(d.usageLimit);
  const perCustomer = num(d.perCustomerLimit);

  if (!d.code) e.code = "Enter a code, or generate one.";
  else if (!COUPON_CODE_PATTERN.test(d.code)) e.code = "Use 4–15 capital letters, numbers or hyphens, starting with a letter or number.";
  else if (mode === "create" && existingCodes.includes(d.code)) e.code = `${d.code} already exists. Codes must be unique.`;

  if (d.type === "percent") {
    if (value === undefined) e.value = "Enter the percentage off.";
    else if (value < 1 || value > 90) e.value = "Percentage must be between 1 and 90.";
    if (d.maxDiscount && (num(d.maxDiscount) ?? 0) < 1) e.maxDiscount = "Enter a cap of at least ₹1, or leave it empty.";
  } else if (d.type === "flat") {
    if (value === undefined || value < 1) e.value = "Enter the amount off in rupees.";
    else if (min > 0 && value >= min) e.value = `The discount must be less than the minimum order (${formatPrice(min)}).`;
  }

  if (limit !== undefined && limit < 1) e.usageLimit = "Enter at least 1, or leave it empty for no limit.";
  else if (limit !== undefined && limit < used) e.usageLimit = `Already used ${formatNumber(used)} times. Set a limit of at least ${formatNumber(used)}.`;
  if (perCustomer === undefined || perCustomer < 1) e.perCustomerLimit = "Each customer needs at least 1 use.";
  else if (limit !== undefined && perCustomer > limit) e.perCustomerLimit = "Can’t be more than the total usage limit.";

  if (d.eligibility === "segment" && !d.segment) e.segment = "Choose which segment can use this coupon.";

  if (!d.startsAt) e.startsAt = "Choose a start date.";
  if (!d.endsAt) e.endsAt = "Choose an end date.";
  else if (d.startsAt && d.endsAt <= d.startsAt) e.endsAt = "End date must be after the start date.";
  else if (mode === "create" && isoDate(d.endsAt) < isoDate(ADMIN_TODAY)) e.endsAt = "This date has passed, so the coupon would expire straight away.";

  return e;
}

/** Rule builder for a coupon: code, discount, limits, eligibility, validity, stacking, and a live shopper preview. */
export function CouponBuilder({ mode, initial, existingCodes, onSave, onCancel }: CouponBuilderProps) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(initial));
  const [touched, setTouched] = useState<Set<FieldKey>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const used = mode === "edit" ? (initial?.used ?? 0) : 0;
  const errors = validate(draft, mode, existingCodes, used);
  const errorCount = Object.keys(errors).length;
  const show = (k: FieldKey) => (submitted || touched.has(k) ? errors[k] : undefined);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const touch = (k: FieldKey) => setTouched((t) => (t.has(k) ? t : new Set(t).add(k)));

  const value = num(draft.value) ?? 0;
  const preview = {
    type: draft.type,
    value: draft.type === "free-shipping" ? 49 : value,
    maxDiscount: draft.type === "percent" ? num(draft.maxDiscount) : undefined,
    minOrder: num(draft.minOrder) ?? 0,
  };
  const previewReady = draft.type === "free-shipping" || value > 0;
  const conditions = [
    draft.endsAt ? `Valid till ${adminDate(isoDate(draft.endsAt))}` : null,
    draft.eligibility === "new" ? "First order only" : draft.eligibility === "segment" && draft.segment ? `For ${segmentMeta[draft.segment as keyof typeof segmentMeta].label.toLowerCase()} customers` : null,
    num(draft.perCustomerLimit) === 1 ? "One use per customer" : draft.perCustomerLimit ? `${draft.perCustomerLimit} uses per customer` : null,
    draft.stackable ? "Works with other offers" : "Can’t be combined with other offers",
  ].filter(Boolean);

  function generate() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const base = draft.type === "percent" ? `SAVE${value || 10}` : draft.type === "flat" ? `FLAT${value || 300}` : "FREESHIP";
    let code = "";
    for (let tries = 0; tries < 20 && (!code || existingCodes.includes(code)); tries++) {
      const suffix = Array.from({ length: 3 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
      code = `${base.slice(0, 11)}-${suffix}`;
    }
    set("code", code);
    touch("code");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (errorCount > 0) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    const startsAt = isoDate(draft.startsAt!);
    const endsAt = isoDate(draft.endsAt!);
    const base = { type: draft.type, value: preview.value, maxDiscount: preview.maxDiscount, minOrder: preview.minOrder };
    onSave({
      code: draft.code,
      description: draft.description.trim() || shopperHeadline(base),
      ...base,
      usageLimit: num(draft.usageLimit),
      perCustomerLimit: num(draft.perCustomerLimit),
      used,
      startsAt,
      endsAt,
      status: mode === "edit" && initial?.status === "paused" ? "paused" : statusFromDates(startsAt, endsAt),
      newCustomersOnly: draft.eligibility === "new",
      eligibility: draft.eligibility,
      segment: draft.eligibility === "segment" ? (draft.segment as CouponRecord["segment"]) : undefined,
      stackable: draft.stackable,
    });
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
      <SheetHeader
        title={mode === "edit" ? `Edit ${initial?.code}` : "Create coupon"}
        description={mode === "edit" ? `Changes apply to the next checkout. Used ${formatNumber(used)} times so far.` : "Set the discount, who can use it and when. Shoppers see the preview below."}
      />
      <SheetBody className="flex flex-col gap-7 pb-6">
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-3 text-title">Code</legend>
          <Field
            label="Coupon code"
            required
            error={show("code")}
            hint={mode === "edit" ? "Codes can’t change once shoppers have them. Duplicate the coupon to use a new code." : "Shoppers type this at checkout. Capital letters, numbers and hyphens."}
          >
            <div className="flex gap-2">
              <Input
                value={draft.code}
                onChange={(e) => set("code", e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 15))}
                onBlur={() => touch("code")}
                placeholder="e.g. DIWALI300"
                autoComplete="off"
                spellCheck={false}
                disabled={mode === "edit"}
                className="text-code"
                wrapperClassName="flex-1"
              />
              {mode === "create" && (
                <Button variant="secondary" onClick={generate} leadingIcon={<Sparkles aria-hidden />}>
                  Generate
                </Button>
              )}
            </div>
          </Field>
          <Field label="Description" hint="For your team in the coupons list. Leave empty to use the shopper headline.">
            <Input value={draft.description} onChange={(e) => set("description", e.target.value.slice(0, 80))} placeholder={previewReady ? shopperHeadline(preview) : "e.g. Diwali sale — ₹300 off"} />
          </Field>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-3 text-title">Discount</legend>
          <RadioCardGroup value={draft.type} onValueChange={(v) => set("type", v as CouponType)} aria-label="Discount type" className="gap-2">
            <RadioCard value="percent" size="sm" icon={<Percent aria-hidden />} title="Percentage" description="e.g. 20% off, with an optional cap" />
            <RadioCard value="flat" size="sm" icon={<IndianRupee aria-hidden />} title="Flat amount" description="e.g. ₹300 off the order" />
            <RadioCard value="free-shipping" size="sm" icon={<Truck aria-hidden />} title="Free delivery" description="Waives the ₹49 delivery fee" />
          </RadioCardGroup>

          {draft.type !== "free-shipping" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={draft.type === "percent" ? "Percentage off" : "Amount off"} required error={show("value")}>
                <Input
                  inputMode="numeric"
                  value={draft.value}
                  onChange={(e) => set("value", digitsOnly(e.target.value))}
                  onBlur={() => touch("value")}
                  placeholder={draft.type === "percent" ? "20" : "300"}
                  className="figures"
                  startSlot={draft.type === "flat" ? <span className="text-body text-fg-muted">₹</span> : undefined}
                  endSlot={draft.type === "percent" ? <span className="text-body text-fg-muted">% off</span> : <span className="text-body text-fg-muted">off</span>}
                />
              </Field>
              {draft.type === "percent" && (
                <Field label="Maximum discount" error={show("maxDiscount")} hint="Empty means no cap.">
                  <Input
                    inputMode="numeric"
                    value={draft.maxDiscount}
                    onChange={(e) => set("maxDiscount", digitsOnly(e.target.value))}
                    onBlur={() => touch("maxDiscount")}
                    placeholder="1500"
                    className="figures"
                    startSlot={<span className="text-body text-fg-muted">₹</span>}
                  />
                </Field>
              )}
            </div>
          )}

          <Field label="Minimum order value" error={show("minOrder")} hint="Cart total after other discounts, before delivery. Empty means any order.">
            <Input
              inputMode="numeric"
              value={draft.minOrder}
              onChange={(e) => set("minOrder", digitsOnly(e.target.value))}
              onBlur={() => touch("minOrder")}
              placeholder="1999"
              className="figures"
              startSlot={<span className="text-body text-fg-muted">₹</span>}
              wrapperClassName="sm:max-w-[calc(50%-0.5rem)]"
            />
          </Field>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-3 text-title">Usage limits</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Total uses" error={show("usageLimit")} hint="Empty means no limit.">
              <Input inputMode="numeric" value={draft.usageLimit} onChange={(e) => set("usageLimit", digitsOnly(e.target.value))} onBlur={() => touch("usageLimit")} placeholder="5000" className="figures" />
            </Field>
            <Field label="Uses per customer" required error={show("perCustomerLimit")}>
              <Input inputMode="numeric" value={draft.perCustomerLimit} onChange={(e) => set("perCustomerLimit", digitsOnly(e.target.value))} onBlur={() => touch("perCustomerLimit")} className="figures" />
            </Field>
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-3 text-title">Who can use it</legend>
          <RadioGroup value={draft.eligibility} onValueChange={(v) => set("eligibility", v as CouponEligibility)} aria-label="Eligibility">
            <Radio value="all" label="All customers" />
            <Radio value="new" label="New customers only" description="Their first order on BlueSigns" />
            <Radio value="segment" label="A specific segment" description="Repeat, VIP or at-risk customers" />
          </RadioGroup>
          {draft.eligibility === "segment" && (
            <Field label="Segment" required error={show("segment")} className="sm:max-w-[calc(50%-0.5rem)] sm:pl-8">
              <Select
                value={draft.segment || undefined}
                onValueChange={(v) => {
                  set("segment", v);
                  touch("segment");
                }}
                placeholder="Choose a segment"
                options={eligibleSegments}
              />
            </Field>
          )}
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-3 text-title">Validity</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Starts" required error={show("startsAt")}>
              <DatePicker
                value={draft.startsAt}
                onValueChange={(d) => {
                  set("startsAt", d);
                  touch("startsAt");
                }}
                defaultMonth={ADMIN_TODAY}
              />
            </Field>
            <Field label="Ends" required error={show("endsAt")} hint="Ends at 11:59 pm IST.">
              <DatePicker
                value={draft.endsAt}
                onValueChange={(d) => {
                  set("endsAt", d);
                  touch("endsAt");
                }}
                defaultMonth={draft.startsAt ?? ADMIN_TODAY}
                min={draft.startsAt ? addDays(draft.startsAt, 1) : undefined}
              />
            </Field>
          </div>
          <Switch
            checked={draft.stackable}
            onCheckedChange={(v) => set("stackable", v)}
            label="Combine with other offers"
            description="Lets shoppers use this with automatic sale prices and bank offers."
          />
        </fieldset>

        <section aria-labelledby="coupon-preview-title" className="flex flex-col gap-3">
          <h3 id="coupon-preview-title" className="text-title">
            Shopper preview
          </h3>
          <Inset className="flex flex-col gap-2">
            <div className="flex items-start gap-3 rounded-md bg-surface p-3 shadow-flat" aria-live="polite">
              <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-accent-soft text-accent-soft-fg">
                <BadgePercent className="size-icon-base" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-body-strong">{previewReady ? shopperHeadline(preview) : "Enter a discount to see the offer"}</p>
                <p className="text-caption text-fg-muted">{conditions.join(" · ")}</p>
              </div>
              <span className="shrink-0 rounded-xs bg-surface-sunken px-2 py-1 text-code">{draft.code || "CODE"}</span>
            </div>
            <p className="text-caption text-fg-muted">How the offer appears on the bag and checkout pages.</p>
          </Inset>
        </section>
      </SheetBody>

      <SheetFooter className="flex-row flex-wrap items-center justify-end gap-2">
        {submitted && errorCount > 0 && (
          <p role="alert" className="mr-auto text-label text-danger-fg">
            Fix {errorCount} {errorCount === 1 ? "field" : "fields"} to save
          </p>
        )}
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{mode === "edit" ? "Save changes" : "Create coupon"}</Button>
      </SheetFooter>
    </form>
  );
}
