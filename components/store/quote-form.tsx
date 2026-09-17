"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, type SelectGroup } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { placements, series } from "@/lib/data/can-products";

const modelGroups: SelectGroup[] = placements.map((p) => ({
  label: p.label,
  options: series
    .filter((s) => s.placement === p.value)
    .flatMap((s) => s.models.map((m) => ({ value: m.name, label: `${m.name} · ${m.size}″` }))),
}));

type Values = { name: string; company: string; email: string; phone: string; city: string; model: string; quantity: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (v.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a 10-digit phone number.";
  if (!v.model) e.model = "Choose the product you're interested in.";
  const qty = Number(v.quantity);
  if (!Number.isInteger(qty) || qty < 1) e.quantity = "Enter a quantity of 1 or more.";
  return e;
}

/**
 * Quote request for a CAN display.
 * TODO: this form has no backend yet. Connect `onSubmit` to an API route or CRM before launch;
 * until then the confirmation only reflects what was entered on this page.
 */
export function QuoteForm({ defaultModel }: { defaultModel?: string }) {
  const requested = defaultModel?.trim().slice(0, 160) ?? "";
  const isCanModel = modelGroups.some((g) => g.options.some((o) => o.value === requested));
  // A product linked from the catalogue gets its own option so the enquiry keeps its name.
  const groups: SelectGroup[] =
    requested && !isCanModel ? [{ label: "From the catalogue", options: [{ value: requested, label: requested }] }, ...modelGroups] : modelGroups;
  const knownModel = requested;
  const [values, setValues] = useState<Values>({
    name: "",
    company: "",
    email: "",
    phone: "",
    city: "",
    model: knownModel,
    quantity: "1",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof Values) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length === 0) setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card className="items-start gap-4" role="status">
        <span className="flex size-12 items-center justify-center rounded-pill bg-success-soft text-success-fg">
          <CircleCheck aria-hidden className="size-icon-lg" />
        </span>
        <div>
          <h2 className="text-heading-md">Thanks, {values.name.split(" ")[0]}</h2>
          <p className="mt-1 text-body text-fg-muted">
            We have your request for {values.quantity} × {values.model}. Our team will reach you at {values.email} with pricing
            and availability.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="secondary">
            <Link href="/products">Keep browsing</Link>
          </Button>
          <Button variant="ghost" onClick={() => setSubmitted(false)}>
            Edit request
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card asChild>
      <form noValidate onSubmit={onSubmit} aria-label="Request a quote">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" error={errors.name} required>
            <Input autoComplete="name" value={values.name} onChange={(e) => set("name")(e.target.value)} />
          </Field>
          <Field label="Company" hint="Optional">
            <Input autoComplete="organization" value={values.company} onChange={(e) => set("company")(e.target.value)} />
          </Field>
          <Field label="Email" error={errors.email} required>
            <Input type="email" autoComplete="email" value={values.email} onChange={(e) => set("email")(e.target.value)} />
          </Field>
          <Field label="Phone" error={errors.phone} required>
            <Input type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={(e) => set("phone")(e.target.value)} />
          </Field>
          <Field label="Product" error={errors.model} required>
            <Select groups={groups} placeholder="Choose a model" value={values.model || undefined} onValueChange={set("model")} />
          </Field>
          <div className="grid grid-cols-[1fr_7rem] gap-4">
            <Field label="City" hint="Where it will be installed">
              <Input autoComplete="address-level2" value={values.city} onChange={(e) => set("city")(e.target.value)} />
            </Field>
            <Field label="Quantity" error={errors.quantity} required>
              <Input type="number" min={1} inputMode="numeric" value={values.quantity} onChange={(e) => set("quantity")(e.target.value)} />
            </Field>
          </div>
          <Field label="Anything else?" hint="Where it goes, content you plan to show, IQ World Basic or PRO…" className="sm:col-span-2">
            <Textarea autosize minRows={3} value={values.message} onChange={(e) => set("message")(e.target.value)} />
          </Field>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-border-subtle pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption text-fg-muted">We use these details only to reply to your enquiry.</p>
          <Button type="submit" size="lg">
            Request quote
          </Button>
        </div>
      </form>
    </Card>
  );
}
