"use client";

import { cn } from "@/lib/cn";
import { combinationCount, type OptionSet } from "@/lib/form/cartesian";
import { Field } from "./field";
import { Input } from "./input";
import { RepeatableList } from "./repeatable-list";
import { TagInput } from "./tag-input";

export type OptionSetEditorProps = {
  value: OptionSet[];
  onValueChange: (sets: OptionSet[]) => void;
  /** Sets beyond this are refused — two or three axes is already a big grid. */
  max?: number;
  /** Words for the thing being described: "option", "attribute", "specification". */
  setLabel?: string;
  /** Warn once the combinations pass this. */
  warnAbove?: number;
  className?: string;
};

const newSet = (): OptionSet => ({ id: `set-${Date.now().toString(36)}`, name: "", values: [] });
const valueId = (name: string) => `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

/**
 * Named option sets and their values — Size: S, M, L — which is the part of "variants" that
 * is domain-free.
 *
 * It deliberately stops before the grid. Generating a row per combination and hanging price,
 * stock and SKU off each one needs bulk-editable table cells, which belong with the table
 * work; `cartesian()` in lib/form does the arithmetic when that arrives.
 */
export function OptionSetEditor({ value, onValueChange, max = 3, setLabel = "option", warnAbove = 50, className }: OptionSetEditorProps) {
  const total = combinationCount(value);
  const update = (index: number, patch: Partial<OptionSet>) => onValueChange(value.map((set, i) => (i === index ? { ...set, ...patch } : set)));

  return (
    <div data-slot="option-set-editor" className={cn("flex flex-col gap-3", className)}>
      <RepeatableList
        items={value}
        onItemsChange={onValueChange}
        newItem={newSet}
        getKey={(set) => set.id}
        max={max}
        itemLabel={setLabel.charAt(0).toUpperCase() + setLabel.slice(1)}
        addLabel={`Add ${setLabel}`}
        sortable
        empty={<p className="text-body text-fg-muted">No {setLabel}s yet — add one to describe how this varies.</p>}
        renderRow={(set, { index }) => (
          <div className="grid gap-3 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
            <Field label={index === 0 ? `${setLabel.charAt(0).toUpperCase() + setLabel.slice(1)} name` : undefined}>
              <Input aria-label={`${setLabel} ${index + 1} name`} value={set.name} placeholder="Size" onChange={(e) => update(index, { name: e.target.value })} />
            </Field>
            <Field label={index === 0 ? "Values" : undefined}>
              <TagInput
                aria-label={`Values for ${set.name || `${setLabel} ${index + 1}`}`}
                value={set.values.map((v) => v.label)}
                onValueChange={(labels) => update(index, { values: labels.map((label) => ({ id: valueId(label), label })) })}
                placeholder="S, M, L"
              />
            </Field>
          </div>
        )}
      />
      {total > 0 && (
        <p className={cn("text-caption figures", total > warnAbove ? "text-warning-fg" : "text-fg-muted")} aria-live="polite">
          {total} combination{total === 1 ? "" : "s"}
          {total > warnAbove && " — that is a lot of rows to fill in by hand"}
        </p>
      )}
    </div>
  );
}
