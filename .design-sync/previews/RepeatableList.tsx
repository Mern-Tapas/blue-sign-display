import { useState } from "react";
import { EmptyState, Field, Input, RepeatableList, icons } from "@bluesigns/ui";

const { ListPlus } = icons;

type Spec = { id: string; label: string; detail: string };

function SpecList({ initial, sortable = true }: { initial: Spec[]; sortable?: boolean }) {
  const [specs, setSpecs] = useState<Spec[]>(initial);
  const update = (id: string, patch: Partial<Spec>) => setSpecs((all) => all.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  return (
    <RepeatableList
      items={specs}
      onItemsChange={setSpecs}
      newItem={() => ({ id: `s${Date.now()}`, label: "", detail: "" })}
      getKey={(s) => s.id}
      itemLabel="Specification"
      addLabel="Add specification"
      max={6}
      sortable={sortable}
      empty={<EmptyState compact icon={<ListPlus aria-hidden />} title="No specifications yet" description="Add material, weight or care details." />}
      renderRow={(spec, { index }) => (
        <div className="grid grid-cols-2 gap-2">
          <Field label={index === 0 ? "Label" : undefined}>
            <Input aria-label={`Specification ${index + 1} label`} value={spec.label} placeholder="Material" onChange={(e) => update(spec.id, { label: e.target.value })} />
          </Field>
          <Field label={index === 0 ? "Detail" : undefined}>
            <Input aria-label={`Specification ${index + 1} detail`} value={spec.detail} placeholder="Recycled knit upper" onChange={(e) => update(spec.id, { detail: e.target.value })} />
          </Field>
        </div>
      )}
    />
  );
}

export const Specifications = () => (
  <div style={{ maxWidth: 640 }}>
    <SpecList
      initial={[
        { id: "s1", label: "Material", detail: "Recycled knit upper" },
        { id: "s2", label: "Weight", detail: "268 g" },
        { id: "s3", label: "Care", detail: "Hand wash, air dry" },
      ]}
    />
  </div>
);

export const NotSortable = () => (
  <div style={{ maxWidth: 640 }}>
    <SpecList sortable={false} initial={[{ id: "s1", label: "Warranty", detail: "1 year manufacturer" }]} />
  </div>
);

export const Empty = () => (
  <div style={{ maxWidth: 640 }}>
    <SpecList initial={[]} />
  </div>
);
