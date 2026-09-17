import type { Metadata } from "next";
import { DependentSelectDemo, FieldArrayDemo, FormLayerDemo } from "@/components/docs/demos/form-layer-demo";
import { MediaGridDemo, OptionSetDemo, RepeatableListDemo, SlugInputDemo, UploadProgressDemo } from "@/components/docs/demos/input-layer-demo";
import { DsDoDont } from "@/components/docs/ds-foundations";
import { DsPageHeader, DsPreview, DsProps, DsSection } from "@/components/docs/ds-section";

export const metadata: Metadata = { title: "Form patterns" };

const bind = `const form = useForm({ initial, validate });

<form {...form.formProps}>
  <FormErrorSummary result={form.result} show={form.attempted} hrefFor={form.fieldId} />

  <Field label="Name" {...form.field("name", { required: true })} announce="off">
    <Input value={form.values.name} onChange={(e) => form.setField("name", e.target.value)} />
  </Field>

  <Button type="submit" loading={form.submitting}>Save</Button>
</form>`;

const rules = `import { collect, required, money, maxLength } from "@/lib/form/validators";

// Declaration order is focus order: the first message is where submit sends you.
const validateProduct = (v: Product) =>
  collect([
    ["name",  v.name,  [required("Give this a name"), maxLength(60)]],
    ["price", v.price, [required("Enter a price"), money({ minorUnits: 2 })]],
  ]);`;

const array = `const rows = useFieldArray(form, "highlights");

rows.items.map((row, i) => (
  <Field {...form.field(rows.pathFor(i, "text"), { required: true })}>
    <Input value={row.text} onChange={(e) => rows.update(i, { text: e.target.value })} />
  </Field>
));`;

