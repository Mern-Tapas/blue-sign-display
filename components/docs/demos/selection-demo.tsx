"use client";

import { useState } from "react";
import { Landmark, Tag, Truck, Zap } from "lucide-react";
import { DsGrid, DsPreview } from "@/components/docs/ds-section";
import { Chip, ChipGroup } from "@/components/ui/chip";
import { Combobox } from "@/components/ui/combobox";
import { Field } from "@/components/ui/field";
import { RatingInput } from "@/components/ui/rating-input";
import { banks, INDIAN_STATES } from "@/lib/data/india";

const stateOptions = INDIAN_STATES.map((s) => ({ value: s, label: s }));
const brandOptions = ["Sonora", "Aurel", "Northwind", "Meridian", "Kinetic", "Halden", "Velocity", "BlueSigns Basics"].map((b, i) => ({
  value: b,
  label: b,
  description: `${[128, 96, 74, 61, 40, 33, 21, 12][i]} products`,
}));

export function ComboboxDemo() {
  const [state, setState] = useState<string | null>("Karnataka");
  const [brandsPicked, setBrands] = useState<string[]>(["Sonora"]);
  return (
    <DsGrid>
      <DsPreview label="Combobox · single" className="flex-col items-stretch" code={`<Combobox options={states} value={state} onValueChange={setState} />`}>
        <Field label="State" required>
          <Combobox options={stateOptions} value={state} onValueChange={setState} placeholder="Select state" searchPlaceholder="Search states" required />
        </Field>
        <Field label="Bank" hint="Popular banks are pinned until you search.">
          <Combobox
            options={banks.map((b) => ({ value: b.id, label: b.name, icon: <Landmark aria-hidden /> }))}
            popularValues={banks.filter((b) => b.popular).map((b) => b.id)}
            placeholder="Choose your bank"
            searchPlaceholder="Search 12 banks"
          />
        </Field>
      </DsPreview>
      <DsPreview label="Combobox · multiple" className="flex-col items-stretch" code={`<Combobox multiple options={brands} value={picked} onValueChange={setPicked} />`}>
        <Field label="Brand">
          <Combobox multiple options={brandOptions} value={brandsPicked} onValueChange={setBrands} placeholder="Any brand" searchPlaceholder="Search brands" />
        </Field>
        <Field label="Disabled">
          <Combobox options={stateOptions} defaultValue="Delhi" disabled />
        </Field>
        <Field label="Invalid" error="Select a state to continue">
          <Combobox options={stateOptions} placeholder="Select state" />
        </Field>
      </DsPreview>
    </DsGrid>
  );
}

export function ChipDemo() {
  const [fast, setFast] = useState(true);
  const [tags, setTags] = useState(["Bluetooth 5.3", "Noise cancelling", "Under ₹10,000"]);
  return (
    <DsGrid>
      <DsPreview label="ChipGroup" className="flex-col items-start" code={`<ChipGroup type="multiple" aria-label="Discount" options={…} />`}>
        <ChipGroup
          aria-label="Discount"
          defaultValue={["30"]}
          options={[
            { value: "10", label: "10% and above", count: 212 },
            { value: "30", label: "30% and above", count: 96 },
            { value: "50", label: "50% and above", count: 18 },
            { value: "70", label: "70% and above", count: 0, disabled: true },
          ]}
        />
        <ChipGroup
          type="single"
          aria-label="Size"
          size="md"
          defaultValue="M"
          showCheck={false}
          options={["XS", "S", "M", "L", "XL", "XXL"].map((s) => ({ value: s, label: s, disabled: s === "XS" }))}
        />
        <ChipGroup
          scroll
          variant="sunken"
          aria-label="Quick filters"
          className="w-full"
          options={[
            { value: "fast", label: "Delivery by tomorrow", icon: <Truck aria-hidden /> },
            { value: "assured", label: "BlueSigns Assured" },
            { value: "offers", label: "Bank offers", icon: <Tag aria-hidden /> },
            { value: "new", label: "New arrivals" },
            { value: "cod", label: "Pay on delivery" },
          ]}
        />
      </DsPreview>
      <DsPreview label="Chip · toggle & removable" className="flex-col items-start">
        <div className="flex flex-wrap gap-2">
          <Chip selected={fast} onClick={() => setFast((f) => !f)} icon={<Zap aria-hidden />}>
            Express delivery
          </Chip>
          <Chip>Action chip</Chip>
          <Chip disabled>Disabled</Chip>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Chip key={t} variant="sunken" onRemove={() => setTags((all) => all.filter((x) => x !== t))}>
              {t}
            </Chip>
          ))}
          {tags.length === 0 && <p className="text-body text-fg-muted">All removed.</p>}
        </div>
      </DsPreview>
    </DsGrid>
  );
}

export function RatingInputDemo() {
  const [rating, setRating] = useState(0);
  return (
    <DsGrid>
      <DsPreview label="RatingInput" className="flex-col items-start" code={`<RatingInput value={rating} onValueChange={setRating} />`}>
        <Field label="How would you rate this product?" required>
          <RatingInput value={rating} onValueChange={setRating} />
        </Field>
        <p className="text-caption text-fg-muted figures">Value: {rating || "none"} · arrow keys change the score</p>
      </DsPreview>
      <DsPreview label="Sizes & disabled" className="flex-col items-start">
        <RatingInput aria-label="Delivery rating" size="md" defaultValue={4} />
        <RatingInput aria-label="Packaging rating" size="xl" defaultValue={5} showLabel={false} />
        <RatingInput aria-label="Disabled rating" size="md" defaultValue={3} disabled />
      </DsPreview>
    </DsGrid>
  );
}
