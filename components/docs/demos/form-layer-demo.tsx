"use client";

import { useCallback, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FormErrorSummary } from "@/components/ui/form-error-summary";
import { FormRow } from "@/components/ui/form-row";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { toast } from "@/components/providers/toast-store";
import { collect, maxLength, money, required } from "@/lib/form/validators";
import { useFieldArray } from "@/lib/form/use-field-array";
import { useForm, type FormReveal } from "@/lib/form/use-form";

/* ---------------------------------------------------------------- useForm */

type Values = { name: string; price: string; note: string };

const validateValues = (v: Values) =>
  collect([
    ["name", v.name, [required("Give this a name"), maxLength(60)]],
    ["price", v.price, [required("Enter a price"), money({ minorUnits: 2 })]],
    ["note", v.note, [maxLength(80)]],
  ]);

/** The whole integration surface: bind a Field, read an error, submit. */
export function FormLayerDemo() {
  const [reveal, setReveal] = useState<FormReveal>("submit");

  const form = useForm<Values>({
    initial: { name: "", price: "", note: "" },
    validate: validateValues,
    reveal,
    onSubmit: (values, { commit }) => {
      commit();
      toast({ title: "Saved", description: `${values.name} · ₹${values.price}`, tone: "success" });
    },
  });

  const left = Object.keys(form.allErrors).length;

  return (
    <form {...form.formProps} className="flex flex-col gap-5">
      <SegmentedControl
        aria-label="When errors appear"
        value={reveal}
        onValueChange={(v) => setReveal(v as FormReveal)}
        options={[
          { value: "submit", label: "On submit" },
          { value: "blur", label: "On blur" },
        ]}
      />

      <FormErrorSummary result={form.result} show={form.attempted} hrefFor={(path) => form.fieldId(path)} />

      <FormRow columns={2}>
        <Field label="Name" {...form.field("name", { required: true })} announce="off">
          <Input value={form.values.name} onChange={(e) => form.setField("name", e.target.value)} onBlur={form.field("name").onBlur} placeholder="Everyday Sneaker" />
        </Field>
        <Field label="Price" {...form.field("price", { required: true })} announce="off">
          <Input value={form.values.price} onChange={(e) => form.setField("price", e.target.value)} onBlur={form.field("price").onBlur} startSlot={<span aria-hidden>₹</span>} inputMode="decimal" />
        </Field>
      </FormRow>

      <Field label="Note" {...form.field("note")} announce="off" counter={{ value: form.values.note.length, max: 80 }}>
        <Input value={form.values.note} onChange={(e) => form.setField("note", e.target.value)} onBlur={form.field("note").onBlur} />
      </Field>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" loading={form.submitting}>
          Save
        </Button>
        <Button type="button" variant="ghost" onClick={() => form.discard()} disabled={!form.dirty}>
          Discard
        </Button>
        <p className="text-caption text-fg-muted" aria-live="polite">
          {form.dirty ? "Unsaved changes" : "No changes"}
          {left > 0 && ` · ${left} left to fix`}
        </p>
      </div>
    </form>
  );
}

/* ---------------------------------------------------------------- useFieldArray */

type Highlight = { id: string; text: string };
type ListValues = { highlights: Highlight[] };

const MAX = 4;

const validateList = (v: ListValues) =>
  collect(v.highlights.map((h, i) => [`highlights.${i}.text`, h.text, [required("Write the highlight or remove the row")]] as [string, string, ReturnType<typeof required>[]]));

/** Repeated rows, with the error path qualified so focus order survives. */
export function FieldArrayDemo() {
  const form = useForm<ListValues>({
    initial: { highlights: [{ id: "h1", text: "Cushioned sole" }, { id: "h2", text: "" }] },
    validate: validateList,
    onSubmit: () => {
      toast({ title: "Saved highlights", tone: "success" });
    },
  });
  const rows = useFieldArray<ListValues, Highlight>(form, "highlights");

  return (
    <form {...form.formProps} className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {rows.items.map((row, i) => (
          <li key={row.id} className="flex items-end gap-2">
            <Field label={`Highlight ${i + 1}`} {...form.field(rows.pathFor(i, "text"), { required: true })} className="flex-1">
              <Input value={row.text} onChange={(e) => rows.update(i, { text: e.target.value })} placeholder="Short benefit" />
            </Field>
            <IconButton label={`Remove highlight ${i + 1}`} variant="ghost" onClick={() => rows.remove(i)} disabled={rows.items.length === 1}>
              <Trash2 aria-hidden />
            </IconButton>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          leadingIcon={<Plus aria-hidden />}
          onClick={() => rows.append({ id: `h${Date.now()}`, text: "" })}
          disabled={rows.items.length >= MAX}
        >
          Add highlight
        </Button>
        <Button type="submit">Save</Button>
        <p className="text-caption text-fg-muted">
          {rows.items.length} of {MAX}
        </p>
      </div>
    </form>
  );
}

/* ---------------------------------------------------------------- dependent select */

const CATEGORIES: Record<string, string[]> = {
  Footwear: ["Sneakers", "Sandals", "Boots"],
  Apparel: ["T-shirts", "Jackets", "Trousers"],
};

type Pair = { category: string; sub: string };

/** The rule the design system documents instead of shipping a component for it. */
export function DependentSelectDemo({ clearChild = true }: { clearChild?: boolean }) {
  // The "don't" starts where the bug leaves you: Sneakers still selected under Apparel.
  const form = useForm<Pair>({ initial: clearChild ? { category: "Footwear", sub: "Sneakers" } : { category: "Apparel", sub: "Sneakers" } });
  const { setValues } = form;

  const pickCategory = useCallback(
    (category: string) => setValues((v) => ({ category, sub: clearChild ? "" : v.sub })),
    [setValues, clearChild],
  );

  const subs = CATEGORIES[form.values.category] ?? [];
  const stale = form.values.sub !== "" && !subs.includes(form.values.sub);
  // A Select can't display a value it has no option for, and a blank trigger would hide the
  // very bug this example is about — so the stale value is listed while it is still selected.
  const options = stale ? [...subs, form.values.sub] : subs;

  return (
    <FormRow columns={2}>
      <Field label="Category" {...form.field("category")}>
        <Select
          aria-label="Category"
          value={form.values.category}
          onValueChange={pickCategory}
          placeholder="Select a category"
          options={Object.keys(CATEGORIES).map((c) => ({ value: c, label: c }))}
        />
      </Field>
      <Field label="Sub-category" {...form.field("sub")} hint={form.values.category ? (stale ? "Not a sub-category of this category" : undefined) : "Pick a category first"}>
        <Select
          aria-label="Sub-category"
          value={form.values.sub}
          onValueChange={(s) => form.setField("sub", s)}
          placeholder={form.values.category ? "Select" : "—"}
          disabled={!form.values.category}
          emptyText="Pick a category first"
          options={options.map((s) => ({ value: s, label: s }))}
        />
      </Field>
    </FormRow>
  );
}