export default function FormPatternsPage() {
  return (
    <>
      <DsPageHeader
        title="Form"
        muted="patterns"
        description="The headless layer under the field components: values, validation, when an error is allowed to show, and what happens on submit. No form library — it is about 150 lines in lib/form, and every control stays controlled/uncontrolled-agnostic."
      />

      <DsSection
        title="Binding a form"
        description="useForm hands out ids, names and messages. It renders nothing, so a control can be anything that takes a value and reports a change."
      >
        <DsPreview label="useForm · submit-gated by default" className="block" code={bind}>
          <div className="w-full max-w-xl">
            <FormLayerDemo />
          </div>
        </DsPreview>
        <p className="max-w-[68ch] text-body text-fg-muted">
          Switch the control above to compare the two reveal modes. <strong className="text-body-strong">On submit</strong> stays quiet until the first
          attempt, then updates live — right for short forms, where a red field before you have finished typing is just nagging.{" "}
          <strong className="text-body-strong">On blur</strong> reveals each field as you leave it, which suits long forms where waiting until the end
          wastes a scroll.
        </p>
      </DsSection>

      <DsSection
        title="Writing the rules"
        description="A validator takes values and returns a message per field path. It is a plain function with no React in it, so the same rule runs on the server, in a route handler and in the browser."
      >
        <DsPreview label="lib/form/validators" className="block" code={rules} surface="sunken">
          <p className="text-body text-fg-muted">
            Composable rules: <code className="text-code">required</code>, <code className="text-code">minLength</code>, <code className="text-code">maxLength</code>, <code className="text-code">pattern</code>,{" "}
            <code className="text-code">money</code>, <code className="text-code">numberInRange</code>. The first failing rule wins, so a field never shows two complaints at once.
          </p>
        </DsPreview>
      </DsSection>

      <DsSection
        title="Repeated rows"
        description="useFieldArray keeps error paths qualified — variants.2.sku, never a bare 2 — because JS reorders integer-like keys, and the error map's order is the focus order."
      >
        <DsPreview label="useFieldArray" className="block" code={array}>
          <div className="w-full max-w-xl">
            <FieldArrayDemo />
          </div>
        </DsPreview>
      </DsSection>

      <DsSection
        title="Dependent fields"
        description="A category and its sub-category need a rule, not a component: when the parent changes, the child's value stops being valid. The design system documents it rather than shipping a widget, because the failure is a stale value, not a missing control."
      >
        <DsDoDont
          items={[
            {
              do: {
                example: (
                  <div className="w-full">
                    <DependentSelectDemo />
                  </div>
                ),
                text: "clear the child when the parent changes, and disable it until there is something to choose — with a hint that says why.",
              },
              dont: {
                example: (
                  <div className="w-full">
                    <DependentSelectDemo clearChild={false} />
                  </div>
                ),
                text: "leave the old sub-category selected under a new category. It looks answered and saves a combination that doesn't exist.",
              },
            },
          ]}
        />
      </DsSection>

      <DsSection
        title="Generated values"
        description="A handle derived from a name, overridable by hand — and never silently re-derived once it has been touched, because a URL that changes under a link is worse than one that is slightly stale."
      >
        <DsPreview label="SlugInput" className="block">
          <SlugInputDemo />
        </DsPreview>
      </DsSection>

      <DsSection
        title="Rows you can reorder"
        description="Add, remove and reorder. Buttons are the mechanism, not the fallback: HTML5 drag events never fire on touch, so a drag-only list simply doesn't work on a phone. Pointer drag is layered on top for mice, and every move is announced."
      >
        <DsPreview label="RepeatableList · sortable" className="block">
          <RepeatableListDemo />
        </DsPreview>
      </DsSection>

      <DsSection
        title="Arranging media"
        description="FileUpload picks files and reports progress; MediaGrid arranges what was picked — order, which one leads, what goes. Two components rather than one, because picking and managing are different jobs with different states."
      >
        <DsPreview label="MediaGrid · order + cover" className="block">
          <MediaGridDemo />
        </DsPreview>
        <DsPreview label="FileUpload · uploading, done, failed" className="block">
          <UploadProgressDemo />
        </DsPreview>
      </DsSection>

      <DsSection
        title="Option sets"
        description="Named options and their values — the part of “variants” that is domain-free. It stops before the grid on purpose: a row per combination with its own price, stock and SKU needs bulk-editable table cells, so it waits for the table work. cartesian() already does the arithmetic."
      >
        <DsPreview label="OptionSetEditor" className="block">
          <OptionSetDemo />
        </DsPreview>
      </DsSection>

      <DsSection title="Props">
        <div className="flex flex-col gap-5">
          <DsProps
            component="useForm(options)"
            rows={[
              { name: "initial", type: "T", description: "Starting values. Also the baseline for dirty." },
              { name: "validate", type: "(values) => FieldErrors", description: "Called on every change and on submit; may close over outside state." },
              { name: "reveal", type: '"submit" | "blur"', default: '"submit"', description: "When an error is allowed to show." },
              { name: "idPrefix", type: "string", description: "Prefix for generated field ids, so two forms on a page never collide." },
              { name: "isEqual", type: "(a, b) => boolean", description: "Pass when values hold File, Date or class instances — the default compares JSON." },
              { name: "readValues", type: "(form) => T", description: "Uncontrolled or server-action forms: read values from the DOM on submit." },
              { name: "onSubmit", type: "(values, { commit, setErrors })", description: "Runs only when validation passes. setErrors accepts server-side messages." },
            ]}
          />
          <DsProps
            component="useForm() returns"
            rows={[
              { name: "field(path, { required })", type: "FieldBinding", description: "{ id, name, error, required, onBlur } — spread onto <Field>." },
              { name: "values · setField · setValues", type: "T · (path, value) · setState", description: "setField takes a dot path: variants.2.sku." },
              { name: "errors · allErrors · result", type: "FieldErrors · FieldErrors · ValidationResult", description: "errors is gated by the reveal mode; allErrors is everything, for a live count." },
              { name: "dirty · dirtyFields · touched · attempted · submitting", type: "boolean · Set · Set · boolean · boolean", description: "dirtyFields records what was set, not a deep diff." },
              { name: "formProps", type: "{ id, noValidate, ref, onSubmit }", description: "Spread onto <form>. On failure it focuses the first message's field by id." },
              { name: "fieldId(path)", type: "string", description: "The id for a path — used to link a summary row to its control." },
              { name: "commit · discard · reset", type: "() => void", description: "Accept the draft as saved, throw edits away, or load a different record." },
            ]}
          />
          <DsProps
            component="useFieldArray(form, path)"
            rows={[
              { name: "items", type: "I[]", description: "The rows at that path." },
              { name: "append · remove · update · move", type: "(item) · (i) · (i, patch) · (from, to)", description: "Immutable row edits." },
              { name: "pathFor(index, key)", type: "FieldPath", description: '"highlights.2.text" — hand straight to form.field().' },
            ]}
          />
          <DsProps
            component="RepeatableList · MediaGrid · OptionSetEditor"
            rows={[
              { name: "items · onItemsChange · newItem · getKey", type: "T[] · (items) · () => T · (item, i) => string", description: "RepeatableList: rows and how to make one." },
              { name: "renderRow", type: "(item, helpers) => ReactNode", description: "helpers: remove, moveUp, moveDown, index, isFirst, isLast." },
              { name: "min · max · sortable · itemLabel", type: "number · number · boolean · string", description: "itemLabel names the row in button labels and announcements." },
              { name: "primaryId · onPrimaryChange · primaryLabel", type: "string · (id) => void · string", description: "MediaGrid: which item leads. Omit to drop the concept." },
              { name: "value · onValueChange · max · warnAbove", type: "OptionSet[] · (sets) · number · number", description: "OptionSetEditor: warns once the combinations get unwieldy." },
            ]}
          />
          <DsProps
            component="SlugInput · useSortableList"
            rows={[
              { name: "value · onValueChange", type: "string · (value) => void", description: "SlugInput: the handle itself." },
              { name: "source · sourceLabel · autoSync", type: "string · string · boolean", default: "— · \"name\" · true", description: "Follows the source until someone edits it, then stops for good." },
              { name: "prefix", type: "ReactNode", description: "Shown inside the field, e.g. bluesigns.shop/products/." },
              { name: "count · onMove · itemLabel", type: "number · (from, to) · string", description: "useSortableList: returns itemProps(index), moveUp, moveDown and an announcement." },
            ]}
          />
          <DsProps
            component="FormErrorSummary"
            rows={[
              { name: "result", type: "ValidationResult", description: "Usually form.result." },
              { name: "show", type: "boolean", default: "true", description: "Usually form.attempted." },
              { name: "hrefFor", type: "(path) => string | undefined", description: "Maps a path to a field id. Return undefined to drop the link." },
            ]}
          />
        </div>
      </DsSection>
    </>
  );
}
